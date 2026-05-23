"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import Link from "next/link";

const products = [
  {
    slug: "pax-brasiliana-tee",
    title: "Camiseta Pax Brasiliana",
    price: 150.0,
    image: "/images/logo-dark.png",
  },
  {
    slug: "early-supporters-flag",
    title: "Bandeira do Apoiador Inicial",
    price: 30000.0,
    image: "/images/flag.png",
  },
  {
    slug: "pax-brasiliana-cap",
    title: "Boné Pax Brasiliana",
    price: 180.0,
    image: "/images/logo-dark.png",
  },
];

const sortOptions = ["Destaques", "Preço: Menor para Maior", "Preço: Maior para Menor", "A-Z", "Z-A"];

export default function StorePage() {
  useScrollReveal();
  const [sort, setSort] = useState("Destaques");
  const [search, setSearch] = useState("");

  const sorted = [...products]
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Preço: Menor para Maior") return a.price - b.price;
      if (sort === "Preço: Maior para Menor") return b.price - a.price;
      if (sort === "A-Z") return a.title.localeCompare(b.title);
      if (sort === "Z-A") return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero — cream bg two-column like BA */}
        <section className="bg-[#F8F6E8] pt-32 pb-12 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-[-0.04em] text-[#463C2E] italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Loja
            </h1>
            <p className="text-[#463C2E]/60 text-[14px] lg:text-[16px] leading-[140%] max-w-md lg:pb-3">
              Apoie o movimento. 100% de cada compra é destinado diretamente à missão da Pax Brasiliana.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F6E8] py-8 px-5 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Controls — search left, sort right */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10 pb-4 border-b-[0.5px] border-b-[#463C2E]/15" style={{ fontFamily: "var(--font-mono)" }}>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-tight text-[#463C2E]/40">
                <span>BUSCAR PRODUTOS</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none text-[#463C2E] text-[11px] uppercase tracking-tight focus:outline-none w-40 placeholder:text-[#463C2E]/30"
                  placeholder=""
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-tight text-[#463C2E]/40">
                <span>ORDENAR PRODUTOS</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent border-none text-[#463C2E] text-[11px] tracking-tight uppercase appearance-none cursor-pointer focus:outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((product, i) => (
                <Link
                  key={product.slug}
                  href={`/store/product/${product.slug}`}
                  className={`group cursor-pointer fade-in-up stagger-${Math.min(i + 1, 3)}`}
                >
                  <div className="aspect-square bg-[#E4DECC] overflow-hidden flex items-center justify-center border-[0.5px] border-[#463C2E]">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-1/3 h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <h3 className="text-base text-[#463C2E] font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {product.title}
                    </h3>
                    <span className="text-sm font-semibold text-[#463C2E]" style={{ fontFamily: "var(--font-mono)" }}>
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
