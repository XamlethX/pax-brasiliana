import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ME_BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";

/**
 * Setup helper (rodar uma vez, localmente): inicia o fluxo OAuth da Melhor
 * Envio. Abrir esta rota no browser, fazer login/autorizar, e o callback
 * devolve o access_token + refresh_token pra colar no .env.local.
 *
 * Requer MELHOR_ENVIO_CLIENT_ID e MELHOR_ENVIO_REDIRECT_URI no .env.local.
 */
export async function GET() {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "MELHOR_ENVIO_CLIENT_ID / MELHOR_ENVIO_REDIRECT_URI não configurados no .env.local." },
      { status: 503 }
    );
  }

  const url = new URL(`${ME_BASE_URL}/oauth/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "shipping-calculate");
  url.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(url.toString());
}
