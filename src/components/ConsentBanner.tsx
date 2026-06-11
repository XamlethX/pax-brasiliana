"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "pax-consent";

/**
 * LGPD cookie/consent notice. Persists the choice in localStorage and exposes
 * it on `window.__paxConsent` plus a `pax-consent-change` event so any future
 * analytics loader can gate itself on `granted`.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
      else {
        (window as unknown as { __paxConsent?: string }).__paxConsent = stored;
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (choice: "granted" | "denied") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* storage unavailable — honor choice for this session only */
    }
    (window as unknown as { __paxConsent?: string }).__paxConsent = choice;
    window.dispatchEvent(
      new CustomEvent("pax-consent-change", { detail: choice })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de privacidade"
      className="fixed bottom-0 inset-x-0 z-[70] bg-bark text-mist border-t-[0.5px] border-mist/30"
    >
      <div className="max-w-[1100px] mx-auto px-5 lg:px-10 py-5 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
        <p className="text-[13px] lg:text-[14px] leading-[150%] text-mist/80 flex-1">
          Usamos cookies para entender como o site é utilizado e melhorar sua
          experiência. Você pode aceitar ou recusar. Saiba mais na nossa{" "}
          <Link href="/privacy" className="underline hover:opacity-80">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-2.5 shrink-0 font-mono">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="uppercase text-accents border border-mist/40 text-mist px-4 py-3 hover:opacity-80 transition-opacity duration-300 ease-out"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="uppercase text-accents bg-mist text-bark px-4 py-3 hover:opacity-80 transition-opacity duration-300 ease-out"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
