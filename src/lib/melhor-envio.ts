/**
 * Cotação de frete via API da Melhor Envio.
 *
 * Configuração necessária:
 * - MELHOR_ENVIO_FROM_CEP: CEP de origem dos envios
 * - MELHOR_ENVIO_SANDBOX: "true" pra usar sandbox.melhorenvio.com.br (opcional)
 * - Token OAuth: gerenciado em melhor-envio-token.ts (Supabase + auto-refresh,
 *   com fallback pra MELHOR_ENVIO_TOKEN do env).
 */
import { getValidAccessToken, ShippingNotConfiguredError } from "@/lib/melhor-envio-token";

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

// Re-export pra quem importa de "@/lib/melhor-envio".
export { ShippingNotConfiguredError };

/** CEP de destino inválido ou não encontrado (Melhor Envio retorna 422). */
export class InvalidPostalCodeError extends Error {}

export async function calculateShipping(
  toPostalCode: string,
  products: ShippingProductInput[]
): Promise<ShippingOption[]> {
  const fromPostalCode = process.env.MELHOR_ENVIO_FROM_CEP;
  if (!fromPostalCode) {
    throw new ShippingNotConfiguredError("MELHOR_ENVIO_FROM_CEP ausente.");
  }

  const token = await getValidAccessToken();

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

  if (res.status === 422) {
    // CEP inválido / dados rejeitados pela validação do Melhor Envio.
    throw new InvalidPostalCodeError("CEP de destino inválido ou não encontrado.");
  }
  if (!res.ok) {
    throw new Error(`Melhor Envio respondeu ${res.status}`);
  }

  const raw = await res.json();
  // Em alguns erros o Melhor Envio responde 200 com um objeto, não um array.
  if (!Array.isArray(raw)) {
    throw new Error("Resposta inesperada do Melhor Envio.");
  }
  const data: MelhorEnvioRawOption[] = raw;

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
