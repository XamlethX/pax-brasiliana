"use client";

import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";

const beliefs = [
  {
    title: "Inclinação para Construir",
    desc: "Escolhemos a dificuldade em vez do pessimismo. O caminho difícil de fazer coisas é melhor do que o caminho fácil de reclamar delas.",
  },
  {
    title: "Menos rentismo, mais empreendedorismo",
    desc: "Valorizamos a criação acima da extração. Construir coisas reais que importam mais do que engenharia financeira.",
  },
  {
    title: "Restaurar a Oportunidade Justa",
    desc: "Reviver o princípio igualitário de que todos merecem uma chance. Não por meio de esmolas, mas por meio de oportunidade.",
  },
  {
    title: "Sonhar mais alto",
    desc: "Rejeitamos a narrativa de que nossos melhores dias ficaram para trás. O futuro é construído por aqueles que se recusam a aceitar limitações.",
  },
  {
    title: "Nem Esquerda nem Direita, mas para frente",
    desc: "Somos apartidários e focados em resultados. Boas ideias não pertencem a nenhum partido político.",
  },
  {
    title: "O Brasil merece beleza",
    desc: "O que construímos deve ser bonito. Cidades, fábricas, produtos e infraestrutura podem e devem inspirar orgulho estético.",
  },
];

const faqs = [
  {
    q: "A Pax Brasiliana é um partido político?",
    a: "Não. Somos explicitamente apartidários. Trabalhamos com qualquer pessoa que queira construir, independentemente de filiação política.",
  },
  {
    q: "Como as doações são utilizadas?",
    a: "100% das doações apoiam as operações do movimento — eventos, pesquisa, projetos e construção de comunidade.",
  },
  {
    q: "O que o movimento faz?",
    a: "Organizamos eventos, publicamos ensaios, desenvolvemos projetos e criamos ferramentas que apoiam construtores em todo o país.",
  },
  {
    q: "Quem dirige o movimento?",
    a: "Um coletivo de voluntários com uma pequena equipe operacional. Nós mesmos somos construtores, fazendo isso porque acreditamos.",
  },
  {
    q: "Como o movimento é financiado?",
    a: "Por meio de doações, vendas de produtos e contribuições de apoiadores. Somos transparentes sobre como os recursos são utilizados.",
  },
  {
    q: "Como posso participar?",
    a: "O movimento é aberto a todos. Participe pela página Participe, compareça a eventos, contribua com ensaios ou desenvolva projetos.",
  },
];

const sidebarItems = [
  { id: "about", label: "OBJETIVO" },
  { id: "beliefs", label: "CRENÇAS FUNDADORAS" },
  { id: "faqs", label: "PERGUNTAS FREQUENTES" },
];

export default function AboutPage() {
  useScrollReveal();
  const [activeSection, setActiveSection] = useState("about");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero — 476px, 3-column, bg-black/50 */}
        <section className="relative lg:h-[476px] pt-[120px] pb-16 lg:pt-0 lg:pb-0">
          <img
            src="/images/hero.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 z-[1] relative h-full text-[#F8F6E8]">
            <div className="lg:w-1/3 flex items-center lg:h-full pl-5 lg:pl-10 pr-5">
              <h1
                className="text-h3"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
              >
                O que é a<br />Pax Brasiliana?
              </h1>
            </div>
            <div className="lg:w-1/3 flex items-center lg:h-full justify-center px-5">
              <img
                src="/images/logo-light.png"
                alt="Pax Brasiliana"
                className="object-contain w-[73px] h-auto border-l-[3px] border-l-[#E4DECC]"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
              />
            </div>
            <div className="lg:w-1/3 flex items-center lg:h-full px-5 lg:pr-10">
              <p className="text-paragraphs text-[#F8F6E8]">
                A Pax Brasiliana é um movimento para reacender a indústria brasileira, a criatividade e a ambição. Acreditamos no trabalho duro de construir coisas — e na coragem de agir quando é mais fácil não fazer nada.
              </p>
            </div>
          </div>
        </section>

        {/* Sidebar (1/3) + Content (2/3) */}
        <div className="flex flex-col lg:flex-row">
          {/* Sticky Sidebar — desktop only */}
          <aside className="hidden lg:block lg:w-1/3 border-t-[0.5px] border-t-[#463C2E]/40">
            <nav className="sticky top-0 pl-5 flex flex-col py-20">
              {sidebarItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`py-[9px] pl-5 text-accents uppercase transition-colors duration-300 border-l-[1px] ${
                    activeSection === item.id
                      ? "border-[#F45141] text-[#463C2E]"
                      : "border-transparent text-[#463C2E]/40"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content column */}
          <div className="lg:w-2/3">
            {/* Goal — Vision + Goal 2×50% */}
            <section
              id="about"
              data-section
              className="scroll-mt-20 flex flex-col lg:flex-row py-10 gap-10 lg:gap-0 lg:py-20 border-t-[0.5px] border-t-[#463C2E]/40"
            >
              <div className="lg:w-1/2 flex flex-col gap-10 px-5">
                <span
                  className="text-paragraphs text-[#463C2E]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Nossa visão
                </span>
                <span className="text-paragraphs text-[#463C2E]">
                  O novo sonho brasileiro deve ser maior. Podemos construir empresas que exportam para o mundo inteiro, infraestrutura que transforma o território e uma cultura que inspira ambição produtiva ao invés de conformismo.
                </span>
              </div>
              <div className="lg:w-1/2 flex flex-col gap-10 px-5 lg:pr-10">
                <span
                  className="text-paragraphs text-[#463C2E]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Nosso objetivo
                </span>
                <div className="text-paragraphs flex flex-col gap-5 text-[#463C2E]">
                  <p>Reconhecemos que nosso objetivo é ambicioso, mas alcançável. Para o Brasil prosperar, acreditamos que precisamos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Alcançar 5% de crescimento real do PIB per capita</li>
                    <li>Aumentar a criação de novos negócios industriais</li>
                    <li>Restaurar a capacidade manufatureira soberana</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Founding Beliefs — bg image + 2-col grid of cards */}
            <section id="beliefs" data-section className="relative scroll-mt-20">
              <img
                src="/images/hero.jpg"
                alt=""
                className="absolute object-cover h-full w-full inset-0 px-2.5 lg:pr-5 lg:pl-0 z-0"
              />
              <h3
                className="text-accents uppercase text-[#F8F6E8] px-[30px] lg:px-10 relative z-10 pt-10 pb-5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                CRENÇAS FUNDADORAS
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10 px-[30px] lg:px-10 pb-10 lg:pb-20">
                {beliefs.map((b, i) => (
                  <div
                    key={b.title}
                    className={`flex flex-col gap-5 bg-[#F8F6E8] border-[0.5px] border-[#463C2E] rounded-[6px] text-[#463C2E] p-5 min-h-[220px] fade-in-up stagger-${Math.min(i + 1, 5)}`}
                  >
                    <div
                      className="text-paragraphs text-[#463C2E]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {b.title}
                    </div>
                    <div
                      className="w-full"
                      style={{ height: "0.5px", borderTop: "0.5px dashed rgba(70,60,46,0.3)" }}
                    />
                    <p className="text-paragraphs text-[#463C2E]/60">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Accordion */}
            <section
              id="faqs"
              data-section
              className="scroll-mt-20 flex flex-col gap-10 pb-10 lg:pb-20 pt-16 lg:pt-20 border-t-[0.5px] border-t-[#463C2E]/40 px-5 lg:px-10"
            >
              <h3
                className="text-paragraphs text-[#463C2E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Perguntas Frequentes
              </h3>
              <div className="flex flex-col gap-2.5 lg:gap-5">
                {faqs.map((faq, i) => (
                  <div
                    key={faq.q}
                    className="border-[0.5px] border-[#463C2E] bg-[#E4DECC] rounded-[6px] px-5 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex justify-between w-full text-accents uppercase py-5 lg:py-6 gap-6 items-center cursor-pointer text-left text-[#463C2E]"
                      style={{ fontFamily: "var(--font-mono)" }}
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
                        <p className="text-paragraphs text-[#463C2E] pb-5 lg:pb-6">
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
    </>
  );
}
