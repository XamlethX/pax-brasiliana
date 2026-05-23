"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";

const products: Record<
  string,
  {
    title: string;
    price: number;
    description: string;
    sizes: string[];
    image: string;
  }
> = {
  "pax-brasiliana-tee": {
    title: "Camiseta Pax Brasiliana",
    price: 150.0,
    description:
      "Camiseta 100% algodão pima brasileiro, fabricada em São Paulo. Corte moderno, confortável e durável. Estampa minimalista com o emblema Pax Brasiliana. Feita no Brasil, para quem constrói o Brasil.",
    sizes: ["P", "M", "G", "GG", "XGG"],
    image: "/images/logo-dark.png",
  },
  "early-supporters-flag": {
    title: "Bandeira do Apoiador Inicial",
    price: 30000.0,
    description:
      "Bandeira exclusiva para apoiadores iniciais do movimento. Tecido premium, 2.7m x 1.37m, produzida em tiragem limitada. 100% do valor é destinado diretamente à missão da Pax Brasiliana. Inclui certificado de apoiador fundador.",
    sizes: ["Único"],
    image: "/images/flag.png",
  },
  "pax-brasiliana-cap": {
    title: "Boné Pax Brasiliana",
    price: 180.0,
    description:
      "Boné estruturado com bordado frontal do emblema Pax Brasiliana. Fabricado no Brasil com algodão orgânico. Fecho ajustável em metal. Para usar enquanto constrói.",
    sizes: ["Único"],
    image: "/images/logo-dark.png",
  },
};

const allProducts = Object.entries(products).map(([slug, data]) => ({
  slug,
  ...data,
}));

export default function ProductDetailPage() {
  useScrollReveal();
  const params = useParams();
  const slug = params.slug as string;
  const product = products[slug];
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F8F6E8] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-h3 text-[#463C2E]">Produto não encontrado</h1>
            <Link
              href="/store"
              className="text-accents text-[#463C2E]/50 mt-6 inline-block link-underline pb-1"
            >
              VOLTAR À LOJA
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = allProducts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="bg-[#F8F6E8]">
        {/* Breadcrumb */}
        <div className="pt-28 px-5 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <nav
              className="text-accents text-[#463C2E]/50 flex items-center gap-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Link
                href="/store"
                className="link-underline pb-0.5 transition-opacity duration-300 hover:opacity-60"
              >
                LOJA
              </Link>
              <span>/</span>
              <span className="text-[#463C2E]">{product.title.toUpperCase()}</span>
            </nav>
          </div>
        </div>

        {/* Product */}
        <section className="px-5 lg:px-10 py-12 lg:py-20">
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <div className="aspect-square bg-[#E4DECC] border-[0.5px] border-[#463C2E] flex items-center justify-center overflow-hidden fade-in-up">
              <img
                src={product.image}
                alt={product.title}
                className="w-1/3 h-auto object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col fade-in-up stagger-2">
              <h1
                className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-[#463C2E] font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.title}
              </h1>

              <p
                className="text-[24px] lg:text-[32px] text-[#463C2E] mt-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                R${" "}
                {product.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <p className="mt-6 text-[#463C2E]/70 text-[14px] lg:text-[16px] leading-[160%]">
                {product.description}
              </p>

              {/* Size selector */}
              <div className="mt-8">
                <p
                  className="text-accents text-[#463C2E]/50 mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  TAMANHO
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 text-[12px] tracking-[-0.06em] uppercase border transition-all duration-200 ${
                        selectedSize === size
                          ? "border-[#463C2E] bg-[#463C2E] text-[#F8F6E8]"
                          : "border-[#463C2E]/30 text-[#463C2E] hover:border-[#463C2E]"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <p
                  className="text-accents text-[#463C2E]/50 mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  QUANTIDADE
                </p>
                <div className="flex items-center border border-[#463C2E]/30 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-[#463C2E] hover:bg-[#E4DECC] transition-colors"
                  >
                    −
                  </button>
                  <span
                    className="px-4 py-2.5 text-[14px] text-[#463C2E] tabular-nums min-w-[3rem] text-center"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 text-[#463C2E] hover:bg-[#E4DECC] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                className="mt-8 uppercase leading-none flex gap-2 px-4 py-4 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between transition-all duration-300 hover:opacity-80 cursor-pointer text-accents"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span>ADICIONAR AO CARRINHO</span>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                    fill="#F8F6E8"
                  />
                </svg>
              </button>

              <p
                className="mt-4 text-[#463C2E]/40 text-[11px] leading-[160%]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                100% DO VALOR É DESTINADO À MISSÃO DA PAX BRASILIANA.
                FABRICADO NO BRASIL.
              </p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="px-5 lg:px-10 pb-16 lg:pb-20 border-t-[0.5px] border-[#463C2E]/30 pt-12">
            <div className="max-w-[1200px] mx-auto">
              <p
                className="text-accents text-[#463C2E]/50 mb-8 border-l-[1px] border-[#F45141] pl-5 py-[9px]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                OUTROS PRODUTOS
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/store/product/${p.slug}`}
                    className="group"
                  >
                    <div className="aspect-square bg-[#E4DECC] border-[0.5px] border-[#463C2E] flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-1/3 h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                      <h3
                        className="text-base text-[#463C2E] font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {p.title}
                      </h3>
                      <span
                        className="text-sm text-[#463C2E]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        R${" "}
                        {p.price.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
