import { NextResponse } from "next/server";
import { acoesSeed } from "@/data/b3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live B3 quotes via Yahoo Finance.
 *
 * For each ticker we hit the public chart endpoint with a 1-month / 1-day
 * window, which yields both the intraday quote (meta) and the daily closes used
 * to draw the 1-month sparkline. B3 symbols are suffixed `.SA` on Yahoo.
 *
 * Robustness notes:
 *  - Yahoo throttles bursts hard (HTTP 429). We fetch in small batches with a
 *    pause between them, retry individual tickers with backoff, and cache the
 *    whole result in-memory for 60s so a page of visitors triggers at most one
 *    upstream refresh per minute.
 *  - A lazily-acquired cookie + crumb is attached when Yahoo hands one out; the
 *    chart endpoint also answers without it, so an empty session is harmless.
 *  - Any ticker we can't fetch is simply omitted — the client keeps its seed
 *    (reference) values for that row, so the table is never empty.
 */

export interface LiveQuote {
  preco: number;
  variacao: number;
  variacaoPct: number;
  sparkline: number[];
  high52: number;
  low52: number;
  volume: string;
}

const TTL_MS = 60_000;
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

function formatVolume(n: number | undefined): string {
  if (!n || !Number.isFinite(n)) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
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
    },
  ];
}

async function fetchQuote(
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

/**
 * Fallback live quotes from brapi.dev (no API key required for the list
 * endpoint). Used only to backfill tickers Yahoo couldn't return — it provides
 * the headline numbers (price / day change / volume) but no historical series,
 * so the client keeps its seed sparkline for these rows.
 */
async function brapiBackfill(missing: string[]): Promise<Record<string, LiveQuote>> {
  const out: Record<string, LiveQuote> = {};
  if (missing.length === 0) return out;
  try {
    const res = await fetch("https://brapi.dev/api/quote/list?limit=2000", {
      headers: baseHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return out;
    const json = (await res.json()) as {
      stocks?: { stock: string; close?: number; change?: number; volume?: number }[];
    };
    const byTicker = new Map((json.stocks ?? []).map((s) => [s.stock, s]));
    for (const ticker of missing) {
      const s = byTicker.get(ticker);
      if (!s || typeof s.close !== "number" || !Number.isFinite(s.close)) continue;
      const pct = typeof s.change === "number" ? s.change : 0;
      const prevClose = pct !== -100 ? s.close / (1 + pct / 100) : s.close;
      const seed = acoesSeed.find((a) => a.ticker === ticker);
      out[ticker] = {
        preco: Number(s.close.toFixed(2)),
        variacao: Number((s.close - prevClose).toFixed(2)),
        variacaoPct: Number(pct.toFixed(2)),
        sparkline: [], // no history from this source — client keeps seed shape
        // brapi's list has no 52w range; widen the seed range so it at least
        // contains the live price (avoids "price above 52w high" artifacts).
        high52: Number(Math.max(seed?.high52 ?? s.close, s.close).toFixed(2)),
        low52: Number(Math.min(seed?.low52 ?? s.close, s.close).toFixed(2)),
        volume: formatVolume(s.volume),
      };
    }
  } catch {
    /* fallback is best-effort */
  }
  return out;
}

async function fetchAll(): Promise<{ quotes: Record<string, LiveQuote>; sources: string[] }> {
  const s = await getSession();
  const tickers = acoesSeed.map((a) => a.ticker);
  const out: Record<string, LiveQuote> = {};
  const BATCH = 4;
  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    const settled = await Promise.all(batch.map((t) => fetchQuote(t, s)));
    for (const entry of settled) if (entry) out[entry[0]] = entry[1];
    if (i + BATCH < tickers.length) await sleep(250);
  }

  const sources: string[] = [];
  const yahooCount = Object.keys(out).length;
  if (yahooCount > 0) sources.push("Yahoo Finance");

  const missing = tickers.filter((t) => !out[t]);
  const backfill = await brapiBackfill(missing);
  const brapiCount = Object.keys(backfill).length;
  if (brapiCount > 0) sources.push("brapi.dev");
  Object.assign(out, backfill);

  return { quotes: out, sources };
}

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.ts < TTL_MS) {
    return NextResponse.json(cache.payload, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
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
      "Cache-Control": count > 0 ? "public, s-maxage=60, stale-while-revalidate=300" : "no-store",
    },
  });
}
