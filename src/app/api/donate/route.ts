import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Guard rails for the donation amount (in BRL).
const MIN_BRL = 5;
const MAX_BRL = 1_000_000;

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });

  try {
    const body = await req.json();
    const { frequency } = body ?? {};

    const isMonthly = frequency === "monthly";
    // Only "once" and "monthly" are valid frequencies.
    if (frequency !== "once" && frequency !== "monthly") {
      return NextResponse.json({ error: "Frequência inválida." }, { status: 400 });
    }

    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount < MIN_BRL || amount > MAX_BRL) {
      return NextResponse.json(
        { error: `Informe um valor entre R$${MIN_BRL} e R$${MAX_BRL.toLocaleString("pt-BR")}.` },
        { status: 400 }
      );
    }

    const unitAmount = Math.round(amount * 100);
    const productName = isMonthly
      ? "Doação mensal — Pax Brasiliana"
      : "Doação — Pax Brasiliana";

    const metadata = { type: "donation", frequency };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: isMonthly ? "subscription" : "payment",
      locale: "pt-BR",
      submit_type: isMonthly ? undefined : "donate",
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: unitAmount,
            product_data: { name: productName },
            ...(isMonthly ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${ORIGIN}/doar/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/doar`,
      metadata,
      ...(isMonthly
        ? { subscription_data: { metadata } }
        : {
            payment_intent_data: {
              description: "Doação Pax Brasiliana",
              metadata,
            },
          }),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[donate]", err);
    return NextResponse.json({ error: "Erro ao criar doação." }, { status: 500 });
  }
}
