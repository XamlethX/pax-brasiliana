"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#F8F6E8] min-h-[60vh] flex flex-col lg:flex-row pt-32 pb-16 lg:pb-20 px-5 lg:px-10">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-[-0.04em] text-[#463C2E]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contato
            </h1>
          </div>
          <div className="lg:w-1/2 flex items-start lg:pt-6">
            <p className="text-[20px] lg:text-[24px] leading-[130%] tracking-[-0.02em] text-[#463C2E]/70 max-w-lg">
              Tem algo para compartilhar ou quer conversar? Somos todo ouvidos. Escreva para{" "}
              <a
                href="mailto:contato@paxbrasiliana.com"
                className="text-[#463C2E] underline underline-offset-4 decoration-[#463C2E]/30 hover:decoration-[#463C2E] transition-colors duration-300"
              >
                contato@paxbrasiliana.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
