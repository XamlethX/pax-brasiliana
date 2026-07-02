"use client";

import { useState } from "react";

type Frequency = "once" | "monthly";
type Status = "idle" | "loading" | "error";

const PRESETS: Record<Frequency, { value: number; popular?: boolean }[]> = {
  monthly: [
    { value: 15 },
    { value: 30, popular: true },
    { value: 50 },
    { value: 100 },
  ],
  once: [
    { value: 50 },
    { value: 100, popular: true },
    { value: 250 },
    { value: 500 },
  ],
};

const DEFAULT_PRESET: Record<Frequency, number> = {
  monthly: 30,
  once: 100,
};

export default function DonationForm() {
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [preset, setPreset] = useState<number | null>(DEFAULT_PRESET.monthly);
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
      onClick={() => {
        setFrequency(value);
        setPreset(DEFAULT_PRESET[value]);
        setCustom("");
      }}
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
        {PRESETS[frequency].map(({ value, popular }) => {
          const selected = custom.trim() === "" && preset === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setPreset(value);
                setCustom("");
              }}
              className={`relative py-3.5 text-accents uppercase border transition-all duration-300 ease-out ${
                selected
                  ? "bg-bark text-mist border-bark"
                  : "bg-transparent text-bark border-bark/30 hover:border-bark"
              }`}
            >
              {popular && (
                <span
                  className={`absolute -top-[9px] left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 uppercase font-mono leading-none whitespace-nowrap transition-colors duration-300 ease-out ${
                    selected ? "bg-mist text-bark" : "bg-bark text-mist"
                  }`}
                >
                  Popular
                </span>
              )}
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
        Pagamento seguro via Stripe. Cancele uma doação mensal a qualquer
        momento.
      </p>
    </div>
  );
}
