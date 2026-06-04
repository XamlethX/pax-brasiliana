"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterPage() {
  const [form, setForm] = useState({ email: "", nome: "", company: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ email: "", nome: "", company: "" });
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
            src="/images/instituto-pesquisa.png"
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
                <span>Newsletter</span>
                <span>Pax Brasiliana</span>
              </h1>
              <div className="lg:max-w-[412px] text-mist text-paragraphs flex flex-col gap-8">
                <p>
                  Análises mensais sobre indústria, tecnologia e construção nacional. Sem ruído — apenas o que importa para quem está construindo o Brasil.
                </p>
                <p>
                  Sem spam. Cancele a qualquer momento.
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
                    Inscreva-se
                  </div>

                  {status === "success" ? (
                    <div className="mt-8 flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-full bg-coast/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12l5 5L19 7" stroke="#417CE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-paragraphs text-bark">Inscrição confirmada. Você receberá um email de confirmação.</p>
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
                          Erro ao inscrever. Tente novamente.
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center bg-bark text-mist w-full justify-between mt-10 transition-all duration-300 hover:opacity-80 cursor-pointer text-accents disabled:opacity-50"
                      >
                        <span>{status === "loading" ? "INSCREVENDO..." : "INSCREVER-SE"}</span>
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
