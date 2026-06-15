"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products as allProducts, getStoreProduct } from "@/data/store";
import type { ShippingOption } from "@/lib/melhor-envio";

const brl = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function ProductDetailPage() {
  useScrollReveal();
  const params = useParams();
  const slug = params.slug as string;
  const product = getStoreProduct(slug);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");

  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingStatus, setShippingStatus] = useState<"idle" | "loading" | "error">("idle");
  const [shippingError, setShippingError] = useState("");

  // Quantidade mudou: a cotação anterior não vale mais.
  useEffect(() => {
    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingStatus("idle");
  }, [quantity]);

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

  const handleCalculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setShippingStatus("error");
      setShippingError("CEP inválido.");
      return;
    }
    setShippingStatus("loading");
    setShippingError("");
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const res = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity, cep: cleanCep }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro");
      const options: ShippingOption[] = data.options ?? [];
      setShippingOptions(options);
      setSelectedShipping(options[0] ?? null);
      setShippingStatus("idle");
    } catch (err) {
      setShippingStatus("error");
      setShippingError(err instanceof Error ? err.message : "Não foi possível calcular o frete.");
    }
  };

  const handleCheckout = async () => {
    if (needsSize && !selectedSize) {
      alert("Selecione um tamanho.");
      return;
    }
    if (!selectedShipping) {
      alert("Calcule e selecione o frete antes de continuar.");
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
          shipping: {
            name: `${selectedShipping.company} ${selectedShipping.name}`.trim(),
            price: selectedShipping.price,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erro");
      window.location.href = data.url;
    } catch {
      setCheckoutStatus("error");
    }
  };

  const total = product.price * quantity + (selectedShipping?.price ?? 0);

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

              {/* Shipping */}
              <div className="mt-6">
                <p className="text-accents text-bark/50 mb-3 font-mono">
                  CALCULAR FRETE
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && handleCalculateShipping()}
                    className="flex-1 min-w-0 px-4 py-2.5 text-[14px] text-bark bg-transparent border border-bark/30 font-mono focus:outline-none focus:border-bark"
                  />
                  <button
                    onClick={handleCalculateShipping}
                    disabled={shippingStatus === "loading"}
                    className="px-4 py-2.5 text-[12px] uppercase border border-bark/30 text-bark hover:border-bark transition-all duration-200 ease-out font-mono disabled:opacity-50 whitespace-nowrap"
                  >
                    {shippingStatus === "loading" ? "CALCULANDO..." : "CALCULAR"}
                  </button>
                </div>

                {shippingStatus === "error" && (
                  <p className="mt-2 text-clay text-accents font-mono">
                    {shippingError}
                  </p>
                )}

                {shippingOptions.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] border cursor-pointer font-mono transition-all duration-200 ease-out ${
                          selectedShipping?.id === opt.id
                            ? "border-bark bg-sand"
                            : "border-bark/30 hover:border-bark"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-bark">
                          <input
                            type="radio"
                            name="shipping-option"
                            checked={selectedShipping?.id === opt.id}
                            onChange={() => setSelectedShipping(opt)}
                            className="accent-bark"
                          />
                          {[opt.company, opt.name].filter(Boolean).join(" ")}
                          {opt.deliveryTime != null
                            ? ` · até ${opt.deliveryTime} dia${opt.deliveryTime === 1 ? "" : "s"} úteis`
                            : ""}
                        </span>
                        <span className="text-bark whitespace-nowrap">
                          R$ {brl(opt.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Total */}
              {selectedShipping && (
                <div className="mt-6 flex items-center justify-between border-t-[0.5px] border-bark/30 pt-4 text-bark font-mono">
                  <span className="text-accents text-bark/50">TOTAL COM FRETE</span>
                  <span className="text-[18px]">R$ {brl(total)}</span>
                </div>
              )}

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
