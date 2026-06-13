import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, FROM, TO } from "@/lib/email";

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
  const productSlug = session.metadata?.slug ?? "—";
  const size = session.metadata?.size;

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
      ${size ? `<p><strong>Tamanho:</strong> ${esc(size)}</p>` : ""}
      <p><strong>Valor:</strong> ${esc(amount)}</p>
      <p><strong>Cliente:</strong> ${esc(customerName) || "—"}</p>
      <p><strong>Email:</strong> ${esc(customerEmail) || "—"}</p>
      <p><strong>Telefone:</strong> ${esc(customerPhone) || "—"}</p>
      ${addressHtml}
      <p><strong>Session ID:</strong> ${esc(session.id)}</p>
    `,
  });

  if (customerEmail) {
    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Pedido recebido — Pax Brasiliana",
      html: `
        <p>Olá${customerName ? `, ${esc(customerName)}` : ""}.</p>
        <p>Seu pedido foi confirmado. Valor: ${esc(amount)}.</p>
        <p>100% do valor vai diretamente para a missão da Pax Brasiliana.</p>
        <p>Entraremos em contato com os detalhes de envio.</p>
        <p>— Pax Brasiliana</p>
      `,
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
    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Obrigado pela sua doação — Pax Brasiliana",
      html: `
        <p>Olá${customerName ? `, ${esc(customerName)}` : ""}.</p>
        <p>Sua doação ${esc(freqLabel)} de ${esc(amount)}${isMonthly ? " por mês" : ""} foi confirmada.</p>
        <p>100% do valor vai diretamente para a missão da Pax Brasiliana: reacender a capacidade do Brasil de construir coisas grandes.</p>
        ${isMonthly ? "<p>Você pode cancelar a qualquer momento respondendo a este email.</p>" : ""}
        <p>— Pax Brasiliana</p>
      `,
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
