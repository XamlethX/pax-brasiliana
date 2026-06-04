import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main className="flex-1 bg-mist grid-lines flex items-center justify-center px-5">
        <div className="text-center">
          <p className="font-mono text-accents uppercase text-bark/40 mb-4">404</p>
          <h1 className="text-h3 font-bold text-bark font-heading mb-6">
            Página não encontrada.
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-bark text-mist font-mono text-accents uppercase transition-opacity duration-300 hover:opacity-80"
          >
            VOLTAR AO INÍCIO
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
