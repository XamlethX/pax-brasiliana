"use client";

import { useState } from "react";

export default function JoinForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-[#c3be92] pattern-bg relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row">
        <div className="lg:w-2/3 px-5 lg:pl-10 lg:pr-5 pt-16 lg:pt-20 pb-10 lg:pb-20">
          <h2
            className="text-h3 text-[#463C2E]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Junte-se ao<br />Movimento
          </h2>
          <p className="text-[#463C2E]/60 mt-6 max-w-[500px] text-[14px] lg:text-[16px] leading-[140%]">
            Nossa comunidade é aberta e ambiciosa. Somos empreendedores,
            criadores, construtores. Pessoas que acreditam, que tentam.
          </p>
        </div>
        <div className="lg:w-1/3 px-5 lg:pr-10 lg:pl-0 pb-16 lg:pb-20 lg:pt-20 flex items-end">
          {status === "success" ? (
            <div
              className="w-full flex flex-col gap-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <p className="text-accents uppercase text-[#463C2E]">
                Inscrição confirmada ✓
              </p>
              <p className="text-[#463C2E]/60 text-[14px] leading-[140%]">
                Verifique seu email para a confirmação.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-2.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="DIGITE SEU EMAIL"
                aria-label="Email para participar do movimento"
                required
                disabled={status === "loading"}
                className="w-full text-accents text-[#463C2E] uppercase outline-none py-4 border-b border-dashed border-[#463C2E]/30 bg-transparent placeholder:text-[#463C2E]/30 disabled:opacity-50"
              />
              {/* Honeypot — hidden from users, catches bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="uppercase leading-none flex gap-2 px-4 py-3.5 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between mt-4 transition-all duration-300 ease-out hover:opacity-80 cursor-pointer text-accents disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {status === "loading" ? "ENVIANDO…" : "JUNTE-SE AO MOVIMENTO"}
                </span>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                  <path
                    d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                    fill="#F8F6E8"
                  />
                </svg>
              </button>
              {status === "error" && (
                <p role="alert" className="text-accents text-clay mt-1">
                  Erro ao enviar. Tente novamente.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
