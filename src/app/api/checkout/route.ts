import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });

  try {
    const body = await req.json();
    const { slug, title, price, size } = body ?? {};

    const numericPrice = Number(price);
    const quantity = Math.floor(Number(body?.quantity));

    if (
      typeof slug !== "string" || !slug ||
      typeof title !== "string" || !title ||
      !Number.isFinite(numericPrice) || numericPrice <= 0 ||
      !Number.isFinite(quantity) || quantity < 1 || quantity > 99
    ) {
      return NextResponse.json({ error: "Dados do produto inválidos." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "pt-BR",
      shipping_address_collection: { allowed_countries: ["BR"] },
      phone_number_collection: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: Math.round(numericPrice * 100),
            product_data: {
              name: title,
              description: size && size !== "Único" ? `Tamanho: ${size}` : undefined,
              metadata: { slug },
            },
          },
          quantity,
        },
      ],
      success_url: `${ORIGIN}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/store/product/${slug}`,
      metadata: { slug, size: size ?? "" },
      payment_intent_data: {
        description: `Pax Brasiliana — ${title}`,
        metadata: { slug, size: size ?? "" },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento." }, { status: 500 });
  }
}
