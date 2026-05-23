"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinForm from "@/components/JoinForm";
import Link from "next/link";

const essays = [
  {
    slug: "reindustrializacao",
    title: "Reindustrialização: não é nostalgia, é necessidade",
    desc: "A desindustrialização silenciosa das últimas décadas e o custo real que pagamos hoje.",
    author: "Pax Brasiliana",
    date: "15 Mai 2026",
    category: "industria",
    image: "/images/hero.jpg",
  },
  {
    slug: "herois-que-fabricam",
    title: "Por que o Brasil não constrói heróis que fabricam?",
    desc: "Nossa cultura celebra o especulador e ignora o industrial. Isso precisa mudar.",
    author: "Pax Brasiliana",
    date: "08 Mai 2026",
    category: "cultura",
    image: "/images/hero.jpg",
  },
  {
    slug: "o-que-o-brasil-pode-construir",
    title: "O que o Brasil pode construir?",
    desc: "Um guia das capacidades produtivas brasileiras e onde estão as maiores oportunidades.",
    author: "Pax Brasiliana",
    date: "01 Mai 2026",
    category: "industria",
    image: "/images/hero.jpg",
  },
  {
    slug: "o-custo-do-cinismo",
    title: "O custo do cinismo",
    desc: "Pessimismo coletivo tem um preço econômico real. Mensurar esse custo é o primeiro passo.",
    author: "Pax Brasiliana",
    date: "24 Abr 2026",
    category: "cultura",
    image: "/images/hero.jpg",
  },
  {
    slug: "energia-abundante",
    title: "Energia abundante como estratégia nacional",
    desc: "O Brasil tem o maior potencial de energia renovável do mundo. Ainda não usamos esse trunfo.",
    author: "Pax Brasiliana",
    date: "17 Abr 2026",
    category: "industria",
    image: "/images/hero.jpg",
  },
  {
    slug: "empreender-no-brasil",
    title: "Empreender no Brasil: resistência, não vocação",
    desc: "Criar uma empresa no Brasil ainda exige mais coragem do que talento. Por que aceitamos isso?",
    author: "Pax Brasiliana",
    date: "10 Abr 2026",
    category: "cultura",
    image: "/images/hero.jpg",
  },
];

const categories = [
  { label: "TODOS", value: "todos" },
  { label: "INDÚSTRIA", value: "industria" },
  { label: "CULTURA", value: "cultura" },
];

const ArrowIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path
      d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
      fill="#F8F6E8"
    />
  </svg>
);

const DashedDivider = () => (
  <div
    style={{
      borderTop: "0.5px dashed",
      borderColor: "rgba(70,60,46,0.30)",
      borderImage:
        "repeating-linear-gradient(to right, rgba(70,60,46,0.30) 0px, rgba(70,60,46,0.30) 6px, transparent 6px, transparent 8px) 1",
    }}
  />
);

export default function EnsaiosPage() {
  useScrollReveal();
  const [filter, setFilter] = useState("todos");

  const filtered = essays.filter(
    (e) => filter === "todos" || e.category === filter
  );

  return (
    <>
      <Navbar />
      <main className="bg-[#F8F6E8]">
        {/* Featured Essay Card */}
        <section className="pt-28 pb-16 lg:pb-20">
          <Link
            href="/ensaios/o-brasil-que-pode-ser"
            className="block relative overflow-hidden h-[500px] mx-5 lg:mx-10 rounded-[6px] group"
          >
            <img
              src="/images/hero.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
            />
            <div className="relative z-[2] p-10 flex flex-col justify-between h-full">
              <div>
                <h2
                  className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#F8F6E8] font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  O Brasil que pode ser
                </h2>
                <p
                  className="text-[14px] uppercase text-[#F8F6E8] pl-5 mt-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    borderLeft: "1px solid #F45141",
                  }}
                >
                  ENSAIO EM DESTAQUE
                </p>
              </div>

              <div className="bg-[#F8F6E8] border border-[#463C2E] rounded-[6px] p-5 flex flex-col gap-5 max-w-[421px]">
                <div
                  className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#463C2E] font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  O Brasil que pode ser
                </div>
                <DashedDivider />
                <p
                  className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#463C2E]/40 font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Uma visão de um país que fabrica, exporta tecnologia e lidera
                  os setores do futuro. Por que não nós?
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="bg-[#c3be92] h-12 w-12 hidden lg:block flex-shrink-0" />
                    <div>
                      <p
                        className="text-[14px] text-[#463C2E] uppercase leading-[1.3] tracking-[-0.06em]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Pax Brasiliana
                      </p>
                      <p
                        className="text-[14px] text-[#463C2E]/40 uppercase leading-[1.3] tracking-[-0.06em]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        21 Maio 2026
                      </p>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-2 px-2.5 py-2.5 bg-[#417ce5] text-[#F8F6E8] text-[14px] tracking-[-0.06em] uppercase leading-none group-hover:opacity-80 transition-opacity flex-shrink-0"
                    style={{ fontFamily: "var(--font-mono)", borderRadius: 0 }}
                  >
                    LER ENSAIO
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Filter Tab Bar */}
        <div
          className="flex gap-10 overflow-x-auto px-5 lg:px-10 no-scrollbar"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`py-2.5 text-[14px] tracking-[-0.06em] uppercase cursor-pointer transition-colors duration-300 whitespace-nowrap bg-transparent border-none ${
                filter === cat.value
                  ? "text-[#463C2E]"
                  : "text-[#463C2E]/40 hover:text-[#463C2E]/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Essay Grid */}
        <section className="pt-6 pb-10 lg:pt-10 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[33.33%_33.33%_33.33%] gap-y-5 lg:gap-y-10">
            {filtered.map((essay, i) => (
              <div
                key={essay.slug}
                data-category={essay.category}
                className={`px-5 fade-in-up stagger-${Math.min(i + 1, 5)}`}
              >
                <Link
                  href={`/ensaios/${essay.slug}`}
                  className="block h-full"
                >
                  <div className="bg-[#E4DECC] border-[0.5px] border-[#463C2E] rounded-[6px] overflow-hidden h-full group">
                    <img
                      src={essay.image}
                      alt={essay.title}
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="p-5 flex flex-col gap-5">
                      <div>
                        <h3
                          className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#463C2E] font-bold"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {essay.title}
                        </h3>
                        <p
                          className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#463C2E]/40 mt-2.5 font-bold"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {essay.desc}
                        </p>
                      </div>
                      <DashedDivider />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="bg-[#c3be92] h-12 w-12 hidden lg:block flex-shrink-0" />
                          <div>
                            <p
                              className="text-[14px] text-[#463C2E] uppercase leading-[1.3] tracking-[-0.06em]"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {essay.author}
                            </p>
                            <p
                              className="text-[14px] text-[#463C2E]/40 uppercase leading-[1.3] tracking-[-0.06em]"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {essay.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className="inline-flex items-center gap-2 px-2.5 py-2.5 bg-[#417ce5] text-[#F8F6E8] text-[14px] tracking-[-0.06em] uppercase leading-none group-hover:opacity-80 transition-opacity flex-shrink-0"
                          style={{
                            fontFamily: "var(--font-mono)",
                            borderRadius: 0,
                          }}
                        >
                          LER ENSAIO
                          <ArrowIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Escreva para Nós */}
        <section className="pb-16 lg:pb-20 px-5 lg:px-10">
          <div className="bg-[#E4DECC] border-[0.5px] border-[#463C2E] rounded-[6px] overflow-hidden py-20 lg:py-[100px] flex flex-col items-center text-center relative">
            <img
              src="/images/hero.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 z-[1]"
            />
            <div className="relative z-[2] max-w-[600px] flex flex-col gap-5 px-5">
              <h2
                className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#463C2E] font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Quer escrever para a Pax Brasiliana?
              </h2>
              <p
                className="text-[24px] leading-[120%] tracking-[-0.48px] text-[#463C2E]/40 font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Queremos ouvir suas perspectivas sobre indústria, criatividade e
                o futuro do Brasil. Entre em contato para saber mais.
              </p>
              <div className="mt-10">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#463C2E] text-[#F8F6E8] text-[14px] tracking-[-0.06em] uppercase leading-none hover:opacity-80 transition-opacity"
                  style={{ fontFamily: "var(--font-mono)", borderRadius: 0 }}
                >
                  ENTRE EM CONTATO
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <JoinForm />
      </main>
      <Footer />
    </>
  );
}
