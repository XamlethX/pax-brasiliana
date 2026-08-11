"use client";

import { useRef, useState } from "react";
import { Check, CopySimple } from "@phosphor-icons/react";

const REPOSITORY_URL = "https://github.com/XamlethX/pax-mantle";
const CLONE_COMMAND = "gh repo clone XamlethX/pax-mantle";

export default function GitHubCommandButton() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyCommand() {
    await navigator.clipboard.writeText(CLONE_COMMAND);
    setCopied(true);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="group flex min-h-[68px] w-full items-stretch overflow-hidden rounded-[22px] border border-mist/30 bg-[#20201f] text-mist shadow-[0_16px_34px_rgba(32,32,31,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-mist/50 hover:shadow-[0_20px_42px_rgba(32,32,31,0.3)]">
      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir o repositório do Pax Mantle no GitHub"
        className="flex min-w-0 flex-1 items-center gap-2.5 px-4 py-4 font-mono text-[12px] tracking-[-0.01em] text-mist/85 outline-none transition-colors hover:text-mist focus-visible:bg-white/10"
      >
        <span className="shrink-0 text-mist/40" aria-hidden="true">
          $
        </span>
        <span className="truncate">{CLONE_COMMAND}</span>
      </a>

      <button
        type="button"
        onClick={copyCommand}
        aria-label={copied ? "Comando copiado" : "Copiar comando para clonar o Pax Mantle"}
        className="flex shrink-0 items-center gap-2 border-l border-mist/15 px-3.5 font-mono text-[11px] uppercase tracking-[0.04em] text-mist/55 outline-none transition-colors hover:bg-white/10 hover:text-mist focus-visible:bg-white/10 lg:px-4"
      >
        <span className="hidden xl:inline" aria-live="polite">
          {copied ? "Copiado" : "Copiar"}
        </span>
        {copied ? (
          <Check size={21} weight="regular" aria-hidden="true" />
        ) : (
          <CopySimple size={21} weight="regular" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
