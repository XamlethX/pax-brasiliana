"use client";

import { useState, useMemo } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { produtos } from "@/data/produtos";

const allCategories = Array.from(new Set(produtos.map((p) => p.categoria)));

const ProductIllustration = ({ slug }: { slug: string }) => {
  const icons: Record<string, React.ReactNode> = {
    "placas-solares": (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="8" y="12" width="104" height="70" rx="0" />
        <line x1="8" y1="30" x2="112" y2="30" /><line x1="8" y1="48" x2="112" y2="48" /><line x1="8" y1="66" x2="112" y2="66" />
        <line x1="34" y1="12" x2="34" y2="82" /><line x1="60" y1="12" x2="60" y2="82" /><line x1="86" y1="12" x2="86" y2="82" />
        <line x1="46" y1="88" x2="74" y2="88" /><line x1="60" y1="82" x2="60" y2="88" />
      </svg>
    ),
    "baterias": (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="16" y="20" width="48" height="84" rx="0" />
        <rect x="30" y="12" width="20" height="10" rx="0" />
        <line x1="40" y1="46" x2="40" y2="68" /><line x1="28" y1="57" x2="52" y2="57" />
        <line x1="26" y1="78" x2="54" y2="78" /><line x1="26" y1="86" x2="54" y2="86" /><line x1="26" y1="94" x2="54" y2="94" />
      </svg>
    ),
    "foguete-orbital": (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M40 8 C28 24 20 44 20 68 L60 68 C60 44 52 24 40 8z" />
        <path d="M20 68 L10 90 L24 82" /><path d="M60 68 L70 90 L56 82" />
        <rect x="34" y="72" width="12" height="16" rx="0" />
        <circle cx="40" cy="42" r="7" />
      </svg>
    ),
    "fertilizante": (
      <svg width="100" height="110" viewBox="0 0 100 110" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M50 100 L50 40" />
        <path d="M50 60 C50 60 30 52 22 36 C34 34 48 42 50 60z" />
        <path d="M50 48 C50 48 70 40 78 24 C66 22 52 30 50 48z" />
        <path d="M50 76 C50 76 68 68 76 52 C64 50 50 58 50 76z" />
        <ellipse cx="50" cy="100" rx="24" ry="6" />
      </svg>
    ),
    "drones": (
      <svg width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="60" cy="45" r="10" />
        <line x1="60" y1="45" x2="22" y2="22" /><line x1="60" y1="45" x2="98" y2="22" />
        <line x1="60" y1="45" x2="22" y2="68" /><line x1="60" y1="45" x2="98" y2="68" />
        <circle cx="22" cy="22" r="10" /><circle cx="98" cy="22" r="10" />
        <circle cx="22" cy="68" r="10" /><circle cx="98" cy="68" r="10" />
        <ellipse cx="22" cy="22" rx="14" ry="6" /><ellipse cx="98" cy="22" rx="14" ry="6" />
        <ellipse cx="22" cy="68" rx="14" ry="6" /><ellipse cx="98" cy="68" rx="14" ry="6" />
      </svg>
    ),
    "energia": (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M46 8 L18 58 L38 58 L34 112 L62 62 L42 62 Z" />
      </svg>
    ),
    "aco": (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="8" y="60" width="104" height="32" />
        <rect x="20" y="30" width="20" height="30" /><rect x="50" y="14" width="20" height="46" /><rect x="80" y="30" width="20" height="30" />
        <line x1="8" y1="60" x2="20" y2="30" /><line x1="100" y1="30" x2="112" y2="60" />
        <path d="M50 14 L40 8 L60 8 L70 14" />
      </svg>
    ),
  };
  return (
    <span className="text-bark/40 group-hover:text-bark/60 transition-colors duration-200 ease-out">
      {icons[slug] || icons["energia"]}
    </span>
  );
};

const statusLabels: Record<string, string> = {
  all: "TODOS",
  produz: "PRODUZ",
  importa: "NÃO PRODUZ",
  parcial: "PARCIAL",
};

const StackIcon = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden="true">
    <path d="M1 14l10 4 10-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M1 9.5l10 4 10-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M11 1L1 5l10 4 10-4-10-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function OQueOBrasilPodeConstruir() {
  useScrollReveal();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);

  const filtered = useMemo(() => {
    return produtos.filter((p) => {
      const matchesSearch = search === "" || p.nome.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.categoria === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, statusFilter, categoryFilter]);

  const allCounts = useMemo(() => ({
    produz: produtos.filter((p) => p.status === "produz").length,
    parcial: produtos.filter((p) => p.status === "parcial").length,
    importa: produtos.filter((p) => p.status === "importa").length,
  }), []);

  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); };
  const activeLabel = statusFilter !== "all" ? statusLabels[statusFilter] : categoryFilter !== "all" ? categoryFilter : search ? `"${search}"` : "TODOS";

  const filterOption = (value: string, label: string, current: string, setter: (v: string) => void) => {
    const active = current === value;
    return (
      <button key={value} onClick={() => setter(value)} className="flex items-center gap-2.5 py-1.5 w-full text-left cursor-pointer group">
        <span className={`w-3.5 h-3.5 border shrink-0 transition-colors ${active ? "bg-bark border-bark" : "border-bark/30 group-hover:border-bark/60"}`} />
        <span className={`font-mono text-[13px] uppercase transition-colors ${active ? "text-bark" : "text-bark/50 group-hover:text-bark"}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="grid-lines bg-mist border-b border-bark/10 pt-[96px]">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 px-5 lg:px-10 py-10 lg:py-16 flex items-end">
              <h1
                className="font-heading font-black tracking-[-0.05em] text-bark"
                style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1.05 }}
              >
                O que o Brasil<br />pode Construir?
              </h1>
            </div>
            <div className="lg:w-2/3 px-5 lg:px-10 py-10 lg:py-16 flex items-end">
              <p className="text-paragraphs text-bark/70 max-w-[560px]">
                Enquanto muitos acreditam que os dias de manufatura do Brasil ficaram para trás,
                este guia interativo ajuda você a explorar as conexões entre nossos recursos
                abundantes, inventividade e capacidade produtiva.
              </p>
            </div>
          </div>
        </section>

        {/* Filter + Content */}
        <div className="flex flex-col lg:flex-row bg-mist">
          {/* Mobile filter toggle */}
          <div className="lg:hidden px-5 py-3 border-b border-bark/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase text-bark/60 hover:text-bark transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h10M4 18h6" />
              </svg>
              FILTROS
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`lg:w-[280px] shrink-0 bg-mist border-r border-bark/10 px-6 py-7 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
            <h2 className="font-heading text-[26px] text-bark mb-6 leading-tight">Filtrar</h2>

            {/* Search */}
            <div className="mb-7">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/40" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="BUSCAR PRODUTOS"
                  className="font-mono w-full border border-bark/20 py-2 pl-9 pr-3 text-[12px] uppercase text-bark placeholder:text-bark/30 focus:outline-none focus:border-bark/50 transition-colors bg-transparent"
                />
              </div>
            </div>

            {/* Produção Nacional */}
            <div className="mb-6">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between w-full py-2 border-b border-bark/15 mb-1"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-bark/50">PRODUÇÃO NACIONAL</span>
                <ChevronIcon open={statusOpen} />
              </button>
              {statusOpen && (
                <div className="flex flex-col gap-0.5 mt-3">
                  {filterOption("all", "TODOS", statusFilter, setStatusFilter)}
                  {filterOption("produz", "PRODUZ", statusFilter, setStatusFilter)}
                  {filterOption("importa", "NÃO PRODUZ", statusFilter, setStatusFilter)}
                  {filterOption("parcial", "PARCIAL", statusFilter, setStatusFilter)}
                </div>
              )}
            </div>

            {/* Categorias */}
            <div>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center justify-between w-full py-2 border-b border-bark/15 mb-1"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-bark/50">CATEGORIAS</span>
                <ChevronIcon open={categoryOpen} />
              </button>
              {categoryOpen && (
                <div className="flex flex-col gap-0.5 mt-3">
                  {filterOption("all", "TODOS", categoryFilter, setCategoryFilter)}
                  {allCategories.map((cat) => filterOption(cat, cat, categoryFilter, setCategoryFilter))}
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Status bar */}
            <div className="border-b border-bark/10 px-5 lg:px-8 py-3 flex flex-wrap items-center gap-3">
              {/* Active filter chip */}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.06em] text-bark border border-bark/30 px-3 py-1.5 hover:border-bark/60 transition-colors"
              >
                {activeLabel}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>

              {/* Count pills */}
              <div className="ml-auto flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[12px] uppercase px-3 py-1.5 bg-[#67D24D] text-bark font-bold leading-none">
                  {allCounts.produz} PRODUZ
                </span>
                <span className="font-mono text-[12px] uppercase px-3 py-1.5 bg-clay text-mist font-bold leading-none">
                  {allCounts.importa} NÃO PRODUZ
                </span>
                <span className="font-mono text-[12px] uppercase px-3 py-1.5 bg-wattle text-bark font-bold leading-none">
                  {allCounts.parcial} PARCIAL
                </span>
                <span className="font-mono text-[12px] uppercase text-bark">
                  {produtos.length} TOTAL
                </span>
              </div>
            </div>

            {/* Cards grid */}
            <div className="px-5 lg:px-8 py-8">
              {filtered.length === 0 ? (
                <p className="font-mono text-[13px] uppercase text-bark/40 text-center py-20">
                  Nenhum produto encontrado.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((p) => {
                    return (
                      <Link
                        key={p.slug}
                        href={`/projetos/o-que-o-brasil-pode-construir/${p.slug}`}
                        className="group block bg-sand border border-bark/20 overflow-hidden hover:border-bark/50 transition-colors duration-200 ease-out"
                      >
                        {/* Image zone */}
                        <div className="relative overflow-hidden">
                          {p.imagem ? (
                            <div className="p-5 pb-0">
                              <span className="text-bark/25 group-hover:text-bark/40 transition-colors duration-200 ease-out">
                                <StackIcon />
                              </span>
                              <div className="h-[180px] flex items-center justify-center pb-4 pt-2">
                                <img
                                  src={p.imagem}
                                  alt={p.nome}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="p-5 pb-0">
                              <span className="text-bark/25 group-hover:text-bark/40 transition-colors duration-200 ease-out">
                                <StackIcon />
                              </span>
                              <div className="h-[180px] flex items-end justify-center pb-4 pt-2">
                                <ProductIllustration slug={p.slug} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Text zone */}
                        <div className="px-5 pb-5">
                          <h3 className="font-heading text-[22px] text-bark leading-tight mt-4">{p.nome}</h3>
                          <p className="font-mono text-[11px] uppercase text-bark/50 mt-1 tracking-[0.06em]">{p.categoria}</p>
                          <div className="mt-5">
                            <span className="inline-flex items-center gap-2 bg-coast text-mist font-mono text-[11px] uppercase px-3 py-2.5 hover:opacity-80 transition-opacity duration-200 ease-out">
                              VER MAIS
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
