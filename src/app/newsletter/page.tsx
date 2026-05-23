"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NewsletterPage() {
  useScrollReveal();
  const [email, setEmail] = useState("");

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#F8F6E8] pt-32 pb-12 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-[-0.04em] text-[#463C2E]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Newsletter
            </h1>
            <p className="text-[#463C2E]/60 text-[14px] lg:text-[16px] leading-[140%] max-w-md lg:pb-3">
              Fique atualizado sobre o progresso do Brasil com análises mensais, atualizações de dados e perspectivas sobre indústria, tecnologia e construção nacional.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F6E8] py-16 md:py-24 px-5 lg:px-10">
          <div className="max-w-lg mx-auto text-center">
            <form className="fade-in-up" style={{ fontFamily: "var(--font-mono)" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="DIGITE SEU EMAIL"
                required
                className="w-full text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E] bg-transparent placeholder:text-[#463C2E]/40 text-center"
              />
              <button
                type="submit"
                className="uppercase leading-none flex gap-2 px-4 py-3.5 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between mt-10 transition-all duration-300 hover:opacity-80 cursor-pointer text-accents"
              >
                <span>INSCREVER-SE NA NEWSLETTER</span>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="#F8F6E8" />
                </svg>
              </button>
            </form>
            <p className="mt-8 text-[#463C2E]/40 text-[12px] leading-[160%]" style={{ fontFamily: "var(--font-mono)" }}>
              Sem spam. Apenas análises relevantes sobre a capacidade produtiva brasileira. Cancele a qualquer momento.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
