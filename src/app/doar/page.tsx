"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Frequency = "once" | "monthly";
type Status = "idle" | "loading" | "error";

const PRESETS = [25, 50, 100, 250];

export default function DonatePage() {
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [preset, setPreset] = useState<number | null>(100);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Custom amount (when typed) overrides the selected preset.
  const amount = custom.trim() !== "" ? Number(custom.replace(",", ".")) : preset;
  const valid = typeof amount === "number" && Number.isFinite(amount) && amount >= 5;

  const handleDonate = async () => {
    if (!valid || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erro");
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  };

  const freqBtn = (value: Frequency, label: string) => (
    <button
      type="button"
      onClick={() => setFrequency(value)}
      className={`flex-1 py-3.5 text-accents font-mono uppercase transition-all duration-300 ease-out ${
        frequency === value
          ? "bg-bark text-mist"
          : "bg-transparent text-bark hover:opacity-60"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="bg-sand/30 relative min-h-[600px] flex flex-col lg:flex-row w-full lg:pt-24">
          <img
            src="/images/steel-mill.png"
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
                <span>Apoie a</span>
                <span>Pax Brasiliana</span>
              </h1>
              <div className="lg:max-w-[412px] text-mist text-paragraphs flex flex-col gap-8">
                <p>
                  Somos uma organização sem fins lucrativos. 100% das doações
                  financiam diretamente a missão: reacender a capacidade do
                  Brasil de construir indústria, tecnologia e cultura.
                </p>
                <p>
                  Doe uma vez ou torne-se um apoiador mensal. Cada real constrói
                  algo.
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
                <div className="bg-mist p-10 rounded-[6px] border border-bark relative z-10">
                  <div className="text-paragraphs text-bark font-heading">
                    Faça sua doação
                  </div>

                  {/* Frequency toggle */}
                  <div className="mt-6 flex border border-bark rounded-[4px] overflow-hidden">
                    {freqBtn("monthly", "Mensal")}
                    <div className="w-px bg-bark" />
                    {freqBtn("once", "Única")}
                  </div>

                  {/* Preset amounts */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 font-mono">
                    {PRESETS.map((value) => {
                      const selected = custom.trim() === "" && preset === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setPreset(value);
                            setCustom("");
                          }}
                          className={`py-3.5 text-accents uppercase border transition-all duration-300 ease-out ${
                            selected
                              ? "bg-bark text-mist border-bark"
                              : "bg-transparent text-bark border-bark/30 hover:border-bark"
                          }`}
                        >
                          R${value}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom amount */}
                  <label className="block text-accents text-bark/40 uppercase pt-5 pb-2 font-mono">
                    Outro valor (R$)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={5}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="VALOR PERSONALIZADO"
                    className="text-accents text-bark uppercase outline-none py-3.5 border-b border-dashed border-bark/30 w-full bg-transparent placeholder:text-bark/40 font-mono"
                  />

                  {status === "error" && (
                    <p className="text-clay text-accents font-mono mt-4">
                      Erro ao iniciar a doação. Tente novamente.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleDonate}
                    disabled={!valid || status === "loading"}
                    className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center bg-bark text-mist w-full justify-between mt-8 transition-all duration-300 ease-out hover:opacity-80 cursor-pointer text-accents disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {status === "loading"
                        ? "REDIRECIONANDO..."
                        : frequency === "monthly"
                          ? "DOAR MENSALMENTE"
                          : "DOAR AGORA"}
                    </span>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z" fill="currentColor" />
                    </svg>
                  </button>

                  <p className="text-bark/40 text-accents font-mono mt-4 leading-[150%]">
                    Pagamento seguro via Stripe. Cancele uma doação mensal a
                    qualquer momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
