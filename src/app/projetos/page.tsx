"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import Link from "next/link";

const tags = ["TODOS", "DADOS", "INTERATIVO"];

const projetos = [
  {
    slug: "o-que-o-brasil-pode-construir",
    title: "O que o Brasil pode construir?",
    tag: "INTERATIVO",
    desc: "Uma base pesquisável de produtos fabricados no Brasil, manufaturas nacionais e lacunas produtivas. Visibilidade para quem já constrói — e inspiração para quem quer começar.",
    features: [
      "Busca por produto ou fabricante",
      "Base de manufatura brasileira mapeada",
      "Status de produção nacional por categoria",
    ],
    image: "/images/hero.jpg",
  },
  {
    slug: "rastreador-b3",
    title: "Rastreador B3",
    tag: "DADOS",
    desc: "Acompanhamento de 50 empresas listadas na B3 que operam em defesa, manufatura, energia, agtech, tecnologia, saúde e infraestrutura.",
    features: [
      "Preços e variações do dia",
      "Sparklines de tendência de 30 dias",
      "Filtro por setor e busca por ticker",
    ],
    image: "/images/hero.jpg",
  },
];

export default function ProjetosPage() {
  useScrollReveal();
  const [activeTag, setActiveTag] = useState("TODOS");

  const filtered =
    activeTag === "TODOS"
      ? projetos
      : projetos.filter((p) => p.tag === activeTag);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          title="Projetos"
          description="Dados, análises e ferramentas interativas para entender e fortalecer a capacidade produtiva brasileira."
          image="/images/hero.jpg"
        />

        <section className="bg-[#F8F6E8] py-20 px-5 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            {/* Tag filters */}
            <div className="flex gap-8 mb-10 border-b-[0.5px] border-b-[#463C2E]/30 overflow-x-auto no-scrollbar" style={{ fontFamily: "var(--font-mono)" }}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`py-2.5 text-accents cursor-pointer transition-colors duration-300 whitespace-nowrap ${
                    activeTag === tag
                      ? "text-[#463C2E]"
                      : "text-[#463C2E]/40 hover:text-[#463C2E]/70"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((project, i) => (
                <Link
                  key={project.slug}
                  href={`/projetos/${project.slug}`}
                  className={`group fade-in-up stagger-${i + 1} flex flex-col`}
                >
                  <div className="border-[0.5px] border-[#463C2E] bg-[#E4DECC] overflow-hidden flex flex-col flex-1 transition-all duration-200 hover:shadow-sm">
                    <div className="h-[200px] bg-[#d8d0bc] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <p className="text-accents text-[#463C2E]/50">{project.tag}</p>
                      <h2 className="text-paragraphs text-[#463C2E] font-heading">
                        {project.title}
                      </h2>
                      <p className="text-[14px] lg:text-[16px] text-[#463C2E]/70 leading-[140%]">
                        {project.desc}
                      </p>
                      <ul className="flex flex-col gap-1.5 mt-2">
                        {project.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-[12px] text-[#463C2E]/50"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <span className="w-1 h-1 bg-[#463C2E]/40 rounded-full flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-5 border-t border-dashed-custom">
                        <span className="inline-flex items-center justify-between w-full bg-[#463C2E] text-[#F8F6E8] text-accents px-3 py-2.5 transition-opacity duration-300 group-hover:opacity-80">
                          EXPLORAR PROJETO
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="#F0E8D8" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Coming soon */}
              <div className="border-[0.5px] border-[#463C2E] bg-[#E4DECC] overflow-hidden flex flex-col items-center justify-center p-10 min-h-[300px] fade-in-up stagger-3">
                <p className="text-accents text-[#463C2E]/50">
                  MAIS PROJETOS EM BREVE
                </p>
              </div>

              {/* Contribute CTA */}
              <Link
                href="/contribute"
                className="group border-[0.5px] border-[#463C2E] bg-[#E4DECC] overflow-hidden flex flex-col items-start justify-center p-10 min-h-[300px] fade-in-up stagger-3"
              >
                <p className="text-accents text-[#463C2E]/50 mb-4">CONTRIBUA</p>
                <h3 className="font-heading text-[20px] lg:text-[24px] text-[#463C2E] leading-[120%] tracking-[-0.02em]">
                  Tem uma ideia de projeto?
                </h3>
                <p className="text-[14px] lg:text-[16px] text-[#463C2E]/70 leading-[140%] mt-3 max-w-sm">
                  Estamos sempre procurando construtores que queiram contribuir com dados, código ou ideias.
                </p>
                <span className="inline-flex items-center gap-2 text-accents text-[#463C2E]/50 mt-6 transition-opacity duration-300 group-hover:opacity-60 link-underline pb-1">
                  ENTRE EM CONTATO
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
