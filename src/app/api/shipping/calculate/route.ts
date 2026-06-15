import { NextRequest, NextResponse } from "next/server";
import { getStoreProduct } from "@/data/store";
import { calculateShipping, ShippingNotConfiguredError } from "@/lib/melhor-envio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, quantity, cep } = body ?? {};

    const product = typeof slug === "string" ? getStoreProduct(slug) : undefined;
    const qty = Math.floor(Number(quantity));
    const cleanCep = typeof cep === "string" ? cep.replace(/\D/g, "") : "";

    if (!product) {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
    }
    if (cleanCep.length !== 8) {
      return NextResponse.json({ error: "CEP inválido." }, { status: 400 });
    }

    const options = await calculateShipping(cleanCep, [
      {
        id: product.slug,
        weightKg: product.shipping.weightKg,
        widthCm: product.shipping.widthCm,
        heightCm: product.shipping.heightCm,
        lengthCm: product.shipping.lengthCm,
        insuranceValue: product.price,
        quantity: qty,
      },
    ]);

    if (options.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma opção de frete disponível para este CEP." },
        { status: 422 }
      );
    }

    return NextResponse.json({ options });
  } catch (err) {
    if (err instanceof ShippingNotConfiguredError) {
      console.error("[shipping/calculate]", err.message);
      return NextResponse.json({ error: "Cálculo de frete não configurado." }, { status: 503 });
    }
    console.error("[shipping/calculate]", err);
    return NextResponse.json({ error: "Erro ao calcular frete." }, { status: 500 });
  }
}
