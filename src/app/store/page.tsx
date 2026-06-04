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
    image: "/images/product-tee.svg",
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
    image: "/images/product-cap.svg",
  },
];

const sortOptions = [
  "Destaques",
  "Preço: Menor para Maior",
  "Preço: Maior para Menor",
  "A-Z",
  "Z-A",
];

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
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1 bg-mist grid-lines relative">
        {/* Header */}
        <section className="relative flex flex-col lg:flex-row gap-10 lg:gap-0 pt-[96px] pb-16 lg:pt-[96px] lg:pb-20 border-b-[0.5px] border-b-bark/40">
          <div className="lg:w-1/3 lg:pl-10 px-5 flex items-center">
            <div className="text-h3 font-bold text-bark">Loja</div>
          </div>
          <div className="lg:w-1/3 px-5 flex items-center text-paragraphs text-bark/70">
            Apoie o movimento. 100% de cada compra é destinado diretamente à missão da Pax Brasiliana.
          </div>
        </section>

        {/* Search and Sort Toolbar */}
        <div className="w-full px-5 py-8 lg:px-10 lg:py-10">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-accents font-mono uppercase text-bark/60">
                Buscar produtos
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-bark/30 bg-transparent px-4 py-3 text-paragraphs outline-none transition-colors focus:border-bark"
              />
            </label>
            <label className="block min-w-[220px]">
              <span className="mb-2 block text-accents font-mono uppercase text-bark/60">
                Ordenar produtos
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border border-bark/30 bg-mist px-4 py-3 text-accents font-mono uppercase outline-none transition-colors focus:border-bark appearance-none"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-y-5 lg:gap-y-0 lg:grid-cols-3">
            {sorted.map((product, i) => (
              <Link
                key={product.slug}
                href={`/store/product/${product.slug}`}
                className={`group block bg-mist border-[0.5px] border-bark overflow-hidden transition-colors duration-300 fade-in-up stagger-${Math.min(i + 1, 3)}`}
              >
                <div className="aspect-square overflow-hidden bg-sand">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="pl-10 py-10 bg-sand">
                  <div className="text-accents font-mono uppercase text-bark">
                    {product.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-accents font-mono text-bark/60">
                      R${" "}
                      {product.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
