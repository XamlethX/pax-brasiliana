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
    image: "/images/product-tee.svg",
  },
  "early-supporters-flag": {
    title: "Bandeira do Apoiador Inicial",
    price: 30000.0,
    description:
      "Bandeira exclusiva para apoiadores iniciais do movimento. Tecido premium, 2.7m x 1.37m, produzida em tiragem limitada. 100% do valor é destinado diretamente à missão da Pax Brasiliana. Inclui certificado de apoiador fundador.",
    sizes: ["Único"],
    image: "/images/flag.jpg",
  },
  "pax-brasiliana-cap": {
    title: "Boné Pax Brasiliana",
    price: 180.0,
    description:
      "Boné estruturado com bordado frontal do emblema Pax Brasiliana. Fabricado no Brasil com algodão orgânico. Fecho ajustável em metal. Para usar enquanto constrói.",
    sizes: ["Único"],
    image: "/images/product-cap.jpg",
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
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");

  if (!product) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Navbar />
        <main id="main-content" className="flex-1 bg-mist flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-h3 text-bark">Produto não encontrado</h1>
            <Link
              href="/store"
              className="text-accents text-bark/50 mt-6 inline-block link-underline pb-1"
            >
              VOLTAR À LOJA
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = allProducts.filter((p) => p.slug !== slug).slice(0, 2);

  const needsSize = product.sizes.length > 1;

  const handleCheckout = async () => {
    if (needsSize && !selectedSize) {
      alert("Selecione um tamanho.");
      return;
    }
    setCheckoutStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: product.title,
          price: product.price,
          quantity,
          size: selectedSize || product.sizes[0],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erro");
      window.location.href = data.url;
    } catch {
      setCheckoutStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main className="flex-1 bg-mist">
        {/* Breadcrumb */}
        <div className="pt-28 px-5 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <nav className="text-accents text-bark/50 flex items-center gap-2 font-mono">
              <Link
                href="/store"
                className="link-underline pb-0.5 transition-opacity duration-300 ease-out hover:opacity-60"
              >
                LOJA
              </Link>
              <span>/</span>
              <span className="text-bark">{product.title.toUpperCase()}</span>
            </nav>
          </div>
        </div>

        {/* Product */}
        <section className="px-5 lg:px-10 py-12 lg:py-20">
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <div className="aspect-square bg-sand border-[0.5px] border-bark overflow-hidden fade-in-up">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col fade-in-up stagger-2">
              <h1 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-bark font-bold font-heading">
                {product.title}
              </h1>

              <p className="text-[24px] lg:text-[32px] text-bark mt-4 font-mono">
                R${" "}
                {product.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <p className="mt-6 text-bark/70 text-[14px] lg:text-[16px] leading-[160%]">
                {product.description}
              </p>

              {/* Size selector */}
              {needsSize && (
                <div className="mt-8">
                  <p className="text-accents text-bark/50 mb-3 font-mono">
                    TAMANHO
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 text-[12px] tracking-[-0.06em] uppercase border transition-all duration-200 ease-out font-mono ${
                          selectedSize === size
                            ? "border-bark bg-bark text-mist"
                            : "border-bark/30 text-bark hover:border-bark"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <p className="text-accents text-bark/50 mb-3 font-mono">
                  QUANTIDADE
                </p>
                <div className="flex items-center border border-bark/30 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-bark hover:bg-sand transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2.5 text-[14px] text-bark tabular-nums min-w-[3rem] text-center font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 text-bark hover:bg-sand transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Checkout */}
              {checkoutStatus === "error" && (
                <p className="mt-4 text-clay text-accents font-mono">
                  Erro ao processar. Tente novamente.
                </p>
              )}
              <button
                onClick={handleCheckout}
                disabled={checkoutStatus === "loading"}
                className="mt-8 uppercase leading-none flex gap-2 px-4 py-4 items-center bg-bark text-mist w-full justify-between transition-all duration-300 ease-out hover:opacity-80 cursor-pointer text-accents font-mono disabled:opacity-50"
              >
                <span>
                  {checkoutStatus === "loading" ? "REDIRECIONANDO..." : "COMPRAR AGORA"}
                </span>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <p className="mt-4 text-bark/40 text-[11px] leading-[160%] font-mono">
                100% DO VALOR É DESTINADO À MISSÃO DA PAX BRASILIANA.
                FABRICADO NO BRASIL.
              </p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="px-5 lg:px-10 pb-16 lg:pb-20 border-t-[0.5px] border-bark/30 pt-12">
            <div className="max-w-[1200px] mx-auto">
              <p className="text-accents text-bark/50 mb-8 border-l-[1px] border-clay pl-5 py-[9px] font-mono">
                OUTROS PRODUTOS
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/store/product/${p.slug}`}
                    className="group"
                  >
                    <div className="aspect-square bg-sand border-[0.5px] border-bark overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                      <h3 className="text-base text-bark font-bold font-heading">
                        {p.title}
                      </h3>
                      <span className="text-sm text-bark font-mono">
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
    </div>
  );
}
