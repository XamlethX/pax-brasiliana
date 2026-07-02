import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, emailLayout, emailButton, FROM, TO, SITE_URL } from "@/lib/email";

export const runtime = "nodejs";

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Notification + receipt for a completed merch order.
 * Best-effort: email failures are logged, never thrown back to Stripe.
 */
async function handleStoreOrder(session: Stripe.Checkout.Session) {
  const resend = getResend();
  if (!resend) return;

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const customerPhone = session.customer_details?.phone;
  const amount = brl(session.amount_total ?? 0);
  const shippingAmount = session.shipping_cost?.amount_total;
  const productSlug = session.metadata?.slug ?? "—";
  const size = session.metadata?.size;
  const quantity = session.metadata?.quantity;

  const shippingDetails = session.collected_information?.shipping_details;
  const shipping = shippingDetails?.address ?? session.customer_details?.address;
  const shippingName = shippingDetails?.name ?? customerName;
  const addressHtml = shipping
    ? `
      <p><strong>Endereço de entrega:</strong><br/>
      ${esc(shippingName) || "—"}<br/>
      ${esc(shipping.line1) || ""}${shipping.line2 ? `, ${esc(shipping.line2)}` : ""}<br/>
      ${esc(shipping.city) || ""} - ${esc(shipping.state) || ""}<br/>
      CEP: ${esc(shipping.postal_code) || "—"}<br/>
      ${esc(shipping.country) || ""}</p>
    `
    : `<p><strong>Endereço de entrega:</strong> não coletado</p>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `[Loja] Novo pedido — ${productSlug}`,
    html: `
      <p><strong>Produto:</strong> ${esc(productSlug)}</p>
      ${quantity ? `<p><strong>Quantidade:</strong> ${esc(quantity)}</p>` : ""}
      ${size ? `<p><strong>Tamanho:</strong> ${esc(size)}</p>` : ""}
      <p><strong>Valor total:</strong> ${esc(amount)}</p>
      ${shippingAmount != null ? `<p><strong>Frete incluso:</strong> ${esc(brl(shippingAmount))}</p>` : ""}
      <p><strong>Cliente:</strong> ${esc(customerName) || "—"}</p>
      <p><strong>Email:</strong> ${esc(customerEmail) || "—"}</p>
      <p><strong>Telefone:</strong> ${esc(customerPhone) || "—"}</p>
      ${addressHtml}
      <p><strong>Session ID:</strong> ${esc(session.id)}</p>
    `,
  });

  if (customerEmail) {
    const firstName = customerName?.split(" ")[0];
    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Pedido confirmado — Pax Brasiliana",
      html: emailLayout({
        preheader: `Pedido confirmado (${amount}). Avisaremos assim que ele for despachado.`,
        body: `
          <p style="margin:0 0 16px;">Olá${firstName ? `, ${esc(firstName)}` : ""}.</p>
          <p style="margin:0 0 16px;">Seu pedido foi confirmado. Valor total: <strong>${esc(amount)}</strong>${shippingAmount != null ? ` (frete incluso: ${esc(brl(shippingAmount))})` : ""}.</p>
          <p style="margin:0 0 16px;">100% do valor vai diretamente para a missão da Pax Brasiliana: reacender a capacidade do Brasil de construir.</p>
          <p style="margin:0;">Entraremos em contato em breve com os detalhes de envio e o código de rastreio.</p>
        `,
      }),
    });
  }
}

/**
 * Notification + thank-you for a new donation (one-time or first month of a
 * monthly subscription). Recurring renewals are handled via `invoice.paid`.
 */
async function handleDonation(session: Stripe.Checkout.Session) {
  const resend = getResend();
  if (!resend) return;

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const amount = brl(session.amount_total ?? 0);
  const isMonthly = session.metadata?.frequency === "monthly";
  const freqLabel = isMonthly ? "mensal" : "única";

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `[Doação] Nova doação ${freqLabel} — ${amount}`,
    html: `
      <p><strong>Tipo:</strong> Doação ${esc(freqLabel)}</p>
      <p><strong>Valor:</strong> ${esc(amount)}${isMonthly ? " / mês" : ""}</p>
      <p><strong>Doador:</strong> ${esc(customerName) || "—"}</p>
      <p><strong>Email:</strong> ${esc(customerEmail) || "—"}</p>
      <p><strong>Session ID:</strong> ${esc(session.id)}</p>
    `,
  });

  if (customerEmail) {
    const firstName = customerName?.split(" ")[0];
    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Obrigado pela sua doação — Pax Brasiliana",
      html: emailLayout({
        preheader: `Sua doação ${freqLabel} de ${amount} foi confirmada. Cada real constrói algo.`,
        introBody: `
          <p style="margin:0 0 16px;">Olá${firstName ? `, ${esc(firstName)}` : ""}.</p>
          <p style="margin:0 0 16px;">Sua doação ${esc(freqLabel)} de <strong>${esc(amount)}${isMonthly ? " por mês" : ""}</strong> foi confirmada. Obrigado.</p>
          <p style="margin:0;">Somos um movimento enxuto, tocado por voluntários — 100% da sua doação financia diretamente a missão: reacender a capacidade do Brasil de construir indústria, tecnologia e cultura.</p>
        `,
        heroImage: `${SITE_URL}/images/cidade-futura.png`,
        heroAlt: "Ilustração de uma cidade brasileira do futuro",
        darkSection: `
          <p style="margin:0 0 20px; font-family:'Courier New', Courier, monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:#F8F6E8;">O que a sua doação constrói</p>
          <p style="margin:0 0 16px;"><strong>Projetos abertos.</strong> Ferramentas públicas como o mapa da cadeia produtiva brasileira e o rastreador de empresas da B3 — pesquisa e dados acessíveis a qualquer brasileiro.</p>
          <p style="margin:0 0 16px;"><strong>Ideias em circulação.</strong> Ensaios, manifesto e uma plataforma de educação sobre a ambição industrial e tecnológica do Brasil.</p>
          <p style="margin:0 0 24px;"><strong>Um movimento crescendo.</strong> Comunidade, eventos e novas instituições pra quem decidiu parar de esperar e começar a construir.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;">
            <tr><td style="padding-bottom:10px;">${emailButton("Conheça os projetos", `${SITE_URL}/projetos`)}</td></tr>
            <tr><td>${emailButton("Ler o manifesto", `${SITE_URL}/manifesto`, "light")}</td></tr>
          </table>
          ${isMonthly ? `<p style="margin:24px 0 0; font-size:13px; color:rgba(248,246,232,0.7);">Sua doação se renova mensalmente. Pra cancelar a qualquer momento, basta responder este email.</p>` : ""}
        `,
      }),
    });
  }
}

/**
 * Notification for a recurring monthly donation renewal. Skips the first
 * invoice (billing_reason "subscription_create"), which is already covered by
 * the checkout.session.completed handler, to avoid duplicate emails.
 */
async function handleRenewal(invoice: Stripe.Invoice) {
  if (invoice.billing_reason !== "subscription_cycle") return;

  const resend = getResend();
  if (!resend) return;

  const amount = brl(invoice.amount_paid ?? 0);
  const customerEmail = invoice.customer_email;
  const customerName = invoice.customer_name;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `[Doação] Renovação mensal — ${amount}`,
    html: `
      <p><strong>Renovação de doação mensal.</strong></p>
      <p><strong>Valor:</strong> ${esc(amount)}</p>
      <p><strong>Doador:</strong> ${esc(customerName) || "—"}</p>
      <p><strong>Email:</strong> ${esc(customerEmail) || "—"}</p>
      <p><strong>Invoice:</strong> ${esc(invoice.id)}</p>
    `,
  });
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature error", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Email sends must never throw back to Stripe — that would trigger delivery
  // retries for an event we've already recorded. Best-effort only.
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.type === "donation") {
        await handleDonation(session);
      } else {
        await handleStoreOrder(session);
      }
    } else if (event.type === "invoice.paid") {
      await handleRenewal(event.data.object as Stripe.Invoice);
    }
  } catch (err) {
    console.error("[webhook] handler failed (non-fatal)", err);
  }

  return NextResponse.json({ received: true });
}
