"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F8F6E8] flex items-center justify-center px-5">
      <div className="text-center">
        <h2
          className="text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-[#463C2E] font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Algo deu errado.
        </h2>
        <button
          onClick={() => reset()}
          className="mt-8 uppercase leading-none px-6 py-3 bg-[#463C2E] text-[#F8F6E8] text-[14px] tracking-[-0.06em] transition-opacity duration-300 hover:opacity-80"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    </div>
  );
}
