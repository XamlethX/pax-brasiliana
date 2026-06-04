"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Status = "idle" | "loading" | "success" | "error";

export default function ContributePage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    timeAllocation: "",
    capabilities: "",
    pastProjects: "",
    preference: "",
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ nome: "", email: "", timeAllocation: "", capabilities: "", pastProjects: "", preference: "", company: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="bg-sand/30 relative min-h-[600px] flex flex-col lg:flex-row w-full lg:pt-24">
          <img
            src="/images/laboratorio-robos.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="media-overlay" aria-hidden="true" />
          <div
            className="relative pt-20 lg:pt-0 lg:border-t-[0.5px] lg:border-t-mist flex flex-col lg:flex-row w-full grid-lines"
            style={{ ["--grid-line-color" as string]: "#F8F6E880" }}
          >
            {/* LEFT 2/3 */}
            <div className="lg:w-2/3 pt-10 pb-5 lg:py-10 z-[2] relative px-5 lg:pl-10 flex flex-col gap-6 justify-between">
              <h1 className="text-mist text-h3 font-bold flex flex-col font-heading">
                <span>Contribua com a</span>
                <span>Pax Brasiliana</span>
              </h1>
              <div className="lg:max-w-[412px] text-mist text-paragraphs flex flex-col gap-8">
                <p>
                  Estamos buscando pessoas que possam ajudar a transformar ambição em projetos práticos, pesquisa útil, escrita pública, eventos, ferramentas e trabalho comunitário.
                </p>
                <p>
                  Compartilhe o que você pode fazer, quanto tempo pode dedicar e qual tipo de envolvimento faz sentido para você.
                </p>
              </div>
            </div>

            {/* RIGHT 1/3 */}
            <div className="lg:w-1/3 z-[2] relative px-2.5 lg:pr-5 lg:pl-0 flex-1">
              <div className="px-2.5 lg:px-5 relative py-5 lg:py-10 border-t-[0.5px] border-t-mist/50 lg:border-t-0 h-full">
                <img
                  src="/images/pattern-bg.png"
                  alt=""
                  className="absolute inset-0 w-full z-[1] h-full object-cover"
                />
                <form
                  onSubmit={handleSubmit}
                  className="bg-mist p-10 rounded-[6px] border border-bark relative z-10"
                >
                  <div className="text-paragraphs text-bark font-heading">
                    Interessado em contribuir?
                  </div>

                  {status === "success" ? (
                    <div className="mt-8 flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-full bg-coast/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12l5 5L19 7" stroke="#417CE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-paragraphs text-bark">Interesse recebido. Analisaremos seu perfil e entraremos em contato.</p>
                    </div>
                  ) : (
                    <div className="pt-5 font-mono">
                      <input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="NOME"
                        required
                        className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/30 w-full bg-transparent placeholder:text-bark/40"
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="EMAIL"
                        required
                        className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/30 w-full bg-transparent placeholder:text-bark/40"
                      />
                      <label className="block text-accents text-bark/40 uppercase pt-5 pb-2">
                        Quanto tempo pode dedicar?
                      </label>
                      <input
                        type="text"
                        name="timeAllocation"
                        value={form.timeAllocation}
                        onChange={handleChange}
                        placeholder="DISPONIBILIDADE"
                        required
                        className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/30 w-full bg-transparent placeholder:text-bark/40"
                      />
                      <label className="block text-accents text-bark/40 uppercase pt-5 pb-2">
                        Quais são suas habilidades?
                      </label>
                      <textarea
                        name="capabilities"
                        value={form.capabilities}
                        onChange={handleChange}
                        placeholder="HABILIDADES"
                        required
                        className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/30 w-full bg-transparent placeholder:text-bark/40 resize-none min-h-32"
                      />
                      <label className="block text-accents text-bark/40 uppercase pt-5 pb-2">
                        Projetos anteriores ou experiência relevante?
                      </label>
                      <textarea
                        name="pastProjects"
                        value={form.pastProjects}
                        onChange={handleChange}
                        placeholder="EXPERIÊNCIA ANTERIOR"
                        className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/30 w-full bg-transparent placeholder:text-bark/40 resize-none min-h-32"
                      />
                      <label className="block text-accents text-bark/40 uppercase pt-5 pb-2">
                        Você pode liderar projetos ou apenas contribuir?
                      </label>
                      <select
                        name="preference"
                        value={form.preference}
                        onChange={handleChange}
                        required
                        className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/30 w-full bg-transparent appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Selecionar</option>
                        <option value="lead">Capaz de liderar projetos</option>
                        <option value="contribute">Apenas contribuir</option>
                        <option value="either">Aberto a ambos</option>
                      </select>
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                      {status === "error" && (
                        <p className="text-clay text-accents font-mono mt-4">
                          Erro ao enviar. Tente novamente.
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center bg-bark text-mist w-full justify-between mt-10 transition-all duration-300 hover:opacity-80 cursor-pointer text-accents disabled:opacity-50"
                      >
                        <span>{status === "loading" ? "ENVIANDO..." : "ENVIAR INTERESSE"}</span>
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
