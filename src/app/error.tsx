"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-mist grid-lines flex items-center justify-center px-5">
      <div className="text-center">
        <p className="font-mono text-accents uppercase text-clay mb-4">Erro</p>
        <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-bark font-bold font-heading">
          Algo deu errado.
        </h2>
        <p className="text-bark/60 mt-4 max-w-[420px] mx-auto text-[14px] lg:text-[16px] leading-[150%]">
          Encontramos um problema inesperado. Tente novamente ou volte ao
          início.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center font-mono">
          <button
            onClick={() => reset()}
            className="uppercase leading-none px-6 py-3 bg-bark text-mist text-accents transition-opacity duration-300 ease-out hover:opacity-80"
          >
            TENTAR NOVAMENTE
          </button>
          <Link
            href="/"
            className="uppercase leading-none px-6 py-3 border border-bark text-bark text-accents transition-opacity duration-300 ease-out hover:opacity-80 flex items-center"
          >
            VOLTAR AO INÍCIO
          </Link>
        </div>
      </div>
    </div>
  );
}
