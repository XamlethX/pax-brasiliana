import { NextResponse } from "next/server";
import { acoesSeed } from "@/data/b3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live B3 quotes.
 *
 * Primary source: brapi.dev — a Brazil-native market-data API. A single batched
 * call returns price, day change, market cap, 52-week range, volume AND the
 * 1-month daily history used to draw the sparkline. Set BRAPI_TOKEN for higher
 * rate limits and larger batches; it also works tokenless (lower limits).
 *
 * Fallback source: Yahoo Finance chart endpoint, used only to backfill tickers
 * brapi couldn't return. Yahoo throttles bursts hard (HTTP 429) and can be
 * IP-blocked from serverless, so it is no longer the primary.
 *
 * Any ticker neither source returns is simply omitted — the client keeps its
 * seed (reference) values for that row, so the table is never empty.
 *
 * The whole result is cached in-memory for 60s so a page of visitors triggers
 * at most one upstream refresh per minute.
 */

export interface LiveQuote {
  preco: number;
  variacao: number;
  variacaoPct: number;
  sparkline: number[];
  high52: number;
  low52: number;
  volume: string;
  marketCap: string;
}

const TTL_MS = 300_000; // 5 min — conserves the brapi free-plan request quota
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const HOSTS = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];

let cache: { ts: number; payload: unknown } | null = null;
let session: { cookie: string; crumb: string; ts: number } | null = null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function baseHeaders(): Record<string, string> {
  return {
    "User-Agent": UA,
    Accept: "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
  };
}

function formatVolume(n: number | undefined): string {
  if (!n || !Number.isFinite(n)) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Market cap in BRL → compact "R$ 561.9B" style (value only, no currency). */
function formatMarketCap(n: number | undefined, fallback = "—"): string {
  if (!n || !Number.isFinite(n) || n <= 0) return fallback;
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return String(Math.round(n));
}

// ─────────────────────────── brapi.dev (primary) ───────────────────────────

interface BrapiHistory {
  close?: number | null;
}
interface BrapiResult {
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  marketCap?: number;
  historicalDataPrice?: BrapiHistory[];
}

// `ticker` is the symbol we REQUESTED. brapi may answer with a different current
// symbol (e.g. EMBR3 → EMBJ3 after a ticker change), but the client keys rows by
// the requested ticker, so we always store under it.
function parseBrapi(r: BrapiResult, ticker: string): [string, LiveQuote] | null {
  const preco = r.regularMarketPrice;
  if (!ticker || typeof preco !== "number" || !Number.isFinite(preco)) return null;

  const seed = acoesSeed.find((a) => a.ticker === ticker);

  const sparkline = (r.historicalDataPrice ?? [])
    .map((h) => h.close)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

  const prevClose =
    typeof r.regularMarketPreviousClose === "number" && r.regularMarketPreviousClose > 0
      ? r.regularMarketPreviousClose
      : preco - (r.regularMarketChange ?? 0);

  const variacao =
    typeof r.regularMarketChange === "number" ? r.regularMarketChange : preco - prevClose;
  const variacaoPct =
    typeof r.regularMarketChangePercent === "number"
      ? r.regularMarketChangePercent
      : prevClose
      ? (variacao / prevClose) * 100
      : 0;

  const high52 =
    typeof r.fiftyTwoWeekHigh === "number" && r.fiftyTwoWeekHigh > 0
      ? r.fiftyTwoWeekHigh
      : Math.max(preco, seed?.high52 ?? preco, ...sparkline);
  const low52 =
    typeof r.fiftyTwoWeekLow === "number" && r.fiftyTwoWeekLow > 0
      ? r.fiftyTwoWeekLow
      : Math.min(preco, seed?.low52 ?? preco, ...(sparkline.length ? sparkline : [preco]));

  return [
    ticker,
    {
      preco: Number(preco.toFixed(2)),
      variacao: Number(variacao.toFixed(2)),
      variacaoPct: Number(variacaoPct.toFixed(2)),
      sparkline,
      high52: Number(high52.toFixed(2)),
      low52: Number(low52.toFixed(2)),
      volume: formatVolume(r.regularMarketVolume),
      marketCap: formatMarketCap(r.marketCap, seed?.marketCap ?? "—"),
    },
  ];
}

async function brapiOne(
  ticker: string,
  token: string
): Promise<[string, LiveQuote] | null> {
  const params = new URLSearchParams({ range: "1mo", interval: "1d", fundamental: "true" });
  if (token) params.set("token", token);
  const url = `https://brapi.dev/api/quote/${ticker}?${params.toString()}`;
  // brapi's free plan rate-limits bursts (HTTP 429); retry with backoff so the
  // flagship tickers aren't silently dropped on a busy first refresh.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: baseHeaders(),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (res.status === 429) {
        await sleep(500 * (attempt + 1) + Math.random() * 300);
        continue;
      }
      if (!res.ok) return null;
      const json = (await res.json()) as { results?: BrapiResult[] };
      const r = json.results?.[0];
      return r ? parseBrapi(r, ticker) : null;
    } catch {
      await sleep(300 * (attempt + 1));
    }
  }
  return null;
}

/**
 * brapi's plans cap each request at a single ticker, so we fan out one request
 * per ticker through a small concurrency pool (fast, without hammering). A token
 * is required in practice — the tokenless quota is tiny — but the same path
 * works either way; anything that fails just keeps its seed on the client.
 */
async function brapiBatch(
  tickers: string[],
  token: string
): Promise<Record<string, LiveQuote>> {
  const out: Record<string, LiveQuote> = {};
  if (tickers.length === 0) return out;

  const CONCURRENCY = token ? 4 : 2;
  let cursor = 0;
  async function worker() {
    while (cursor < tickers.length) {
      const ticker = tickers[cursor++];
      const parsed = await brapiOne(ticker, token);
      if (parsed) out[parsed[0]] = parsed[1];
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, tickers.length) }, worker)
  );
  return out;
}

// ─────────────────────────── Yahoo Finance (fallback) ──────────────────────

/** Lazily obtain (and cache for 10 min) a Yahoo cookie + crumb. Best-effort. */
async function getSession(): Promise<{ cookie: string; crumb: string }> {
  if (session && Date.now() - session.ts < 600_000) return session;
  let cookie = "";
  let crumb = "";
  try {
    const res = await fetch("https://finance.yahoo.com/", {
      headers: baseHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    cookie = (res.headers.get("set-cookie") ?? "")
      .split(/,(?=[^ ;]+=)/)
      .map((c) => c.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");
    if (cookie) {
      const cr = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
        headers: { ...baseHeaders(), Cookie: cookie },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (cr.ok) {
        const text = (await cr.text()).trim();
        if (text && !/too many requests/i.test(text)) crumb = text;
      }
    }
  } catch {
    /* best-effort — chart endpoint works without a session too */
  }
  session = { cookie, crumb, ts: Date.now() };
  return session;
}

function chartUrl(host: string, ticker: string, crumb: string): string {
  const q = new URLSearchParams({ range: "1mo", interval: "1d" });
  if (crumb) q.set("crumb", crumb);
  return `${host}/v8/finance/chart/${ticker}.SA?${q.toString()}`;
}

function parseChart(json: unknown, ticker: string): [string, LiveQuote] | null {
  const result = (json as { chart?: { result?: unknown[] } })?.chart?.result?.[0] as
    | {
        meta?: Record<string, number | undefined>;
        indicators?: { quote?: { close?: (number | null)[] }[] };
      }
    | undefined;
  if (!result) return null;

  const meta = result.meta ?? {};
  const closesRaw = result.indicators?.quote?.[0]?.close ?? [];
  const sparkline = closesRaw.filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v)
  );
  if (sparkline.length < 2) return null;

  const seed = acoesSeed.find((a) => a.ticker === ticker);
  const preco =
    typeof meta.regularMarketPrice === "number"
      ? meta.regularMarketPrice
      : sparkline[sparkline.length - 1];
  const prevClose =
    typeof meta.chartPreviousClose === "number"
      ? meta.chartPreviousClose
      : typeof meta.previousClose === "number"
      ? meta.previousClose
      : sparkline[sparkline.length - 2];

  const variacao = preco - prevClose;
  const variacaoPct = prevClose ? (variacao / prevClose) * 100 : 0;
  const high52 =
    typeof meta.fiftyTwoWeekHigh === "number" ? meta.fiftyTwoWeekHigh : Math.max(...sparkline);
  const low52 =
    typeof meta.fiftyTwoWeekLow === "number" ? meta.fiftyTwoWeekLow : Math.min(...sparkline);

  return [
    ticker,
    {
      preco: Number(preco.toFixed(2)),
      variacao: Number(variacao.toFixed(2)),
      variacaoPct: Number(variacaoPct.toFixed(2)),
      sparkline,
      high52: Number(high52.toFixed(2)),
      low52: Number(low52.toFixed(2)),
      volume: formatVolume(meta.regularMarketVolume),
      // Yahoo's chart endpoint has no market cap — keep the seed reference.
      marketCap: seed?.marketCap ?? "—",
    },
  ];
}

async function fetchYahooQuote(
  ticker: string,
  s: { cookie: string; crumb: string }
): Promise<[string, LiveQuote] | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const host = HOSTS[attempt % HOSTS.length];
    try {
      const headers = baseHeaders();
      if (s.cookie) headers.Cookie = s.cookie;
      const res = await fetch(chartUrl(host, ticker, s.crumb), {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 429) {
        await sleep(400 * (attempt + 1));
        continue;
      }
      if (!res.ok) return null;
      return parseChart(await res.json(), ticker);
    } catch {
      await sleep(250 * (attempt + 1));
    }
  }
  return null;
}

async function yahooBackfill(missing: string[]): Promise<Record<string, LiveQuote>> {
  const out: Record<string, LiveQuote> = {};
  if (missing.length === 0) return out;
  const s = await getSession();
  const BATCH = 4;
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const settled = await Promise.all(batch.map((t) => fetchYahooQuote(t, s)));
    for (const entry of settled) if (entry) out[entry[0]] = entry[1];
    if (i + BATCH < missing.length) await sleep(250);
  }
  return out;
}

// ─────────────────────────────── orchestration ─────────────────────────────

async function fetchAll(): Promise<{ quotes: Record<string, LiveQuote>; sources: string[] }> {
  const token = process.env.BRAPI_TOKEN ?? "";
  const tickers = acoesSeed.map((a) => a.ticker);
  const sources: string[] = [];

  const out = await brapiBatch(tickers, token);
  if (Object.keys(out).length > 0) sources.push("brapi.dev");

  const missing = tickers.filter((t) => !out[t]);
  const backfill = await yahooBackfill(missing);
  if (Object.keys(backfill).length > 0) sources.push("Yahoo Finance");
  Object.assign(out, backfill);

  return { quotes: out, sources };
}

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.ts < TTL_MS) {
    return NextResponse.json(cache.payload, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" },
    });
  }

  const { quotes, sources } = await fetchAll();
  const count = Object.keys(quotes).length;
  const sparklineLive = Object.values(quotes).filter((q) => q.sparkline.length > 1).length;

  const payload = {
    ok: count > 0,
    updatedAt: new Date().toISOString(),
    count,
    sparklineLive,
    source: sources.join(" + ") || "—",
    quotes,
  };
  // Don't cache an empty result (rate-limit/outage) — retry next request.
  if (count > 0) cache = { ts: now, payload };

  return NextResponse.json(payload, {
    status: count > 0 ? 200 : 502,
    headers: {
      "Cache-Control": count > 0 ? "public, s-maxage=300, stale-while-revalidate=300" : "no-store",
    },
  });
}
