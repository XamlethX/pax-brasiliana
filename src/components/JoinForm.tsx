"use client";

import { useState } from "react";

export default function JoinForm() {
  const [email, setEmail] = useState("");

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
          <form
            className="w-full flex flex-col gap-2.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="DIGITE SEU EMAIL"
              required
              className="w-full text-accents text-[#463C2E] uppercase outline-none py-4 border-b border-dashed border-[#463C2E]/30 bg-transparent placeholder:text-[#463C2E]/30"
            />
            <button
              type="submit"
              className="uppercase leading-none flex gap-2 px-4 py-3.5 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between mt-4 transition-all duration-300 hover:opacity-80 cursor-pointer text-accents"
            >
              <span>JUNTE-SE AO MOVIMENTO</span>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                  fill="#F8F6E8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
