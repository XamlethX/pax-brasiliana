"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContributePage() {
  useScrollReveal();
  const [form, setForm] = useState({
    timeCommitment: "",
    capabilities: "",
    background: "",
    leadership: "",
    company: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
              Contribua
            </h1>
            <p className="text-[#463C2E]/60 text-[14px] lg:text-[16px] leading-[140%] max-w-md lg:pb-3">
              Estamos procurando pessoas que possam ajudar a transformar ambição em projetos práticos, pesquisa útil, escrita pública, eventos, ferramentas e trabalho comunitário.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F6E8] py-16 md:py-24 px-5 lg:px-10">
          <div className="max-w-2xl mx-auto">
            <form className="flex flex-col fade-in-up" style={{ fontFamily: "var(--font-mono)" }}>
              <input
                type="text"
                name="timeCommitment"
                value={form.timeCommitment}
                onChange={handleChange}
                placeholder="DISPONIBILIDADE DE TEMPO"
                className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40"
              />
              <textarea
                name="capabilities"
                value={form.capabilities}
                onChange={handleChange}
                placeholder="HABILIDADES"
                rows={3}
                className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40 resize-none"
              />
              <textarea
                name="background"
                value={form.background}
                onChange={handleChange}
                placeholder="EXPERIÊNCIA (OPCIONAL)"
                rows={3}
                className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40 resize-none"
              />
              <div className="py-5 border-b border-dashed border-[#463C2E]/30">
                <p className="text-accents text-[#463C2E]/40 uppercase mb-4">INTERESSE EM LIDERANÇA</p>
                <div className="flex flex-col gap-3">
                  {[
                    { value: "lead", label: "Capaz de liderar projetos" },
                    { value: "contribute", label: "Interesse apenas em contribuir" },
                    { value: "open", label: "Aberto a ambos" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors duration-300 ${form.leadership === opt.value ? "border-[#463C2E] bg-[#463C2E]" : "border-[#463C2E]/30 group-hover:border-[#463C2E]/50"}`}>
                        {form.leadership === opt.value && <div className="w-1.5 h-1.5 bg-[#F8F6E8] rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="leadership"
                        value={opt.value}
                        checked={form.leadership === opt.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-accents text-[#463C2E]/70">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="EMPRESA"
                className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40"
              />
              <button
                type="submit"
                className="uppercase leading-none flex gap-2 px-4 py-3.5 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between mt-10 transition-all duration-300 hover:opacity-80 cursor-pointer text-accents"
              >
                <span>ENVIAR</span>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="#F8F6E8" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
