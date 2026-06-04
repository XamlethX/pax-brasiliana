import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, FROM, TO } from "@/lib/email";

export const runtime = "nodejs";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const amount = ((session.amount_total ?? 0) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const productSlug = session.metadata?.slug ?? "—";
    const size = session.metadata?.size;

    // Email sends must never throw back to Stripe — that would trigger
    // delivery retries for an order we've already recorded. Best-effort only.
    try {
      const resend = getResend();
      if (resend) {
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
    } catch (err) {
      console.error("[webhook] email send failed (non-fatal)", err);
    }
  }

  return NextResponse.json({ received: true });
}
