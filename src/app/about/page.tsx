"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";

const beliefs = [
  {
    title: "Viés para Construir",
    desc: "Pessimismo é fácil e abundante. Construir é difícil. Nós escolhemos o difícil.",
  },
  {
    title: "Menos rent-seeking, mais risco",
    desc: "Apoiamos quem cria valor, não quem o extrai. Rejeitamos a cultura do cartório e defendemos quem aposta em si mesmo e nos seus.",
  },
  {
    title: "Restaurar o Orgulho de Fazer",
    desc: "A capacidade de construir grandes coisas está sendo enterrada sob burocracia e descrença. Precisamos ressuscitá-la como princípio nacional.",
  },
  {
    title: "Sonhar na escala do Brasil",
    desc: "Não deixamos os sem imaginação controlarem a narrativa. Inspiramos brasileiros a sonhar na medida do país que temos, e apoiamos uns aos outros em empreitadas arriscadas.",
  },
  {
    title: "Construtores, não espectadores",
    desc: "O Brasil real é construído por quem age, não por quem espera a solução política chegar.",
  },
  {
    title: "Brasileiro e orgulhoso",
    desc: "O complexo de vira-lata corroeu nossa autoestima como nação. Precisamos restaurar a coesão nacional por meio de transparência, otimismo e ambição.",
  },
];

const faqs: { q: string; a: string; cta?: { label: string; href: string } }[] = [
  {
    q: "A Pax Brasiliana é um partido político?",
    a: "A Pax Brasiliana é explicitamente apartidária. Somos um movimento independente, sem fins lucrativos, e zelamos pela nossa independência política e editorial. Nosso compromisso é com o desenvolvimento do Brasil, não com partidos, governos ou ideologias específicas.",
  },
  {
    q: "Como são usadas as doações?",
    a: "A Pax Brasiliana é uma organização sem fins lucrativos registrada. 100% das doações nos ajudam a construir e manter o movimento, desde infraestrutura digital até atividades comunitárias, operações e muito mais.\n\nConforme a Pax Brasiliana cresce, seremos transparentes sobre como o apoio é utilizado e direcionaremos recursos para trabalhos que expandem nosso impacto e ajudam mais brasileiros a se envolver.",
    cta: { label: "Fazer uma doação", href: "/doar" },
  },
  {
    q: "O que a Pax Brasiliana faz?",
    a: "A Pax Brasiliana está no início de sua jornada. Vamos organizar eventos, publicar ensaios e conteúdo, empoderar construtores, e lançar nossos próprios projetos e iniciativas. Inscreva-se na nossa newsletter para atualizações ou nos diga se tem interesse em se envolver.",
  },
  {
    q: "Quem está por trás do projeto?",
    a: "A Pax Brasiliana é um coletivo de voluntários apaixonados e apoiadores, com um pequeno time guiando sua direção.",
  },
  {
    q: "Como vocês são financiados?",
    a: "A Pax Brasiliana é financiada por doações, merchandising, e apoiadores que exibem com orgulho a bandeira da Pax Brasiliana. Se você quer nos apoiar, doe aqui ou visite nossa loja.",
    cta: { label: "Doar agora", href: "/doar" },
  },
  {
    q: "Qual é o objetivo de vocês?",
    a: "Nossos objetivos iniciais são plantar uma bandeira em torno dessa mudança de mentalidade necessária, e conseguir que brasileiros discutam aberta e sinceramente a necessidade de construir. Essa construção deve tomar muitas formas - precisamos de mais pessoas começando empresas, restaurando o orgulho nacional, e defendendo ações que levem a mudança estrutural.",
  },
  {
    q: "Como entro no movimento?",
    a: "Qualquer um que queira fazer parte da Pax Brasiliana é bem-vindo. Reconhecemos que patriotismo tem significados diferentes para cada brasileiro, mas somos otimistas que podemos construir um país mais unido e capaz, juntos.\n\nVamos organizar uma ampla gama de atividades, muitas das quais apresentarão oportunidades para pessoas de todas as habilidades e origens se envolver diretamente.\n\nPor favor, preencha nosso formulário para se manter atualizado sobre todas as oportunidades relevantes para se envolver. Siga-nos no LinkedIn, X, Instagram.",
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
              <p className="text-paragraphs text-[16px] lg:text-[18px] leading-[150%]">
                A Pax Brasiliana é um movimento e uma mudança de mentalidade para tirar o país da estagnação. Nossa missão é reacender a indústria, a criatividade e a ambição brasileiras. Buscamos fortalecer a confiança de quem constrói o país, empreendedores, engenheiros, cientistas, trabalhadores, criadores e inovadores, enquanto defendemos um Brasil onde a inovação, o empreendedorismo e o progresso possam florescer.
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
                  className={`sidebar-nav-item py-[9px] pl-5 text-accents uppercase font-mono border-l-[1px] transition-colors duration-300 ease-out ${
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
                  O novo sonho brasileiro precisa ser maior: um país que cria e fabrica, que exporta ideias e inovação — não apenas commodities —, que constrói empresas, tecnologias e uma cultura admirada pelo mundo, e que deixa para as próximas gerações um legado de prosperidade ainda maior.
                </span>
              </div>
              <div className="lg:w-1/2 flex flex-col gap-10 px-5 lg:pr-10">
                <div className="text-paragraphs font-heading text-bark">Nosso objetivo</div>
                <div className="text-paragraphs text-bark flex flex-col gap-5">
                  <p>Reconhecemos que nosso motor de crescimento travou, e nossa cultura está dividida. Nossos objetivos são que o Brasil:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Alcance 10% de crescimento real do PIB per capita até 2035</li>
                    <li>Reverta a fuga de cérebros</li>
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
                        className={`transition-transform duration-300 ease-out flex-shrink-0 w-4 h-4 ${openFaq === i ? "rotate-45" : ""}`}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <div
                      className="grid transition-all duration-300 ease-out"
                      style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="text-paragraphs text-bark pb-5 lg:pb-6 whitespace-pre-line">
                          {faq.a}
                        </p>
                        {faq.cta && (
                          <Link
                            href={faq.cta.href}
                            className="inline-flex items-center gap-2 text-accents uppercase font-mono text-clay pb-5 lg:pb-6 link-underline transition-opacity duration-300 ease-out hover:opacity-60"
                          >
                            {faq.cta.label}
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                              <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="currentColor" />
                            </svg>
                          </Link>
                        )}
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
