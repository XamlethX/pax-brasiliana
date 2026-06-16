/**
 * Gerenciamento automático do token OAuth da Melhor Envio.
 *
 * O access_token expira em ~30 dias e o refresh_token rotaciona a cada uso
 * (Laravel Passport), então env var não serve como fonte da verdade. Os tokens
 * ficam numa tabela do Supabase (melhor_envio_token, 1 linha) e são renovados
 * automaticamente aqui quando faltam menos de RENEW_BUFFER_MS pra expirar.
 *
 * Fallback: se o Supabase não estiver configurado, usa MELHOR_ENVIO_TOKEN do
 * env (token estático, sem renovação automática).
 */
import { getSupabaseAdmin } from "@/lib/supabase";

const ME_BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";

// Renova com 2 dias de folga: evita corrida e cobre janelas sem tráfego.
const RENEW_BUFFER_MS = 2 * 24 * 60 * 60 * 1000;

export class ShippingNotConfiguredError extends Error {}

interface TokenRow {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/** Grava/atualiza o par de tokens no Supabase (chamado pelo callback OAuth). */
export async function storeTokens(tokens: OAuthTokenResponse): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const { error } = await admin.from("melhor_envio_token").upsert({
    id: 1,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[melhor-envio-token] falha ao gravar", error.message);
    return false;
  }
  return true;
}

/** Troca o refresh_token por um par novo de tokens. */
async function refreshTokens(refreshToken: string): Promise<OAuthTokenResponse> {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new ShippingNotConfiguredError(
      "MELHOR_ENVIO_CLIENT_ID / MELHOR_ENVIO_CLIENT_SECRET ausentes para renovar token."
    );
  }

  const res = await fetch(`${ME_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao renovar token Melhor Envio (${res.status}).`);
  }

  return res.json();
}

/**
 * Retorna um access_token válido. Lê do Supabase, renova se perto de expirar
 * (gravando o par novo de volta), e cai pro env var se Supabase não existir.
 */
export async function getValidAccessToken(): Promise<string> {
  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await admin
      .from("melhor_envio_token")
      .select("access_token, refresh_token, expires_at")
      .eq("id", 1)
      .maybeSingle<TokenRow>();

    if (!error && data) {
      const expiresAtMs = new Date(data.expires_at).getTime();
      if (expiresAtMs - Date.now() > RENEW_BUFFER_MS) {
        return data.access_token;
      }
      // Perto de expirar: renova e persiste o par novo.
      const fresh = await refreshTokens(data.refresh_token);
      await storeTokens(fresh);
      return fresh.access_token;
    }
  }

  // Fallback: token estático do env (sem renovação automática).
  const envToken = process.env.MELHOR_ENVIO_TOKEN;
  if (envToken) return envToken;

  throw new ShippingNotConfiguredError(
    "Token Melhor Envio indisponível (sem registro no Supabase nem MELHOR_ENVIO_TOKEN)."
  );
}
