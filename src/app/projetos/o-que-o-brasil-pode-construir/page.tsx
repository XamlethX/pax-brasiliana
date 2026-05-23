"use client";

import { useState, useMemo } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { produtos, statusConfig, type Status } from "@/data/produtos";

const statusIcons: Record<string, React.ReactNode> = {
  "placas-solares": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>,
  "baterias": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="4" width="12" height="18" rx="2" /><line x1="10" y1="1" x2="14" y2="1" /><line x1="10" y1="10" x2="14" y2="10" /><line x1="12" y1="8" x2="12" y2="12" /></svg>,
  "foguete-orbital": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L8 10h8L12 2z" /><rect x="10" y="10" width="4" height="10" /><path d="M8 20l-2 2M16 20l2 2M10 20h4" /></svg>,
  "fertilizante": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22V8" /><path d="M5 12l7-10 7 10" /><path d="M9 17c0-1.5 1.3-3 3-3s3 1.5 3 3" /><circle cx="12" cy="20" r="2" /></svg>,
  "drones": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M5 5l3.5 3.5M19 5l-3.5 3.5M5 19l3.5-3.5M19 19l-3.5-3.5" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /></svg>,
  "energia": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  "aco": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20" /><path d="M4 20V10l4-6h8l4 6v10" /><path d="M8 20v-6h8v6" /><line x1="12" y1="14" x2="12" y2="20" /></svg>,
};

const allCategories = Array.from(new Set(produtos.map((p) => p.categoria)));

export default function OQueOBrasilPodeConstruir() {
  useScrollReveal();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    return produtos.filter((p) => {
      const matchesSearch = search === "" || p.nome.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.categoria === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, statusFilter, categoryFilter]);

  const counts = useMemo(() => ({
    produz: filtered.filter((p) => p.status === "produz").length,
    parcial: filtered.filter((p) => p.status === "parcial").length,
    importa: filtered.filter((p) => p.status === "importa").length,
    total: filtered.length,
  }), [filtered]);

  const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all" || search !== "";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8F6E8]">
        {/* Hero */}
        <div className="pt-40 pb-16 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-accents text-[#463C2E]/50 mb-8 border-l-[1px] border-[#F45141] pl-5 py-[9px]">
              PROJETO / INTERATIVO
            </p>
            <h1 className="text-h2 text-[#463C2E]" style={{ textWrap: "balance" }}>
              O que o Brasil<br />pode construir?
            </h1>
            <p className="text-paragraphs text-[#463C2E]/70 mt-10 max-w-[700px]">
              De placas solares a foguetes orbitais. Um mapa da capacidade produtiva
              brasileira — o que já fazemos, o que poderíamos fazer, e o que ainda
              importamos.
            </p>
          </div>
        </div>

        {/* Sidebar + Content layout */}
        <div className="flex flex-col lg:flex-row">
          {/* Mobile filter button */}
          <div className="lg:hidden px-5 py-4 border-b border-[#463C2E]/30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#E4DECC] w-full text-[12px] tracking-[-0.06em] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h10M4 18h6" />
              </svg>
              FILTROS
            </button>
          </div>

          {/* Sidebar */}
          <div className={`
            lg:w-1/3 border-r border-[#463C2E]/30 px-5 lg:px-10 py-8
            ${sidebarOpen ? "block" : "hidden lg:block"}
          `}>
            {/* Search */}
            <div className="flex items-center gap-3 py-2.5 border-b border-dashed border-[#463C2E]/30 mb-8">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="BUSCAR PRODUTOS"
                className="w-full bg-transparent text-[12px] tracking-[-0.06em] uppercase text-[#463C2E] placeholder:text-[#463C2E]/30 focus:outline-none"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>

            {/* Status filter */}
            <div className="mb-8">
              <p
                className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                PRODUÇÃO NACIONAL
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { value: "all", label: "TODOS" },
                  { value: "produz", label: "PRODUZ" },
                  { value: "importa", label: "NÃO PRODUZ" },
                  { value: "parcial", label: "PARCIAL" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-[18px] h-[18px] border-[0.5px] flex items-center justify-center transition-colors duration-200 ${
                      statusFilter === opt.value
                        ? "bg-[#463C2E] border-[#463C2E]"
                        : "bg-[#E4DECC] border-[#463C2E4d] group-hover:border-[#463C2E]/60"
                    }`}>
                      {statusFilter === opt.value && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]" style={{ fontFamily: "var(--font-mono)" }}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <p
                className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                CATEGORIAS
              </p>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-[18px] h-[18px] border-[0.5px] flex items-center justify-center transition-colors duration-200 ${
                    categoryFilter === "all"
                      ? "bg-[#463C2E] border-[#463C2E]"
                      : "bg-[#E4DECC] border-[#463C2E4d] group-hover:border-[#463C2E]/60"
                  }`}>
                    {categoryFilter === "all" && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]" style={{ fontFamily: "var(--font-mono)" }}>
                    TODOS
                  </span>
                </label>
                {allCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-[18px] h-[18px] border-[0.5px] flex items-center justify-center transition-colors duration-200 ${
                      categoryFilter === cat
                        ? "bg-[#463C2E] border-[#463C2E]"
                        : "bg-[#E4DECC] border-[#463C2E4d] group-hover:border-[#463C2E]/60"
                    }`}>
                      {categoryFilter === cat && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]" style={{ fontFamily: "var(--font-mono)" }}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Status summary bar */}
            <div className="sticky top-[72px] z-40 bg-[#F8F6E8] border-b border-[#463C2E]/30 px-5 lg:px-8 py-3 flex flex-wrap items-center gap-2" style={{ fontFamily: "var(--font-mono)" }}>
              {counts.produz > 0 && (
                <span className="px-3 py-1.5 bg-[#67D24D] text-[#463C2E] text-[10px] tracking-[-0.06em] uppercase leading-none">
                  {counts.produz} PRODUZ
                </span>
              )}
              {counts.importa > 0 && (
                <span className="px-3 py-1.5 bg-[#F45142] text-white text-[10px] tracking-[-0.06em] uppercase leading-none">
                  {counts.importa} NÃO PRODUZ
                </span>
              )}
              {counts.parcial > 0 && (
                <span className="px-3 py-1.5 bg-[#F5A623] text-[#463C2E] text-[10px] tracking-[-0.06em] uppercase leading-none">
                  {counts.parcial} PARCIAL
                </span>
              )}
              <span className="text-[#463C2E] text-[10px] tracking-[-0.06em] uppercase leading-none ml-3">
                {counts.total} TOTAL
              </span>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto px-3 py-1.5 text-[10px] tracking-[-0.06em] uppercase text-[#463C2E]/60 hover:text-[#463C2E] transition-colors"
                >
                  LIMPAR FILTROS
                </button>
              )}
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="px-5 lg:px-8 py-3 flex flex-wrap gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                {statusFilter !== "all" && (
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E4DECC] text-[#463C2E] text-[10px] tracking-[-0.06em] uppercase border border-[#463C2E]/10 hover:border-[#463C2E]/30 transition-colors"
                  >
                    {statusConfig[statusFilter as Status].label}
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M6 18L18 6" /></svg>
                  </button>
                )}
                {categoryFilter !== "all" && (
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E4DECC] text-[#463C2E] text-[10px] tracking-[-0.06em] uppercase border border-[#463C2E]/10 hover:border-[#463C2E]/30 transition-colors"
                  >
                    {categoryFilter}
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M6 18L18 6" /></svg>
                  </button>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E4DECC] text-[#463C2E] text-[10px] tracking-[-0.06em] uppercase border border-[#463C2E]/10 hover:border-[#463C2E]/30 transition-colors"
                  >
                    &ldquo;{search}&rdquo;
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M6 18L18 6" /></svg>
                  </button>
                )}
              </div>
            )}

            {/* Cards grid */}
            <div className="px-5 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p, i) => {
                  const sc = statusConfig[p.status];
                  return (
                    <Link
                      key={p.slug}
                      href={`/projetos/o-que-o-brasil-pode-construir/${p.slug}`}
                      className={`group flex flex-col fade-in-up stagger-${Math.min(i + 1, 5)}`}
                    >
                      <div className="border-[0.5px] border-[#463C2E] bg-[#E4DECC] overflow-hidden flex flex-col flex-1 transition-all duration-200 hover:border-[#463C2E]/40 hover:shadow-sm">
                        <div className="w-full aspect-[3/2] bg-[#F8F6E8] flex items-center justify-center overflow-hidden relative">
                          <div className="text-[#463C2E]/50 opacity-40 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110">
                            <div className="scale-[2.5]">
                              {statusIcons[p.slug]}
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col gap-2.5 flex-1">
                          <h3 className="text-[20px] lg:text-[24px] leading-[120%] tracking-[-0.02em] text-[#463C2E]">
                            {p.nome}
                          </h3>
                          <p className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/40" style={{ fontFamily: "var(--font-mono)" }}>
                            {p.categoria}
                          </p>

                          <div className="mt-auto pt-5 border-t border-dashed-custom flex items-center justify-between">
                            <div className={`flex items-center gap-1.5 px-2 py-1 ${sc.bg} ${sc.border} border`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.color}`} />
                              <span className={`text-[10px] tracking-[-0.06em] font-bold ${sc.text}`} style={{ fontFamily: "var(--font-mono)" }}>
                                {sc.label}
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-2 px-2.5 py-2.5 bg-[#463C2E] text-[#F8F6E8] text-[10px] tracking-[-0.06em] uppercase leading-none group-hover:bg-[#463C2E]/80 transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                              VER MAIS
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="#F0E8D8" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <p className="text-[14px] tracking-[-0.06em] uppercase text-[#463C2E]/50 text-center py-20" style={{ fontFamily: "var(--font-mono)" }}>
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
