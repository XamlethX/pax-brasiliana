"use client";

import { useState, useMemo, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  produtos,
  statusConfig,
  statusColors,
  nivelLabels,
  type Status,
  type NivelCadeia,
  type ItemCadeia,
} from "@/data/produtos";

function Pennant({ status }: { status: Status }) {
  const isNo = status === "importa";
  const fill = statusColors[status].pennant;
  return (
    <svg width="15" viewBox="0 0 21 31" fill="none" className="lg:w-[21px]">
      <path d="M0 0H21V24L10.5 31L0 24V0Z" fill={fill} />
      {isNo ? (
        <path d="M7 9L14 16M14 9L7 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M6.5 12.5L9.5 15.5L14.5 9.5" stroke="#463C2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const config: Record<Status, { bg: string; text: string; label: string }> = {
    produz: { bg: "bg-[#67D24D]", text: "text-[#463C2E]", label: "PRODUZ" },
    parcial: { bg: "bg-[#F5A623]", text: "text-[#463C2E]", label: "PARCIAL" },
    importa: { bg: "bg-[#F45142]", text: "text-white", label: "IMPORTA" },
  };
  const c = config[status];
  return (
    <span
      className={`inline-block px-2.5 py-1 ${c.bg} ${c.text} text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase leading-none`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {c.label}
    </span>
  );
}

function DashedDivider({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-5 lg:py-6">
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="mb-2.5">
        <path d="M7 16V2M7 2L1 8M7 2L13 8" stroke="#463C2E" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
      <div className="w-full flex items-center gap-2.5 lg:gap-12">
        <div
          className="flex-1 h-0"
          style={{
            borderTop: "0.5px dashed",
            borderImage: "repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1",
          }}
        />
        <span
          className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E] whitespace-nowrap shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </span>
        <div
          className="flex-1 h-0"
          style={{
            borderTop: "0.5px dashed",
            borderImage: "repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1",
          }}
        />
      </div>
    </div>
  );
}

function SupplyChainNode({
  item,
  isSelected,
  isHighlighted,
  hasHighlights,
  onClick,
}: {
  item: ItemCadeia;
  isSelected: boolean;
  isHighlighted: boolean;
  hasHighlights: boolean;
  onClick: () => void;
}) {
  const dimmed = hasHighlights && !isHighlighted;

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-[#E4DECC] border border-[#68D34D]
        p-[6px] pt-6 lg:p-5
        flex flex-col-reverse lg:flex-row lg:items-center gap-[10px] lg:gap-5
        w-[102px] h-auto lg:w-[240px] lg:min-h-[120px] overflow-hidden
        cursor-pointer transition-all duration-200
        ${isSelected ? "shadow-md ring-2 ring-[#417ce5]" : "hover:shadow-sm"}
        ${dimmed ? "opacity-30" : "opacity-100"}
      `}
    >
      <div className="absolute top-0 left-[6px] lg:left-5">
        <Pennant status={item.status} />
      </div>

      <div className="flex-1 mt-4 lg:mt-0">
        <h4
          className="text-[6px] lg:text-[12px] leading-[130%] tracking-[-0.06em] text-[#463C2E] uppercase lg:py-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {item.nome}
        </h4>
      </div>

      <div className="h-[40px] w-[60px] lg:h-auto lg:w-20 flex items-center justify-center shrink-0">
        <span className="text-2xl lg:text-4xl">{item.icon}</span>
      </div>
    </div>
  );
}

export default function ProdutoPage() {
  useScrollReveal();
  const params = useParams();
  const slug = params.slug as string;
  const produto = produtos.find((p) => p.slug === slug);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const selectedItem = useMemo(
    () => produto?.cadeia.find((i) => i.id === selectedId) ?? null,
    [produto, selectedId],
  );

  const highlightedIds = useMemo(() => {
    if (!selectedId || !produto) return new Set<string>();
    const ids = new Set<string>();
    const map = new Map(produto.cadeia.map((i) => [i.id, i]));

    function traceUp(id: string) {
      if (ids.has(id)) return;
      ids.add(id);
      const item = map.get(id);
      if (!item) return;
      item.dependencias.forEach(traceUp);
    }
    function traceDown(id: string) {
      if (ids.has(id)) return;
      ids.add(id);
      const item = map.get(id);
      if (!item) return;
      item.habilita.forEach(traceDown);
    }

    traceUp(selectedId);
    traceDown(selectedId);
    return ids;
  }, [selectedId, produto]);

  const groupedByLevel = useMemo(() => {
    if (!produto) return { produto_final: [], componente: [], materia_prima: [] };
    const items = produto.cadeia.filter(
      (i) => filterStatus === "all" || i.status === filterStatus,
    );
    return {
      produto_final: items.filter((i) => i.nivel === "produto_final"),
      componente: items.filter((i) => i.nivel === "componente"),
      materia_prima: items.filter((i) => i.nivel === "materia_prima"),
    };
  }, [produto, filterStatus]);

  const counts = useMemo(() => {
    if (!produto) return { produz: 0, parcial: 0, importa: 0, total: 0 };
    return {
      produz: produto.cadeia.filter((i) => i.status === "produz").length,
      parcial: produto.cadeia.filter((i) => i.status === "parcial").length,
      importa: produto.cadeia.filter((i) => i.status === "importa").length,
      total: produto.cadeia.length,
    };
  }, [produto]);

  const handleNodeClick = useCallback(
    (id: string) => setSelectedId((prev) => (prev === id ? null : id)),
    [],
  );

  if (!produto) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F8F6E8] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-h3 text-[#463C2E]">Produto não encontrado</h1>
            <Link
              href="/projetos/o-que-o-brasil-pode-construir"
              className="text-accents text-[#463C2E]/50 mt-6 inline-block link-underline pb-1"
            >
              VOLTAR AOS PROJETOS
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8F6E8]">
        {/* Hero — shared with listing page */}
        <div className="pt-40 pb-16 lg:pb-20 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="grid grid-cols-1 lg:grid-cols-[33.33%_33.33%_33.33%] items-center gap-10 lg:gap-0">
            <div className="lg:pl-0 lg:pr-5">
              <h1
                className="text-[48px] lg:text-[64px] leading-[90%] tracking-[-0.04em] text-[#463C2E] font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                O que o Brasil
                <br />
                pode construir?
              </h1>
            </div>
            <div>
              <p className="text-[14px] lg:text-[16px] leading-[140%] text-[#463C2E]/70">
                De placas solares a foguetes orbitais. Um mapa da capacidade
                produtiva brasileira — o que já fazemos, o que poderíamos fazer,
                e o que ainda importamos.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation bar — BACK + status badges */}
        <div className="border-b-[0.5px] border-[#463C2E]/30 px-5 lg:px-10 py-4 flex flex-col gap-5 lg:flex-row items-start lg:items-center justify-between">
          <Link
            href="/projetos/o-que-o-brasil-pode-construir"
            className="inline-flex items-center gap-2.5 text-[12px] lg:text-[14px] tracking-[-0.06em] uppercase text-[#463C2E] hover:opacity-60 transition-opacity cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#463C2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            VOLTAR
          </Link>
          <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: "var(--font-mono)" }}>
            {counts.produz > 0 && (
              <span className="px-3 py-1.5 bg-[#67D24D] text-[#463C2E] text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase leading-none">
                {counts.produz} PRODUZ
              </span>
            )}
            {counts.importa > 0 && (
              <span className="px-3 py-1.5 bg-[#F45142] text-white text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase leading-none">
                {counts.importa} IMPORTA
              </span>
            )}
            {counts.parcial > 0 && (
              <span className="px-3 py-1.5 bg-[#F5A623] text-[#463C2E] text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase leading-none">
                {counts.parcial} PARCIAL
              </span>
            )}
            <span className="text-[#463C2E] text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase leading-none ml-2.5">
              {counts.total} TOTAL
            </span>
          </div>
        </div>

        {/* Main content — supply chain + sidebar */}
        <div className="flex flex-col-reverse lg:flex-row relative">
          {/* Supply chain visualization */}
          <div className="flex-1 px-2.5 lg:px-[55px] py-10 relative border-t-[0.5px] border-t-[#463C2E]/30 lg:border-t-0 mx-2.5 lg:mx-0">
            {/* PRODUTO FINAL */}
            <p
              className="text-[10px] lg:text-[12px] tracking-[-0.06em] text-[#463C2E] uppercase text-center mb-5 lg:mb-6"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PRODUTO FINAL
            </p>
            <div className="flex flex-wrap gap-5 lg:gap-[55px] justify-center">
              {groupedByLevel.produto_final.map((item) => (
                <SupplyChainNode
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  isHighlighted={highlightedIds.has(item.id)}
                  hasHighlights={highlightedIds.size > 0}
                  onClick={() => handleNodeClick(item.id)}
                />
              ))}
            </div>

            {/* Inline filter bar — matches BA position after final product */}
            <div
              className="sticky bottom-0 z-10 mt-6 mb-2 border-[0.5px] border-[#463C2E] bg-[#F8F6E8] pl-2.5 pr-2.5 lg:pl-7 lg:pr-4 py-2.5 flex items-center gap-4 flex-wrap"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]">
                FILTRAR
              </span>
              {[
                { value: "all", label: "TODOS", bg: "bg-[#E4DECC]", text: "text-[#463C2E]" },
                { value: "produz", label: "PRODUZ", bg: "bg-[#67D24D]", text: "text-[#463C2E]" },
                { value: "importa", label: "IMPORTA", bg: "bg-[#F45142]", text: "text-white" },
                { value: "parcial", label: "PARCIAL", bg: "bg-[#F5A623]", text: "text-[#463C2E]" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterStatus(opt.value); setSelectedId(null); }}
                  className={`px-3 py-1.5 text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase leading-none transition-all duration-200
                    ${filterStatus === opt.value
                      ? `${opt.bg} ${opt.text}`
                      : "text-[#463C2E]/50 hover:text-[#463C2E]"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* COMPONENTES */}
            {groupedByLevel.componente.length > 0 && (
              <>
                <DashedDivider label="COMPONENTES" />
                <div className="flex flex-wrap gap-[14px] lg:gap-[55px] justify-center">
                  {groupedByLevel.componente.map((item) => (
                    <SupplyChainNode
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      isHighlighted={highlightedIds.has(item.id)}
                      hasHighlights={highlightedIds.size > 0}
                      onClick={() => handleNodeClick(item.id)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* MATÉRIAS-PRIMAS */}
            {groupedByLevel.materia_prima.length > 0 && (
              <>
                <DashedDivider label="MATÉRIAS-PRIMAS" />
                <div className="flex flex-wrap gap-[14px] lg:gap-[55px] justify-center">
                  {groupedByLevel.materia_prima.map((item) => (
                    <SupplyChainNode
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      isHighlighted={highlightedIds.has(item.id)}
                      hasHighlights={highlightedIds.size > 0}
                      onClick={() => handleNodeClick(item.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-[33.33%] shrink-0 border-b lg:border-b-0 lg:border-l border-[#463C2E]/30">
            <div className="sticky top-0 pl-5 pr-5 lg:px-10 py-10 pb-5 max-h-screen overflow-y-auto">
              <h3
                className="text-[20px] lg:text-[24px] leading-[120%] tracking-[-0.02em] text-[#463C2E] text-center mb-5 font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Cadeia Produtiva
              </h3>

              {/* Flow legend */}
              <div className="space-y-0 mb-5 lg:mb-10">
                {(["produto_final", "componente", "materia_prima"] as NivelCadeia[]).map(
                  (nivel, i) => (
                    <div key={nivel}>
                      <div className="border-[0.5px] border-[#463C2E]/30 py-3 text-center">
                        <span
                          className="text-[10px] lg:text-[12px] tracking-[-0.06em] text-[#463C2E] uppercase"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {nivelLabels[nivel]}
                        </span>
                      </div>
                      {i < 2 && (
                        <div className="flex justify-center py-3">
                          <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
                            <path d="M4.5 0V8M4.5 8L1 5M4.5 8L8 5" stroke="#463C2E" strokeWidth="1" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>

              {/* Instruction or detail */}
              {!selectedItem ? (
                <p
                  className="text-[10px] lg:text-[12px] tracking-[-0.06em] text-[#463C2E]/40 uppercase text-center my-5 lg:my-10"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  CLIQUE EM UM NÓ PARA
                  <br />
                  RASTREAR DEPENDÊNCIAS
                </p>
              ) : (
                <div className="border-t border-[#463C2E]/20 pt-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-[#E4DECC]flex items-center justify-center shrink-0">
                        <span className="text-2xl">{selectedItem.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#463C2E]">{selectedItem.nome}</h4>
                        <p
                          className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mt-1"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {nivelLabels[selectedItem.nivel]}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="p-1 hover:bg-[#E4DECC]transition-colors shrink-0"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#463C2E" strokeWidth="2" strokeOpacity="0.5">
                        <path d="M6 6l12 12M6 18L18 6" />
                      </svg>
                    </button>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <p
                      className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      PRODUZIDO NO BRASIL?
                    </p>
                    <StatusBadge status={selectedItem.status} />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p
                      className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      DESCRIÇÃO
                    </p>
                    <p className="text-[14px] leading-[160%] text-[#463C2E]/70">
                      {selectedItem.descricao}
                    </p>
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <p
                      className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      CAPACIDADE BRASILEIRA
                    </p>
                    <p className="text-[14px] leading-[160%] text-[#463C2E]/70">
                      {selectedItem.capacidade}
                    </p>
                  </div>

                  {/* Global context */}
                  <div className="mb-4">
                    <p
                      className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      CONTEXTO GLOBAL
                    </p>
                    <p className="text-[14px] leading-[160%] text-[#463C2E]/70">
                      {selectedItem.contextoGlobal}
                    </p>
                  </div>

                  {/* Companies */}
                  {selectedItem.empresas.length > 0 && (
                    <div>
                      <p
                        className="text-[10px] lg:text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-2"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        EMPRESAS
                      </p>
                      <div>
                        {selectedItem.empresas.map((empresa) => (
                          <div
                            key={empresa}
                            className="flex justify-between items-center py-2 border-b border-[#463C2E]/10 text-[14px] text-[#463C2E] uppercase"
                            style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
                          >
                            {empresa}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation to other products */}
        <section className="border-t-[0.5px] border-[#463C2E]/30 px-5 lg:px-10 py-10">
          <p
            className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]/50 mb-6"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            EXPLORAR OUTROS PRODUTOS
          </p>
          <div className="flex flex-wrap gap-3">
            {produtos
              .filter((p) => p.slug !== slug)
              .map((p) => {
                const psc = statusConfig[p.status];
                return (
                  <Link
                    key={p.slug}
                    href={`/projetos/o-que-o-brasil-pode-construir/${p.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-[#E4DECC] border-[0.5px] border-[#463C2E] hover:shadow-sm transition-all duration-200"
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${psc.color}`} />
                    <span
                      className="text-[12px] tracking-[-0.06em] uppercase text-[#463C2E]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p.nome}
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
