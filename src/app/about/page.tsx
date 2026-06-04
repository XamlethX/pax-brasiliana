"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";

const beliefs = [
  {
    title: "Inclinação para construir",
    desc: "O caminho difícil de fazer coisas concretas é melhor do que o caminho fácil de criticar quem tenta. Escolhemos a dificuldade.",
  },
  {
    title: "Indústria como destino",
    desc: "Exportar soja in natura quando poderíamos exportar satélites é uma escolha política, não um destino geográfico. Escolhas mudam.",
  },
  {
    title: "Capital produtivo, não rentista",
    desc: "Um real investido em fábrica cria empregos, tecnologia e exportações. Um real em título público cria juros. Sabemos qual preferir.",
  },
  {
    title: "Pensar em gerações",
    desc: "Ferrovias, usinas e universidades técnicas não rendem votos em quatro anos. Por isso a política não as constrói. Nós sim.",
  },
  {
    title: "Apartidário e focado em resultados",
    desc: "Não somos de esquerda nem de direita. Somos a favor de crescimento industrial, desburocratização e capacidade produtiva soberana.",
  },
  {
    title: "O Brasil merece beleza",
    desc: "Cidades, fábricas, produtos e infraestrutura podem e devem inspirar orgulho estético — não apenas funcional.",
  },
];

const faqs = [
  {
    q: "A Pax Brasiliana é um partido político?",
    a: "Não. Somos explicitamente apartidários. Trabalhamos com engenheiros, fundadores, pesquisadores e criadores de qualquer espectro político — o que nos une é a crença de que o Brasil precisa construir mais.",
  },
  {
    q: "O que distingue a Pax de outros movimentos?",
    a: "Foco em construção material, não apenas discurso. Nos importamos com fábricas, ferrovias, semicondutores e satélites — não com posicionamento ideológico. Se você fabrica coisas, você é um de nós.",
  },
  {
    q: "O que o movimento faz concretamente?",
    a: "Publicamos ensaios e análises, desenvolvemos ferramentas como o rastreador da B3 e o mapa de capacidade produtiva, organizamos encontros e conectamos pessoas que estão construindo o Brasil.",
  },
  {
    q: "Quem dirige o movimento?",
    a: "Um coletivo de voluntários com uma pequena equipe operacional. Somos construtores fazendo isso porque acreditamos — não porque é o caminho mais fácil.",
  },
  {
    q: "Como o movimento é financiado?",
    a: "Por meio de doações, vendas da loja e contribuições de apoiadores. 100% vai para as operações do movimento. Somos transparentes sobre o uso dos recursos.",
  },
  {
    q: "Como posso participar?",
    a: "Inscreva-se na página Participe, contribua com um ensaio, desenvolva um projeto ou simplesmente compartilhe o movimento com quem constrói o Brasil.",
  },
];

const sidebarItems = [
  { id: "about", label: "OBJETIVO" },
  { id: "beliefs", label: "CRENÇAS FUNDADORAS" },
  { id: "faqs", label: "PERGUNTAS FREQUENTES" },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("about");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sidebarItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      sectionRefs.current[id] = el;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Hero — 476px, 2-column layout, bg-black/50 overlay */}
        <section
          className="grid-lines relative lg:h-[476px] pt-[120px] pb-16 lg:pt-0 lg:pb-0"
          style={{ "--grid-line-color": "#F8F6E880" } as React.CSSProperties}
        >
          <img
            src="/images/cidade-futura.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="media-overlay z-0" aria-hidden="true" />
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 z-[1] relative h-full text-mist">
            {/* Column 1: Title */}
            <div className="lg:w-1/3 flex items-center lg:h-full pl-5 lg:pl-10 pr-5 lg:pr-5">
              <h1 className="text-h3 text-left font-heading">
                O que é a<br />Pax Brasiliana?
              </h1>
            </div>
            {/* Column 2: Description */}
            <div className="lg:w-1/3 flex items-center lg:h-full justify-center px-5">
              <p className="text-paragraphs">
                A Pax Brasiliana é um movimento para reacender a indústria brasileira, a criatividade e a ambição. Acreditamos no trabalho duro de construir coisas — e na coragem de agir quando é mais fácil não fazer nada.
              </p>
            </div>
          </div>
        </section>

        {/* Content area: Sidebar (1/3) + Main (2/3) */}
        <div className="grid-lines bg-mist relative flex flex-col lg:flex-row">
          {/* Sticky Sidebar — desktop only */}
          <aside className="hidden lg:block lg:w-1/3 border-t-[0.5px] border-t-bark/40">
            <nav
              id="sidebar-nav"
              className="sticky top-0 pl-2.5 lg:pl-5 flex flex-col pt-16 lg:py-20"
            >
              {sidebarItems.map((item) => (
                <a
                  key={item.id}
                  data-section={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`sidebar-nav-item py-[9px] pl-5 text-accents uppercase font-mono border-l-[1px] transition-colors duration-300 ${
                    activeSection === item.id
                      ? "border-clay text-bark"
                      : "border-transparent text-bark/40"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content column */}
          <div className="w-full lg:w-2/3">
            {/* Section: Objetivo — Vision + Goal 2×50% */}
            <section
              id="about"
              className="scroll-mt-20 flex flex-col lg:flex-row py-10 gap-10 lg:gap-0 lg:py-20 border-t-[0.5px] border-t-bark/40"
            >
              <div className="lg:w-1/2 flex flex-col gap-10 px-5">
                <div className="text-paragraphs font-heading text-bark">Nossa visão</div>
                <span className="text-paragraphs text-bark">
                  O Brasil tem o maior potencial de energia solar do planeta, a maior reserva de água doce, o maior território cultivável e uma população jovem e criativa. Ainda assim, exportamos commodities e importamos o que poderíamos fabricar. Isso acaba agora.
                </span>
              </div>
              <div className="lg:w-1/2 flex flex-col gap-10 px-5 lg:pr-10">
                <div className="text-paragraphs font-heading text-bark">Nosso objetivo</div>
                <div className="text-paragraphs text-bark flex flex-col gap-5">
                  <p>A Pax Brasiliana existe para mudar a conversa — de &ldquo;por que o Brasil não funciona&rdquo; para &ldquo;o que o Brasil pode construir&rdquo;. Nosso foco é prático:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Produzir pesquisa e análise sobre capacidade industrial brasileira</li>
                    <li>Conectar pessoas que constroem coisas reais</li>
                    <li>Celebrar e amplificar construtores, fundadores e criadores</li>
                    <li>Pressionar pela reindustrialização como agenda nacional</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section: Crenças Fundadoras — bg image + 2-col grid of cards */}
            <section id="beliefs" className="relative scroll-mt-20">
              <img
                src="/images/usina-nuclear.png"
                alt=""
                className="absolute object-cover h-full w-full inset-0 px-2.5 lg:pr-5 lg:pl-0 z-0"
              />
              <h3 className="text-accents uppercase text-mist px-[30px] lg:px-10 font-mono z-10 relative pt-10">
                CRENÇAS FUNDADORAS
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-y-5 relative z-10 px-[30px] lg:px-10 pb-10 lg:pb-20 pt-5">
                {beliefs.map((b, i) => (
                  <div
                    key={b.title}
                    className={`flex flex-col gap-5 bg-mist border-[0.5px] border-bark rounded-[6px] p-5 min-h-[220px] ${i % 2 === 0 ? "lg:mr-2.5" : "lg:ml-2.5"}`}
                  >
                    <div className="text-paragraphs text-bark">
                      {b.title}
                    </div>
                    <div
                      className="w-full"
                      style={{ height: "0.5px", borderTop: "0.5px dashed rgba(70,60,46,0.3)" }}
                    />
                    <p className="text-paragraphs text-bark/60">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Perguntas Frequentes */}
            <section
              id="faqs"
              className="scroll-mt-20 flex flex-col gap-10 pb-10 lg:pb-20 pt-16 lg:pt-20 border-t-[0.5px] border-t-bark/40"
            >
              {/* Mobile section label */}
              <div className="pl-2.5 lg:hidden">
                <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5">
                  Perguntas Frequentes
                </div>
              </div>

              {/* Desktop heading */}
              <div className="w-full lg:w-1/2 px-5 lg:pr-10">
                <div className="text-paragraphs text-bark font-heading">
                  Perguntas Frequentes
                </div>
              </div>

              <div className="relative z-10 px-5 lg:pr-10 flex flex-col gap-2.5 lg:gap-5">
                {faqs.map((faq, i) => (
                  <div
                    key={faq.q}
                    className="border-[0.5px] border-bark bg-sand rounded-[6px] px-5 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex justify-between w-full text-accents uppercase py-5 lg:py-6 gap-6 items-center cursor-pointer text-left text-bark font-mono"
                    >
                      <span>{faq.q}</span>
                      <svg
                        className={`transition-transform duration-300 flex-shrink-0 w-4 h-4 ${openFaq === i ? "rotate-45" : ""}`}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <div
                      className="grid transition-all duration-300"
                      style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="text-paragraphs text-bark pb-5 lg:pb-6">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
