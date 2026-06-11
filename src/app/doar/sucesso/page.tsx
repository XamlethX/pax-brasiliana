"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DonateSuccessPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1 bg-mist grid-lines flex items-center justify-center px-5">
        <div className="text-center max-w-[480px]">
          <div className="w-12 h-12 rounded-full bg-coast/10 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L19 7" stroke="#417CE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-mono text-accents uppercase text-bark/40 mb-4">Doação confirmada</p>
          <h1 className="text-h3 font-bold text-bark font-heading mb-4">
            Obrigado pelo apoio.
          </h1>
          <p className="text-paragraphs text-bark/60 mb-10">
            100% do valor vai diretamente para a missão da Pax Brasiliana. Você receberá um email com a confirmação da sua doação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-bark text-bark font-mono text-accents uppercase transition-all hover:bg-bark hover:text-mist"
            >
              SOBRE O MOVIMENTO
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-bark text-mist font-mono text-accents uppercase transition-all hover:opacity-80"
            >
              INÍCIO
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="currentColor" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
