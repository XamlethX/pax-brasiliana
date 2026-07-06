"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getEnsaio } from "@/data/ensaios";
import { SITE_URL } from "@/lib/seo";

export default function EnsaioDetailPage() {
  useScrollReveal();
  const params = useParams();
  const slug = params.slug as string;
  const essay = getEnsaio(slug);

  if (!essay) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Navbar />
        <main id="main-content" className="flex-1 bg-[#F8F6E8] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-h3 text-[#463C2E]">Ensaio não encontrado</h1>
            <Link
              href="/ensaios"
              className="text-accents text-[#463C2E]/50 mt-6 inline-block link-underline pb-1"
            >
              VOLTAR AOS ENSAIOS
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.desc,
    datePublished: essay.isoDate,
    dateModified: essay.isoDate,
    inLanguage: "pt-BR",
    articleSection: essay.categoryLabel,
    author: { "@type": "Organization", name: essay.author },
    publisher: {
      "@type": "Organization",
      name: "Pax Brasiliana",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-wordmark.png` },
    },
    mainEntityOfPage: `${SITE_URL}/ensaios/${essay.slug}`,
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1 bg-[#F8F6E8]">
        <article>
          <section className="pt-32 pb-16 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
            <div className="max-w-[800px] mx-auto">
              <Link
                href="/ensaios"
                className="text-accents text-[#463C2E]/50 mb-10 inline-flex items-center gap-2 link-underline pb-1 transition-opacity duration-300 ease-out hover:opacity-60"
              >
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  className="rotate-180"
                  aria-hidden="true"
                >
                  <path
                    d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                    fill="currentColor"
                  />
                </svg>
                VOLTAR
              </Link>

              <p className="font-mono text-accents text-clay uppercase mb-4 border-l-[1px] border-clay pl-3">
                {essay.categoryLabel}
              </p>

              <h1
                className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-[#463C2E] font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {essay.title}
              </h1>

              <div className="flex items-center gap-4 mt-8">
                <div className="bg-[#c3be92] h-10 w-10" aria-hidden />
                <div>
                  <p
                    className="text-accents text-[#463C2E]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {essay.author}
                  </p>
                  <time
                    dateTime={essay.isoDate}
                    className="text-accents text-[#463C2E]/40 block"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {essay.date}
                  </time>
                </div>
              </div>

              <p className="mt-8 text-[#463C2E]/70 text-[14px] lg:text-[16px] leading-[160%] max-w-[640px]">
                {essay.intro}
              </p>
            </div>
          </section>

          {essay.sections.length > 0 && (
            <section className="px-5 lg:px-10 py-10 border-b-[0.5px] border-[#463C2E]/30">
              <div className="max-w-[800px] mx-auto">
                <p
                  className="text-accents text-[#463C2E]/50 mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ÍNDICE
                </p>
                <nav aria-label="Índice do ensaio" className="flex flex-col gap-2">
                  {essay.sections.map((s, i) => (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      className="text-[14px] lg:text-[16px] text-[#463C2E]/70 hover:text-[#463C2E] transition-colors duration-200 ease-out"
                    >
                      {i + 1}. {s.heading}
                    </a>
                  ))}
                </nav>
              </div>
            </section>
          )}

          <section className="px-5 lg:px-10 py-16 lg:py-20">
            <div className="max-w-[800px] mx-auto prose-pax">
              {essay.sections.map((s, i) => (
                <div key={i} id={`section-${i}`} className="mb-12">
                  <h2>{s.heading}</h2>
                  {s.content.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                  {i < essay.sections.length - 1 && <hr />}
                </div>
              ))}
            </div>
          </section>
        </article>

        <section className="px-5 lg:px-10 pb-16 lg:pb-20">
          <div className="max-w-[800px] mx-auto border-[0.5px] border-[#463C2E] bg-[#E4DECC] p-10 text-center">
            <h2
              className="text-[20px] lg:text-[24px] leading-[120%] tracking-[-0.02em] text-[#463C2E] font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Junte-se ao Movimento
            </h2>
            <p className="text-[14px] lg:text-[16px] text-[#463C2E]/60 mt-3 max-w-md mx-auto leading-[140%]">
              Construtores, criadores e pensadores que acreditam em um Brasil
              mais ambicioso.
            </p>
            <Link
              href="/get-involved"
              className="mt-6 inline-flex items-center gap-2 bg-[#463C2E] text-[#F8F6E8] text-[12px] tracking-[-0.06em] uppercase px-4 py-3.5 transition-opacity duration-300 ease-out hover:opacity-80"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PARTICIPE
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path
                  d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                  fill="#F8F6E8"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}
