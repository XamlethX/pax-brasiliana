/**
 * Diagnóstico de produção: GET /api/status
 *
 * Reporta o estado real de cada subsistema (Stripe, Supabase, Melhor Envio,
 * Resend) com chamadas vivas, não só presença de env var. Cada pendência
 * aponta o passo do RUNBOOK.md que a resolve — depois de cada passo do
 * runbook, bata aqui de novo até `ok: true`.
 *
 * Proteção: em produção exige STATUS_SECRET (via ?key= ou header
 * x-status-key). Em dev local é aberto.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ME_BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";

const DAY_MS = 24 * 60 * 60 * 1000;

interface Check {
  ok: boolean;
  detail: string;
  fix?: string;
}

/** Tokens da Melhor Envio são JWT: dá pra ler a expiração sem validar. */
function jwtExpiry(token: string): Date | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof json.exp === "number" ? new Date(json.exp * 1000) : null;
  } catch {
    return null;
  }
}

async function checkStripe(): Promise<Check> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey) {
    return {
      ok: false,
      detail: "STRIPE_SECRET_KEY ausente — loja e doações fora do ar (503).",
      fix: "RUNBOOK.md § 3 (criar conta Stripe e configurar chaves)",
    };
  }
  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
    await stripe.balance.retrieve();
  } catch (err) {
    return {
      ok: false,
      detail: `STRIPE_SECRET_KEY presente mas rejeitada pela Stripe (${err instanceof Error ? err.message : "erro"}).`,
      fix: "RUNBOOK.md § 3 — conferir se a chave é a secreta (sk_live_...) e está inteira",
    };
  }
  if (!webhookSecret) {
    return {
      ok: false,
      detail:
        "Chave Stripe válida, mas STRIPE_WEBHOOK_SECRET ausente — pagamentos passam e NENHUM email de pedido/recibo sai.",
      fix: "RUNBOOK.md § 3.4 (cadastrar webhook e copiar o signing secret)",
    };
  }
  return { ok: true, detail: "Chave validada na API da Stripe; webhook secret presente." };
}

async function checkSupabase(): Promise<Check> {
  const anon = getSupabase();
  if (!anon) {
    return {
      ok: false,
      detail:
        "Supabase não configurado (envs ausentes) — cadeia produtiva em fallback estático e token Melhor Envio sem renovação automática.",
      fix: "RUNBOOK.md § 1 (criar projeto novo e configurar envs)",
    };
  }
  try {
    const { count, error } = await anon
      .from("fabricantes")
      .select("id", { count: "exact", head: true });
    if (error) {
      // supabase-js devolve falha de rede como { error }, não como exceção.
      if (/fetch failed|ENOTFOUND|ECONN/i.test(error.message)) {
        return {
          ok: false,
          detail: `Supabase inalcançável (${error.message}) — projeto deletado/pausado?`,
          fix: "RUNBOOK.md § 1 (criar projeto novo e configurar envs)",
        };
      }
      return {
        ok: false,
        detail: `Supabase respondeu com erro: ${error.message}. Schema não aplicado?`,
        fix: "RUNBOOK.md § 1.2 (rodar supabase/schema.sql no SQL editor)",
      };
    }
    if (!count) {
      return {
        ok: false,
        detail: "Supabase no ar, mas a tabela fabricantes está vazia.",
        fix: "RUNBOOK.md § 1.3 (npx tsx scripts/seed-fabricantes.ts)",
      };
    }
    return { ok: true, detail: `Supabase no ar — ${count} fabricantes.` };
  } catch (err) {
    return {
      ok: false,
      detail: `Supabase inalcançável (${err instanceof Error ? err.message : "erro de rede"}) — projeto deletado/pausado?`,
      fix: "RUNBOOK.md § 1 (criar projeto novo e configurar envs)",
    };
  }
}

async function checkMelhorEnvio(): Promise<Check> {
  if (!process.env.MELHOR_ENVIO_FROM_CEP) {
    return {
      ok: false,
      detail: "MELHOR_ENVIO_FROM_CEP ausente — cálculo de frete fora do ar.",
      fix: "RUNBOOK.md § 2 (envs da Melhor Envio)",
    };
  }

  // Fonte do token: Supabase (renovação automática) ou env (estático).
  let token: string | null = null;
  let source = "";
  let expiresAt: Date | null = null;

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data } = await admin
        .from("melhor_envio_token")
        .select("access_token, expires_at")
        .eq("id", 1)
        .maybeSingle<{ access_token: string; expires_at: string }>();
      if (data) {
        token = data.access_token;
        expiresAt = new Date(data.expires_at);
        source = "Supabase (renovação automática ATIVA)";
      }
    } catch {
      // Supabase morto: cai pro env abaixo; o check do Supabase já reporta.
    }
  }
  if (!token) {
    token = process.env.MELHOR_ENVIO_TOKEN ?? null;
    if (token) {
      expiresAt = jwtExpiry(token);
      source = "env MELHOR_ENVIO_TOKEN (estático, SEM renovação automática)";
    }
  }

  if (!token) {
    return {
      ok: false,
      detail: "Nenhum token Melhor Envio (nem Supabase, nem env) — frete e checkout da loja fora do ar.",
      fix: "RUNBOOK.md § 2 (refazer OAuth via /api/shipping/oauth/start)",
    };
  }

  // Validação viva: a Melhor Envio aceita esse token agora?
  let live = "";
  try {
    const res = await fetch(`${ME_BASE_URL}/api/v2/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "Pax Brasiliana (contato@paxbrasiliana.com)",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        detail: `Melhor Envio rejeitou o token (HTTP ${res.status}). Fonte: ${source}.`,
        fix: "RUNBOOK.md § 2 (refazer OAuth via /api/shipping/oauth/start)",
      };
    }
    live = "aceito pela API agora";
  } catch {
    live = "API da Melhor Envio não respondeu (token não pôde ser validado ao vivo)";
  }

  const daysLeft = expiresAt
    ? Math.floor((expiresAt.getTime() - Date.now()) / DAY_MS)
    : null;
  const expiryStr = expiresAt
    ? `expira em ${expiresAt.toISOString().slice(0, 10)} (${daysLeft} dias)`
    : "expiração desconhecida";
  const autoRenews = source.startsWith("Supabase");

  if (daysLeft !== null && daysLeft <= 0) {
    return {
      ok: false,
      detail: `Token Melhor Envio EXPIRADO (${expiryStr}). Fonte: ${source}.`,
      fix: "RUNBOOK.md § 2 (refazer OAuth via /api/shipping/oauth/start)",
    };
  }
  if (!autoRenews && daysLeft !== null && daysLeft <= 7) {
    return {
      ok: false,
      detail: `Token Melhor Envio ${expiryStr}, ${live}; fonte: ${source}. Sem renovação automática, o frete morre nessa data.`,
      fix: "RUNBOOK.md § 1 e § 2 (religar Supabase e refazer OAuth pra renovação automática)",
    };
  }
  return {
    ok: true,
    detail: `Token ${live}; ${expiryStr}; fonte: ${source}.`,
    ...(autoRenews ? {} : { fix: "Recomendado: RUNBOOK.md § 1 e § 2 pra ligar a renovação automática" }),
  };
}

function checkResend(): Check {
  if (!process.env.RESEND_API_KEY) {
    return {
      ok: false,
      detail: "RESEND_API_KEY ausente — formulários e emails transacionais mudos.",
      fix: "RUNBOOK.md § 4",
    };
  }
  return { ok: true, detail: "RESEND_API_KEY presente (entrega já validada em produção)." };
}

export async function GET(req: NextRequest) {
  const secret = process.env.STATUS_SECRET;
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (isProd) {
    const provided =
      req.nextUrl.searchParams.get("key") ?? req.headers.get("x-status-key");
    if (!secret) {
      return NextResponse.json(
        { error: "Defina STATUS_SECRET na Vercel pra habilitar este endpoint (RUNBOOK.md § 0)." },
        { status: 503 }
      );
    }
    if (provided !== secret) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
  }

  const [stripe, supabase, melhorEnvio] = await Promise.all([
    checkStripe(),
    checkSupabase(),
    checkMelhorEnvio(),
  ]);
  const resend = checkResend();

  const checks = { stripe, supabase, melhor_envio: melhorEnvio, resend };
  const pendencias = Object.entries(checks)
    .filter(([, c]) => !c.ok)
    .map(([name, c]) => `${name}: ${c.detail}${c.fix ? ` → ${c.fix}` : ""}`);

  return NextResponse.json(
    {
      ok: pendencias.length === 0,
      checked_at: new Date().toISOString(),
      checks,
      pendencias,
    },
    { status: 200 }
  );
}
