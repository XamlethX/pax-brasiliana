"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import Link from "next/link";

const projetos = [
  {
    slug: "cadeia-produtiva-brasileira",
    title: "Cadeia Produtiva Brasileira",
    desc: "Índice aberto de fabricantes e industriais brasileiros por categoria, localização e capacidade produtiva. Mapa interativo, diretório por setor e taxonomia de toda a cadeia industrial.",
    features: [
      "Mapa interativo com pins por fabricante",
      "Diretório por tier industrial (S→E)",
      "Busca por empresa, produto ou cidade",
      "Filtro por estado e setor",
    ],
    image: "/images/laboratorio-robos.png",
  },
  {
    slug: "o-que-o-brasil-pode-construir",
    title: "O que o Brasil pode construir?",
    desc: "Uma base pesquisável de produtos fabricados no Brasil, manufaturas nacionais e lacunas produtivas. Visibilidade para quem já constrói — e inspiração para quem quer começar.",
    features: [
      "Busca por produto ou fabricante",
      "Base de manufatura brasileira mapeada",
      "Status de produção nacional por categoria",
    ],
    image: "/images/usina-nuclear.png",
  },
  {
    slug: "rastreador-b3",
    title: "Rastreador B3",
    desc: "Acompanhamento de empresas listadas na B3 que operam em defesa, manufatura, energia, agtech, tecnologia, saúde e infraestrutura. Dados simulados para demonstração.",
    features: [
      "Preços e variações do dia",
      "Sparklines de tendência de preço",
      "Filtro por setor e busca por ticker",
    ],
    image: "/images/estacao-trem.png",
  },
];

export default function ProjetosPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section
          className="grid-lines relative lg:h-[476px] pt-[120px] pb-16 lg:pt-0 lg:pb-0"
          style={{ "--grid-line-color": "#F8F6E880" } as React.CSSProperties}
        >
          <img
            src="/images/civic-plaza.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="media-overlay z-0" aria-hidden="true" />
          {/* Uniform tint: this hero centers its text vertically, where the
              gradient media-overlay is weakest — keeps it legible over the
              bright midsection of the photo. */}
          <div className="absolute inset-0 z-0 bg-[#463C2E]/45" aria-hidden="true" />
          <div
            className="flex flex-col lg:flex-row gap-10 lg:gap-0 z-[1] relative h-full text-mist"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.45)" }}
          >
            <div className="lg:w-1/3 flex items-center lg:h-full pl-5 lg:pl-10 pr-5 lg:pr-5">
              <h1 className="text-h3 text-left font-heading">
                Projetos
              </h1>
            </div>
            <div className="lg:w-1/3 flex items-center lg:h-full justify-center px-5">
              <p className="text-paragraphs">
                Dados, análises e ferramentas interativas para entender e fortalecer a capacidade produtiva brasileira.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section
          className="grid-lines py-20 relative bg-mist"
          style={{ "--grid-line-color": "#463C2E4D" } as React.CSSProperties}
        >
          <div className="grid grid-cols-1 gap-y-5 lg:gap-y-10 lg:grid-cols-[33.33%_33.33%_33.33%] lg:auto-rows-[1fr]">
            {projetos.map((project) => (
              <div key={project.slug} className="px-5">
                <div className="bg-sand p-5 flex flex-col gap-10 rounded-[6px] border-[0.5px] border-bark h-full">
                  <div className="flex flex-col gap-5">
                    <div className="text-paragraphs text-bark">
                      {project.title}
                    </div>
                    <div className="text-paragraphs text-bark/40">
                      {project.desc}
                    </div>
                  </div>
                  <div className="rounded-[4px] overflow-hidden aspect-[1200/630] bg-mist">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="font-mono uppercase text-accents">
                      Features:
                    </div>
                    {project.features.map((f) => (
                      <div
                        key={f}
                        className="font-mono uppercase text-accents text-bark/40 pb-5"
                        style={{
                          borderBottom: "0.5px solid",
                          borderImage:
                            "repeating-linear-gradient(to right, #463C2E 0px, #463C2E 2px, transparent 2px, transparent 4px) 1",
                        }}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/projetos/${project.slug}`}
                    className="mt-auto uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center transition-all duration-300 hover:opacity-80 text-accents text-mist bg-bark w-full justify-between"
                  >
                    <span>Explorar projeto</span>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                      <path d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z" fill="#F8F6E8" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}

            {/* More Projects Coming Soon */}
            <div className="px-5">
              <div className="relative p-5 flex items-center justify-center py-[100px] rounded-[6px] border-[0.5px] border-bark h-full">
                <img
                  src="/images/pattern-bg.png"
                  alt=""
                  className="absolute inset-0 w-full h-full"
                  style={{ zIndex: 1 }}
                />
                <div className="flex flex-col gap-5 text-center" style={{ zIndex: 2, position: "relative" }}>
                  <div className="text-paragraphs text-bark">
                    Mais Projetos em Breve
                  </div>
                  <div className="text-paragraphs text-bark/40">
                    Estamos trabalhando em novas ferramentas de análise de dados e visualizações interativas.
                  </div>
                </div>
              </div>
            </div>

            {/* Have a Project Idea? */}
            <div className="px-5">
              <div className="relative px-5 flex flex-col items-center justify-center py-20 lg:py-[100px] rounded-[6px] border-[0.5px] border-bark h-full">
                <img
                  src="/images/pattern-bg.png"
                  alt=""
                  className="absolute inset-0 w-full h-full"
                  style={{ zIndex: 1 }}
                />
                <div className="flex flex-col gap-5 text-center" style={{ zIndex: 2, position: "relative" }}>
                  <div className="text-paragraphs text-bark">
                    Tem uma ideia de projeto?
                  </div>
                  <div className="text-paragraphs text-bark/40">
                    Estamos sempre procurando construtores que queiram contribuir com dados, código ou ideias.
                  </div>
                </div>
                <Link
                  href="/contribute"
                  className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center transition-all duration-300 hover:opacity-80 text-accents text-mist bg-bark mt-10 w-full lg:w-auto lg:absolute lg:bottom-5 lg:left-5 lg:right-5 justify-between"
                  style={{ zIndex: 2, position: "relative" }}
                >
                  <span>ENTRE EM CONTATO</span>
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                    <path d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z" fill="#F8F6E8" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
