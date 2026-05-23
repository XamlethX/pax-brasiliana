"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-[100dvh] bg-[#463C2E] text-[#F8F6E8] overflow-hidden noise-overlay grid-lines">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Imagem de fundo"
          className="w-full h-full object-cover origin-center ken-burns"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 w-full mb-8 px-5 lg:px-10">
        <h1 className="text-h1 fade-in-up" style={{ textWrap: "balance" }}>
          Pax<br />
          Brasiliana.
        </h1>
        <p className="text-accents text-[#F8F6E8]/60 mt-6 max-w-md fade-in-up stagger-2">
          UM MOVIMENTO PARA REACENDER A INDÚSTRIA, A CRIATIVIDADE E A AMBIÇÃO BRASILEIRA.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 right-5 lg:right-10 z-10 flex flex-col items-center gap-2"
        style={{
          opacity: scrolled ? 0 : 1,
          transition: "opacity 300ms",
        }}
      >
        <span
          className="text-[11px] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          SCROLL
        </span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
