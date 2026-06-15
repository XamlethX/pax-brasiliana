/**
 * Cotação de frete via API da Melhor Envio.
 *
 * Configuração necessária (.env.local):
 * - MELHOR_ENVIO_TOKEN: token de integração (Melhor Envio → Configurações → Tokens)
 * - MELHOR_ENVIO_FROM_CEP: CEP de origem dos envios
 * - MELHOR_ENVIO_SANDBOX: "true" pra usar sandbox.melhorenvio.com.br (opcional)
 */

const ME_BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";

export interface ShippingProductInput {
  id: string;
  weightKg: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
  insuranceValue: number;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  company: string;
  name: string;
  price: number;
  deliveryTime: number | null;
}

interface MelhorEnvioRawOption {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  company?: { id: number; name: string };
  error?: string | null;
}

export class ShippingNotConfiguredError extends Error {}

export async function calculateShipping(
  toPostalCode: string,
  products: ShippingProductInput[]
): Promise<ShippingOption[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const fromPostalCode = process.env.MELHOR_ENVIO_FROM_CEP;

  if (!token || !fromPostalCode) {
    throw new ShippingNotConfiguredError(
      "Melhor Envio não configurado (MELHOR_ENVIO_TOKEN / MELHOR_ENVIO_FROM_CEP ausentes)."
    );
  }

  const res = await fetch(`${ME_BASE_URL}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      // Exigido pela Melhor Envio.
      "User-Agent": "Pax Brasiliana (contato@paxbrasiliana.com)",
    },
    body: JSON.stringify({
      from: { postal_code: onlyDigits(fromPostalCode) },
      to: { postal_code: onlyDigits(toPostalCode) },
      products: products.map((p) => ({
        id: p.id,
        width: p.widthCm,
        height: p.heightCm,
        length: p.lengthCm,
        weight: p.weightKg,
        insurance_value: p.insuranceValue,
        quantity: p.quantity,
      })),
    }),
  });

  if (!res.ok) {
    throw new Error(`Melhor Envio respondeu ${res.status}`);
  }

  const data: MelhorEnvioRawOption[] = await res.json();

  return data
    .filter((opt) => !opt.error && (opt.custom_price ?? opt.price) !== undefined)
    .map((opt) => ({
      id: String(opt.id),
      company: opt.company?.name ?? "",
      name: opt.name,
      price: Number(opt.custom_price ?? opt.price),
      deliveryTime: opt.delivery_time ?? null,
    }))
    .filter((opt) => Number.isFinite(opt.price))
    .sort((a, b) => a.price - b.price);
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}
