import { NextRequest, NextResponse } from "next/server";
import { storeTokens } from "@/lib/melhor-envio-token";

export const runtime = "nodejs";

const ME_BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";

const page = (body: string, status = 200) =>
  new NextResponse(
    `<!doctype html><html><body style="font-family: -apple-system, monospace; padding: 2rem; max-width: 640px; margin: 0 auto;">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

/**
 * Setup helper (rodar uma vez, localmente): recebe o `code` do redirect OAuth
 * da Melhor Envio, troca por access_token + refresh_token, e exibe os valores
 * pra colar no .env.local como MELHOR_ENVIO_TOKEN / MELHOR_ENVIO_REFRESH_TOKEN.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const errorParam = req.nextUrl.searchParams.get("error");

  if (errorParam) {
    return page(`<h1>Erro</h1><p>${errorParam}</p>`, 400);
  }
  if (!code) {
    return page("<h1>Código ausente</h1><p>Acesse /api/shipping/oauth/start primeiro.</p>", 400);
  }

  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  const redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return page("<h1>Configuração ausente</h1><p>Defina MELHOR_ENVIO_CLIENT_ID, MELHOR_ENVIO_CLIENT_SECRET e MELHOR_ENVIO_REDIRECT_URI no .env.local.</p>", 503);
  }

  const res = await fetch(`${ME_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return page(`<h1>Erro ao trocar código por token</h1><pre>${JSON.stringify(data, null, 2)}</pre>`, 500);
  }

  const expiresDays = Math.round((data.expires_in ?? 0) / 86400);

  // Grava no Supabase: a partir daqui a renovação é automática, sem mexer no env.
  const stored = await storeTokens(data);

  if (stored) {
    return page(`
      <h1>Frete configurado ✅</h1>
      <p>Os tokens foram salvos no banco. A renovação agora é <strong>automática</strong>: você não precisa mais tocar nisso.</p>
      <p>Validade inicial do access_token: ~${expiresDays} dias. O sistema renova sozinho antes de expirar.</p>
      <p>Pode fechar esta página.</p>
    `);
  }

  // Supabase indisponível: cai no modo manual (env var).
  return page(`
    <h1>Token gerado ⚠️</h1>
    <p>Não consegui salvar no Supabase (renovação automática indisponível). Use o modo manual: copie pro env e reinicie/redeploy.</p>
    <pre style="background:#f0f0f0; padding:1rem; overflow-x:auto;">MELHOR_ENVIO_TOKEN=${data.access_token}
MELHOR_ENVIO_REFRESH_TOKEN=${data.refresh_token}</pre>
    <p>Validade: ~${expiresDays} dias. Quando expirar, repita <code>/api/shipping/oauth/start</code>.</p>
  `);
}
