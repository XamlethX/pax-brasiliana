"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import Link from "next/link";
import { ensaios, ensaioCategorias } from "@/data/ensaios";

const featured = ensaios[0];
const rest = ensaios.slice(1);

const ArrowIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
    <path
      d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z"
      fill="currentColor"
    />
  </svg>
);

const DashedDivider = () => (
  <div
    style={{
      borderTop: "0.5px dashed",
      borderColor: "#463C2E4D",
      borderImage:
        "repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1",
    }}
  />
);

export default function EssaysPage() {
  useScrollReveal();
  const [filter, setFilter] = useState("todos");

  const filtered = rest.filter(
    (e) => filter === "todos" || e.category === filter
  );

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1 bg-mist">
        {/* Featured Essay Hero */}
        <section className="grid-lines relative pt-10 lg:pt-20">
          <Link
            href={`/ensaios/${featured.slug}`}
            className="mx-5 lg:mx-10 rounded-[6px] overflow-hidden h-[500px] relative mb-16 lg:mb-20 block group"
          >
            <img
              src={featured.image}
              alt={`Ensaio em destaque: ${featured.title}`}
              className="absolute inset-0 w-full h-full object-cover z-[2] transition-transform duration-[400ms] group-hover:scale-[1.02]"
            />
            <div className="media-overlay z-[2]" aria-hidden="true" />
            <div className="z-[3] relative p-2.5 lg:p-5 lg:pt-10 flex flex-col justify-between h-full">
              <div className="flex flex-col gap-2">
                <div className="text-paragraphs text-mist">{featured.title}</div>
                <div className="pl-5 border-l border-l-clay font-mono text-accents text-mist uppercase">
                  Ensaio em destaque
                </div>
              </div>
              <div className="bg-mist rounded-[6px] p-5 border border-bark flex flex-col gap-5 max-w-[421px]">
                <div>
                  <div className="text-paragraphs text-bark">{featured.title}</div>
                  <div className="text-paragraphs text-bark/40 mt-2.5">
                    {featured.desc}
                  </div>
                </div>
                <DashedDivider />
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="bg-khaki h-12 w-12 rounded-[2px] hidden lg:block" />
                    <div>
                      <div className="text-accents font-mono text-bark uppercase">
                        {featured.author}
                      </div>
                      <div className="text-accents font-mono text-bark/40 uppercase">
                        {featured.date}
                      </div>
                    </div>
                  </div>
                  <span
                    className="uppercase font-mono leading-none flex gap-2 px-2.5 py-2.5 items-center transition-all hover:opacity-80 text-accents text-mist bg-coast"
                  >
                    LER ENSAIO
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Essay Grid with Filter — só quando há ensaios além do destacado */}
        {rest.length > 0 && (
        <section className="grid-lines relative">
          {/* Filter Tabs */}
          <div className="flex gap-10 overflow-x-auto px-5 lg:px-10 no-scrollbar border-b border-b-bark/10">
            {ensaioCategorias.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                aria-pressed={filter === cat.value}
                className={`py-2.5 font-mono text-accents uppercase cursor-pointer transition-colors duration-300 whitespace-nowrap bg-transparent border-none ${
                  filter === cat.value
                    ? "text-bark"
                    : "text-bark/40 hover:text-bark/70"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="px-5 lg:px-10 py-20 text-center">
              <p className="text-paragraphs text-bark/50">
                Nenhum ensaio nesta categoria ainda. Em breve.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-5 lg:gap-y-10 lg:grid-cols-[33.33%_33.33%_33.33%] pt-6 pb-10 lg:pt-10 lg:pb-20">
              {filtered.map((essay, i) => (
                <div
                  key={essay.slug}
                  className={`px-5 essay-card fade-in-up stagger-${Math.min(i + 1, 5)}`}
                  data-filter={essay.category}
                  data-tags={essay.category}
                >
                  <Link href={`/ensaios/${essay.slug}`} className="block h-full">
                    <div className="bg-sand border-[0.5px] border-bark rounded-[6px] overflow-clip h-full group">
                      <img
                        src={essay.image}
                        alt={essay.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-[200px] object-cover"
                      />
                      <div className="p-5 flex flex-col gap-5">
                        <div>
                          <div className="text-paragraphs text-bark">
                            {essay.title}
                          </div>
                          <div className="text-paragraphs text-bark/40 mt-2.5">
                            {essay.desc}
                          </div>
                        </div>
                        <DashedDivider />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <div className="bg-khaki h-12 w-12 rounded-[2px] hidden lg:block flex-shrink-0" />
                            <div>
                              <div className="text-accents font-mono text-bark uppercase">
                                {essay.author}
                              </div>
                              <div className="text-accents font-mono text-bark/40 uppercase">
                                {essay.date}
                              </div>
                            </div>
                          </div>
                          <span
                            className="uppercase font-mono leading-none flex gap-2 px-2.5 py-2.5 items-center transition-all hover:opacity-80 text-accents text-mist bg-coast flex-shrink-0"
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
          )}
        </section>
        )}

        {/* Escrever para Pax Brasiliana CTA */}
        <section className="grid-lines relative pb-16 lg:pb-20">
          <div className="px-5 lg:px-10">
            <div className="relative px-5 flex flex-col items-center justify-center py-20 lg:py-[100px] rounded-[6px] border-[0.5px] border-bark bg-sand">
              <img
                src="/images/pattern-bg.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full z-[1] object-cover"
              />
              <div className="flex flex-col gap-5 z-[2] text-center max-w-[600px]">
                <div className="text-paragraphs text-bark">
                  Quer escrever para a Pax Brasiliana?
                </div>
                <div className="text-paragraphs text-bark/40">
                  Adoraríamos ouvir suas perspectivas.
                </div>
              </div>
              <Link href="/contribute" className="z-[2] mt-10">
                <span
                  className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center transition-all duration-300 hover:opacity-80 text-accents text-mist bg-bark"
                >
                  ENTRE EM CONTATO
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
