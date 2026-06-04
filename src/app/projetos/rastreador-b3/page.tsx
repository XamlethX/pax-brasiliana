"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import { type Acao, acoesSeed } from "@/data/b3";

const sectorOrder = [
  "Defesa, Aeroespacial & Soberania",
  "Manufatura Avançada & Materiais",
  "Energia Limpa & Cleantech",
  "Agtech, Segurança Alimentar & Biológicos",
  "Infraestrutura, Recursos & Capacidade Soberana",
  "Tecnologia & Software",
  "Saúde & Farmacêutica",
];

const sectorConfig: Record<string, { shortLabel: string }> = {
  "Defesa, Aeroespacial & Soberania": { shortLabel: "Defesa" },
  "Manufatura Avançada & Materiais": { shortLabel: "Manufatura" },
  "Energia Limpa & Cleantech": { shortLabel: "Energia" },
  "Agtech, Segurança Alimentar & Biológicos": { shortLabel: "Agtech" },
  "Infraestrutura, Recursos & Capacidade Soberana": { shortLabel: "Infra" },
  "Tecnologia & Software": { shortLabel: "Tech" },
  "Saúde & Farmacêutica": { shortLabel: "Saúde" },
};

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 280; const h = 56; const pad = 2;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 56 }}>
      <polyline points={points} fill="none" stroke="#ADA446" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80; const h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={points} fill="none" stroke="#ADA446" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export default function RastreadorB3() {
  useScrollReveal();
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("Todos");
  const [sort, setSort] = useState("sector");
  const [view, setView] = useState<"grid" | "table">("grid");

  // Live data overlays the static seed (nome/setor/descrição/marketCap stay,
  // preço/variação/sparkline/52s/volume come from Yahoo Finance via /api/b3).
  const [acoes, setAcoes] = useState<Acao[]>(acoesSeed);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const loadLive = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/b3", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && data.quotes) {
        setAcoes(
          acoesSeed.map((a) => {
            const q = data.quotes[a.ticker];
            if (!q) return a;
            return {
              ...a,
              preco: q.preco,
              variacao: q.variacao,
              variacaoPct: q.variacaoPct,
              sparkline:
                Array.isArray(q.sparkline) && q.sparkline.length > 1 ? q.sparkline : a.sparkline,
              high52: q.high52,
              low52: q.low52,
              volume: q.volume,
            };
          })
        );
        setLive(true);
        setSource(typeof data.source === "string" ? data.source : null);
        setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : new Date());
      } else {
        setLive(false);
      }
    } catch {
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLive();
  }, [loadLive]);

  const liveTime = useMemo(() => {
    const d = updatedAt ?? new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }, [updatedAt]);

  // Sector counts derive from the stable universe, not the live overlay.
  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    acoesSeed.forEach((a) => { counts[a.setor] = (counts[a.setor] || 0) + 1; });
    return counts;
  }, []);

  const filtradas = useMemo(() => {
    const filtered = acoes.filter((a) => {
      const matchBusca = busca === "" || a.ticker.toLowerCase().includes(busca.toLowerCase()) || a.nome.toLowerCase().includes(busca.toLowerCase());
      const matchSetor = setor === "Todos" || a.setor === setor;
      return matchBusca && matchSetor;
    });
    if (sort === "sector") return filtered.sort((a, b) => { const ai = sectorOrder.indexOf(a.setor); const bi = sectorOrder.indexOf(b.setor); return ai !== bi ? ai - bi : a.ticker.localeCompare(b.ticker); });
    if (sort === "ticker") return filtered.sort((a, b) => a.ticker.localeCompare(b.ticker));
    if (sort === "preco-desc") return filtered.sort((a, b) => b.preco - a.preco);
    if (sort === "preco-asc") return filtered.sort((a, b) => a.preco - b.preco);
    if (sort === "variacao-desc") return filtered.sort((a, b) => b.variacaoPct - a.variacaoPct);
    if (sort === "variacao-asc") return filtered.sort((a, b) => a.variacaoPct - b.variacaoPct);
    if (sort === "marketcap") return filtered.sort((a, b) => { const p = (s: string) => { const n = parseFloat(s); return s.endsWith("B") ? n * 1000 : n; }; return p(b.marketCap) - p(a.marketCap); });
    return filtered;
  }, [busca, setor, sort, acoes]);

  const totalMarketCap = useMemo(() => {
    let total = 0;
    acoesSeed.forEach((a) => { const n = parseFloat(a.marketCap); total += a.marketCap.endsWith("B") ? n : n / 1000; });
    return `R$${total.toFixed(0)}B`;
  }, []);

  const gainers = useMemo(() => acoes.filter((a) => a.variacaoPct > 0).length, [acoes]);
  const losers = useMemo(() => acoes.filter((a) => a.variacaoPct < 0).length, [acoes]);
  const avgChange = useMemo(
    () => acoes.reduce((s, a) => s + a.variacaoPct, 0) / acoes.length,
    [acoes]
  );

  const groupedBySector = useMemo(() => {
    if (sort !== "sector" || setor !== "Todos") return null;
    const groups: { sector: string; stocks: Acao[] }[] = [];
    let cur = "";
    filtradas.forEach((stock) => {
      if (stock.setor !== cur) { cur = stock.setor; groups.push({ sector: cur, stocks: [] }); }
      groups[groups.length - 1].stocks.push(stock);
    });
    return groups;
  }, [filtradas, sort, setor]);

  const renderCard = (stock: Acao) => {
    const cfg = sectorConfig[stock.setor] || sectorConfig["Manufatura Avançada & Materiais"];
    const pos = stock.variacaoPct >= 0;
    const UP = "#3D8B3D"; const DOWN = "#B83A3A";
    return (
      <article
        key={stock.ticker}
        className="flex flex-col gap-3.5 bg-mist border border-bark/20 p-5 transition-colors duration-150 hover:border-bark/40"
      >
        <div className="flex justify-between items-start">
          <span className="font-mono text-[18px] font-bold tracking-[0.02em] text-bark">{stock.ticker}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold px-2 py-1 bg-coast/20 text-coast">
            {cfg.shortLabel}
          </span>
        </div>
        <p className="font-mono text-[13px] leading-[1.2] -mt-1 text-bark/50">{stock.nome}</p>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[28px] font-bold leading-none text-bark" style={{ fontVariantNumeric: "tabular-nums" }}>
            {stock.preco.toFixed(2)}
          </span>
          <span
            className="font-mono text-[11px] font-bold px-2 py-1"
            style={{
              background: pos ? "rgba(61,139,61,0.14)" : stock.variacaoPct === 0 ? "rgba(0,0,0,0.06)" : "rgba(184,58,58,0.12)",
              color: pos ? UP : stock.variacaoPct === 0 ? "#463C2E80" : DOWN,
            }}
          >
            {pos ? "+" : ""}{stock.variacaoPct.toFixed(1)}%
          </span>
        </div>
        <Sparkline data={stock.sparkline} />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 pt-3.5 mt-1 border-t border-bark/15">
          {[
            { label: "Mkt Cap", value: `R$${stock.marketCap}` },
            { label: "Volume", value: stock.volume },
            { label: "52s Alta", value: stock.high52.toFixed(2) },
            { label: "52s Baixa", value: stock.low52.toFixed(2) },
          ].map((m) => (
            <div key={m.label} className="flex justify-between">
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-bark/50">{m.label}</dt>
              <dd className="font-mono text-[11px] text-bark m-0" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[12px] leading-[1.45] line-clamp-3 pt-3 border-t border-bark/15 text-bark/50 m-0">
          {stock.descricao}
        </p>
      </article>
    );
  };

  const chipBase = "font-mono text-[12px] uppercase tracking-[0.08em] px-3.5 py-2 whitespace-nowrap transition-colors duration-150 border";

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section
          className="grid-lines relative lg:h-[476px] pt-[120px] pb-16 lg:pt-0 lg:pb-0 bg-bark"
          style={{ "--grid-line-color": "#F8F6E820" } as React.CSSProperties}
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 z-[1] relative h-full text-mist">
            <div className="lg:w-1/3 flex items-center lg:h-full pl-5 lg:pl-10 pr-5">
              <div>
                <h1 className="font-heading text-h3 text-left text-mist">Rastreador<br />B3</h1>
                <p className="font-mono text-[11px] uppercase tracking-tight text-mist/50 mt-4">
                  {acoes.length} EMPRESAS · {sectorOrder.length} SETORES · {live ? "DADOS AO VIVO" : loading ? "CARREGANDO…" : "DADOS DE REFERÊNCIA"}
                </p>
              </div>
            </div>
            <div className="lg:w-1/3 flex items-center lg:h-full px-5">
              <p className="text-paragraphs text-mist/80">
                Acompanhamento de {acoes.length} empresas listadas na B3 que constroem
                capacidade soberana em defesa, manufatura avançada, energia limpa, agtech,
                infraestrutura, tecnologia e saúde.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 px-5 lg:px-8 bg-sand">
          <div className="max-w-[1440px] mx-auto">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10 fade-in-up">
              {[
                { label: "EMPRESAS", value: String(acoes.length), color: "var(--coast)" },
                { label: "MARKET CAP TOTAL", value: totalMarketCap, color: "var(--coast)" },
                { label: "ALTAS HOJE", value: String(gainers), color: "#3D8B3D" },
                { label: "QUEDAS HOJE", value: String(losers), color: "#B83A3A" },
                { label: "VARIAÇÃO MÉDIA", value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? "#3D8B3D" : "#B83A3A" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-mist border border-bark/20 px-5 py-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] mb-2.5 text-bark/50">{kpi.label}</div>
                  <div className="font-mono text-[32px] font-bold leading-none" style={{ color: kpi.color, fontVariantNumeric: "tabular-nums" }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Toolbar row 1: live + chips + search */}
            <div className="flex flex-wrap items-center gap-2 mb-3 fade-in-up stagger-2">
              <div className="flex items-center gap-2 shrink-0 mr-1">
                <span
                  className={`w-2 h-2 rounded-full ${loading ? "animate-pulse bg-wattle" : live ? "animate-pulse bg-[#3D8B3D]" : "bg-bark/40"}`}
                />
                <span className="font-mono text-[12px] tracking-[0.06em] text-bark/50 uppercase">
                  {loading ? "Atualizando…" : live ? `Ao vivo · ${liveTime}` : `Referência · ${liveTime}`}
                </span>
              </div>
              <button
                onClick={() => setSetor("Todos")}
                className={`${chipBase} ${setor === "Todos" ? "bg-bark text-mist border-bark" : "bg-transparent text-bark border-bark/30 hover:border-bark/50"}`}
              >
                Todos ({acoes.length})
              </button>
              {sectorOrder.map((s) => {
                const count = sectorCounts[s] || 0;
                if (!count) return null;
                const active = setor === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSetor(s)}
                    className={`${chipBase} ${active ? "bg-bark text-mist border-bark" : "bg-transparent text-bark border-bark/30 hover:border-bark/50"}`}
                  >
                    {sectorConfig[s].shortLabel} ({count})
                  </button>
                );
              })}
              <div className="relative ml-auto">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/40">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar ticker ou nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="font-mono pl-9 pr-4 py-2 text-[13px] focus:outline-none w-full lg:w-[260px] bg-transparent border border-bark/30 text-bark placeholder:text-bark/40 h-[36px]"
                />
              </div>
            </div>

            {/* Toolbar row 2: sort + view + refresh */}
            <div className="flex items-center gap-2 mb-8">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="font-mono text-[13px] tracking-tight px-3 appearance-none cursor-pointer focus:outline-none bg-transparent border border-bark/30 text-bark h-[36px]"
              >
                <option value="sector">Sort: Setor</option>
                <option value="ticker">Sort: Ticker A-Z</option>
                <option value="preco-desc">Sort: Preço ↓</option>
                <option value="preco-asc">Sort: Preço ↑</option>
                <option value="variacao-desc">Sort: Melhor Perf.</option>
                <option value="variacao-asc">Sort: Pior Perf.</option>
                <option value="marketcap">Sort: Market Cap</option>
              </select>
              <div className="flex border border-bark/30">
                <button
                  onClick={() => setView("grid")}
                  className="p-2 transition-colors duration-200 w-[36px] h-[36px] flex items-center justify-center"
                  style={{ background: view === "grid" ? "var(--bark)" : "transparent", color: view === "grid" ? "var(--mist)" : "var(--bark)" }}
                  aria-label="Grade"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("table")}
                  className="p-2 transition-colors duration-200 w-[36px] h-[36px] flex items-center justify-center border-l border-bark/30"
                  style={{ background: view === "table" ? "var(--bark)" : "transparent", color: view === "table" ? "var(--mist)" : "var(--bark)" }}
                  aria-label="Tabela"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <button
                onClick={loadLive}
                disabled={loading}
                className="font-mono text-[12px] uppercase tracking-[0.08em] bg-transparent border border-bark/30 text-bark/50 h-[36px] px-3 transition-colors hover:text-bark hover:border-bark/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "ATUALIZANDO…" : "ATUALIZAR"}
              </button>
            </div>

            {/* Grid view */}
            {view === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {groupedBySector
                  ? groupedBySector.map((group) => [
                      <div
                        key={`h-${group.sector}`}
                        className="col-span-full flex items-center gap-4 pt-8 pb-3 first:pt-0 border-b border-bark/15"
                      >
                        <span className="font-mono text-[12px] uppercase tracking-[0.14em] font-bold text-coast">
                          {group.sector}
                        </span>
                        <span className="font-mono text-[11px] text-bark/40">{group.stocks.length}</span>
                      </div>,
                      ...group.stocks.map(renderCard),
                    ])
                  : filtradas.map(renderCard)}
              </div>
            )}

            {/* Table view */}
            {view === "table" && (
              <div className="overflow-x-auto bg-mist border border-bark/20">
                <table className="w-full text-[13px] min-w-[1000px]">
                  <thead>
                    <tr className="border-b-2 border-bark/15">
                      {([
                        { label: "Ticker", asc: "ticker", desc: "ticker" },
                        { label: "Empresa" },
                        { label: "Setor" },
                        { label: "Preço", asc: "preco-asc", desc: "preco-desc" },
                        { label: "Variação" },
                        { label: "Var. %", asc: "variacao-asc", desc: "variacao-desc" },
                        { label: "Mkt Cap", desc: "marketcap" },
                        { label: "Volume" },
                        { label: "52s Range" },
                        { label: "Gráfico" },
                      ] as { label: string; asc?: string; desc?: string }[]).map((col) => {
                        const sortable = Boolean(col.asc || col.desc);
                        const active = sort === col.asc || sort === col.desc;
                        const arrow = sort === col.asc ? "▲" : sort === col.desc ? "▼" : "↕";
                        const handleSort = () => {
                          if (!sortable) return;
                          if (col.asc && col.desc) setSort(sort === col.desc ? col.asc : col.desc);
                          else setSort((col.desc || col.asc) as string);
                        };
                        return (
                          <th
                            key={col.label}
                            aria-sort={active ? (sort === col.asc ? "ascending" : "descending") : undefined}
                            className={`text-left py-3 px-3 font-mono text-[10px] uppercase tracking-[0.12em] font-normal ${active ? "text-bark" : "text-bark/50"}`}
                          >
                            {sortable ? (
                              <button
                                type="button"
                                onClick={handleSort}
                                aria-label={`Ordenar por ${col.label}`}
                                className="inline-flex items-center gap-1 font-mono uppercase tracking-[0.12em] bg-transparent border-0 p-0 cursor-pointer transition-colors hover:text-bark"
                              >
                                {col.label}
                                <span aria-hidden="true" className={active ? "text-coast" : "text-bark/30"}>{arrow}</span>
                              </button>
                            ) : (
                              col.label
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((a) => {
                      const cfg = sectorConfig[a.setor] || sectorConfig["Manufatura Avançada & Materiais"];
                      const pos = a.variacaoPct >= 0;
                      const UP = "#3D8B3D"; const DOWN = "#B83A3A";
                      return (
                        <tr
                          key={a.ticker}
                          className="border-b border-bark/10 transition-colors hover:bg-bark/5"
                        >
                          <td className="py-3 px-3 font-mono font-bold tracking-[0.02em] text-bark">{a.ticker}</td>
                          <td className="py-3 px-3 font-mono max-w-[200px] truncate text-bark/50">{a.nome}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold px-2 py-0.5 bg-coast/20 text-coast">{cfg.shortLabel}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-bark" style={{ fontVariantNumeric: "tabular-nums" }}>{a.preco.toFixed(2)}</td>
                          <td className="py-3 px-3 font-mono" style={{ color: pos ? UP : DOWN, fontVariantNumeric: "tabular-nums" }}>{pos ? "+" : ""}{a.variacao.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[12px] font-bold px-1.5 py-0.5" style={{ background: pos ? "rgba(61,139,61,0.14)" : "rgba(184,58,58,0.12)", color: pos ? UP : DOWN }}>{pos ? "+" : ""}{a.variacaoPct.toFixed(1)}%</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-bark/50">R${a.marketCap}</td>
                          <td className="py-3 px-3 font-mono text-bark/50">{a.volume}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-bark/50">{a.low52.toFixed(2)} – {a.high52.toFixed(2)}</td>
                          <td className="py-3 px-3"><MiniSparkline data={a.sparkline} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filtradas.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-bark/50">NENHUMA EMPRESA ENCONTRADA</p>
              </div>
            )}

            <div className="mt-10 pt-6 text-center border-t border-bark/15">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] leading-relaxed text-bark/40">
                {live ? `Cotações via ${source ?? "Yahoo Finance"}` : "Valores de referência"} · sparkline de 30 dias (fechamento diário, Yahoo Finance) · atraso de até 15 min. Não constitui recomendação de investimento.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] mt-1 text-bark/40">
                Curado com tese de capacidade soberana.
              </p>
            </div>
          </div>
        </section>

        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
