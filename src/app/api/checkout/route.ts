import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getStoreProduct } from "@/data/store";
import {
  calculateShipping,
  InvalidPostalCodeError,
  type ShippingOption,
} from "@/lib/melhor-envio";

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

    // Frete NUNCA vem precificado do cliente: ele manda só o CEP e o id da
    // opção que escolheu, e o servidor recota na Melhor Envio e cobra o preço
    // da cotação. Impede checkout com frete adulterado (ex.: price 0 via curl).
    const shippingId = shipping?.id != null ? String(shipping.id) : "";
    const shippingCep =
      typeof shipping?.cep === "string" ? shipping.cep.replace(/\D/g, "") : "";
    if (!shippingId || shippingCep.length !== 8) {
      return NextResponse.json(
        { error: "Frete ausente. Calcule e selecione o frete antes de pagar." },
        { status: 400 }
      );
    }

    let chosen: ShippingOption | undefined;
    try {
      const options = await calculateShipping(shippingCep, [
        {
          id: product.slug,
          weightKg: product.shipping.weightKg,
          widthCm: product.shipping.widthCm,
          heightCm: product.shipping.heightCm,
          lengthCm: product.shipping.lengthCm,
          insuranceValue: product.price,
          quantity,
        },
      ]);
      chosen = options.find((opt) => opt.id === shippingId);
    } catch (err) {
      if (err instanceof InvalidPostalCodeError) {
        return NextResponse.json({ error: "CEP de entrega inválido." }, { status: 400 });
      }
      // Sem cotação confiável (Melhor Envio fora ou não configurado), não
      // vende com frete não verificado — inclui ShippingNotConfiguredError.
      console.error("[checkout] falha ao confirmar frete", err);
      return NextResponse.json(
        { error: "Não foi possível confirmar o frete. Tente novamente em instantes." },
        { status: 503 }
      );
    }
    if (!chosen) {
      return NextResponse.json(
        { error: "Opção de frete indisponível. Recalcule o frete e tente de novo." },
        { status: 409 }
      );
    }

    const shippingOptions: NonNullable<
      Stripe.Checkout.SessionCreateParams["shipping_options"]
    > = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(chosen.price * 100), currency: "brl" },
          display_name:
            `${chosen.company} ${chosen.name}`.trim().slice(0, 100) || "Frete",
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "pt-BR",
      shipping_address_collection: { allowed_countries: ["BR"] },
      shipping_options: shippingOptions,
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
      metadata: {
        slug: product.slug,
        size: size ?? "",
        quantity: String(quantity),
        // Serviço confirmado pelo servidor — usado na hora de comprar a
        // etiqueta na Melhor Envio.
        shipping_service: chosen.id,
        shipping_service_name: `${chosen.company} ${chosen.name}`.trim().slice(0, 100),
        shipping_cep: shippingCep,
      },
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
