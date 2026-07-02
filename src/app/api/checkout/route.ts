import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getStoreProduct } from "@/data/store";

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
    const { slug, size, shipping } = body ?? {};

    const quantity = Math.floor(Number(body?.quantity));

    // Preço e título vêm SEMPRE do catálogo (src/data/store.ts) — nunca do
    // cliente, que só indica o slug. Impede checkout com preço adulterado.
    const product = typeof slug === "string" ? getStoreProduct(slug) : undefined;

    if (!product || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "Dados do produto inválidos." }, { status: 400 });
    }
    if (typeof size === "string" && size && !product.sizes.includes(size)) {
      return NextResponse.json({ error: "Tamanho inválido." }, { status: 400 });
    }

    // Frete calculado no frontend via Melhor Envio (CEP do cliente).
    // Se ausente (ex: cálculo indisponível), segue sem custo de envio.
    let shippingOptions:
      | NonNullable<Stripe.Checkout.SessionCreateParams["shipping_options"]>
      | undefined;
    const shippingName = shipping?.name;
    const shippingPrice = Number(shipping?.price);
    if (typeof shippingName === "string" && shippingName && Number.isFinite(shippingPrice) && shippingPrice >= 0) {
      shippingOptions = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shippingPrice * 100), currency: "brl" },
            display_name: shippingName.slice(0, 100),
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "pt-BR",
      shipping_address_collection: { allowed_countries: ["BR"] },
      ...(shippingOptions ? { shipping_options: shippingOptions } : {}),
      phone_number_collection: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.title,
              description: size && size !== "Único" ? `Tamanho: ${size}` : undefined,
              metadata: { slug: product.slug },
            },
          },
          quantity,
        },
      ],
      success_url: `${ORIGIN}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/store/product/${product.slug}`,
      metadata: { slug: product.slug, size: size ?? "", quantity: String(quantity) },
      payment_intent_data: {
        description: `Pax Brasiliana — ${product.title}`,
        metadata: { slug: product.slug, size: size ?? "" },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento." }, { status: 500 });
  }
}
