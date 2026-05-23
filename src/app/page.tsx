"use client";

import dynamic from "next/dynamic";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ProjectsPreview from "@/components/ProjectsPreview";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";

const WebGLFlag = dynamic(() => import("@/components/WebGLFlag"), {
  ssr: false,
});

export default function Home() {
  useScrollReveal();
  const { sectionRef, textRef } = useScrollParallax<
    HTMLElement,
    HTMLDivElement
  >({ maxTranslate: 180 });

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — full-screen photo + wordmark */}
        <HeroSection />

        {/* 2. Statement — khaki bg, centered bold text */}
        <section className="bg-[#c3be92] grid-lines pattern-bg py-20 min-h-screen flex items-center justify-center flex-col relative overflow-hidden">
          <div className="px-5 lg:px-10 text-center relative z-10">
            <h2 className="text-h2 text-[#463C2E] fade-in-up" style={{ textWrap: "balance" }}>
              O Brasil é o país do<br />futuro... e sempre será.
            </h2>
            <p className="text-paragraphs text-[#463C2E]/75 mt-10 max-w-[600px] mx-auto fade-in-up stagger-2">
              Por tempo demais, o Brasil apostou em exportar commodities aguardando o momento em que a história finalmente bata à sua porta e ele tenha a coragem de abrir.
            </p>
          </div>
        </section>

        {/* 3. Flag + parallax headline */}
        <section
          ref={sectionRef}
          className="bg-[#F8F6E8] grid-lines flex flex-col items-center justify-center gap-20 lg:gap-[140px] pt-16 lg:pt-24 relative"
        >
          <div className="w-[310px] lg:w-[500px] mb-[-50px]" style={{ aspectRatio: "3.55 / 2" }}>
            <WebGLFlag
              src="/images/flag.png"
              width="100%"
              height="100%"
              waveSpeed={1.2}
              waveIntensity={1.2}
              shadowStrength={0.3}
              aspectRatioWidth={3.55}
              aspectRatioHeight={2.0}
              cameraZ={4.5}
            />
          </div>

          <div
            ref={textRef}
            style={{ willChange: "transform" }}
            className="flex flex-col items-center justify-center gap-8 px-5 lg:px-10 pb-25 lg:pb-0"
          >
            <h2 className="text-h1 text-[#417CE5] text-center flex flex-col">
              <span>Está na hora</span>
              <span>de construir.</span>
            </h2>
            <p className="text-paragraphs text-[#463C2E] max-w-[700px] text-center">
              Pax Brasiliana é um movimento e uma mudança de mentalidade para tirar esse país da estagnação. Nossa missão é reacender a indústria, a criatividade e a ambição brasileira.
            </p>
          </div>
        </section>

        {/* 4. Manifesto — "Isto acaba agora." */}
        <ManifestoSection
          lines={["Isto acaba agora."]}
          image="/images/hero.jpg"
        />

        {/* 4b. Text block */}
        <section className="bg-[#F8F6E8] grid-lines relative py-20 lg:py-[120px] px-5 lg:px-10">
          <p className="text-paragraphs text-[#463C2E] max-w-[680px]">
            Trocamos o trabalho duro de construir pelo conforto do rentismo. O resultado é uma economia frágil, uma cultura que pune a ambição e o cinismo sobre nosso futuro.
          </p>
        </section>

        {/* 5. Manifesto — "Construir é a única maneira de prosperar." */}
        <ManifestoSection
          lines={["Construir é a única", "maneira de prosperar."]}
          image="/images/hero.jpg"
        />

        {/* 5b. Text block */}
        <section className="bg-[#F8F6E8] grid-lines relative py-20 lg:py-[120px] px-5 lg:px-10">
          <p className="text-paragraphs text-[#463C2E] max-w-[680px]">
            A força de uma nação é definida pela sua capacidade de extrair, cultivar, manufaturar e mover coisas. Essa capacidade se chama indústria.
          </p>
        </section>

        {/* 6. Quote — Bautista Vidal */}
        <ManifestoSection
          lines={["“Faremos dessa terra a maior", "civilização que o homem já viu.”"]}
          image="/images/hero.jpg"
          italic
          attribution="BAUTISTA VIDAL"
        />

        {/* 6b. Text block */}
        <section className="bg-[#F8F6E8] grid-lines relative py-20 lg:py-[120px] px-5 lg:px-10">
          <p className="text-paragraphs text-[#463C2E] max-w-[680px]">
            A indústria cria os empregos de alto salário e diminui os custos dos bens, o que permite famílias brasileiras prosperarem ao invés de sobreviverem. Criando uma geração que herda oportunidades.
          </p>
          <br />
          <p className="text-paragraphs text-[#463C2E] max-w-[680px]">
            Nós temos a terra, o potencial energético, a criatividade e o talento. Agora precisamos da coragem.
          </p>
        </section>

        {/* 7. Quote — Darcy Ribeiro */}
        <ManifestoSection
          lines={["“O Brasil é a Nova Roma. Uma Roma", "que o mundo vai ver espantado.”"]}
          image="/images/hero.jpg"
          italic
          attribution="DARCY RIBEIRO"
        />

        {/* 7b. Text block */}
        <section className="bg-[#F8F6E8] grid-lines relative py-20 lg:py-[120px] px-5 lg:px-10">
          <p className="text-paragraphs text-[#463C2E] max-w-[680px]">
            Para isso precisamos trocar o rentismo pela inovação.
          </p>
          <br />
          <p className="text-paragraphs text-[#463C2E] max-w-[680px]">
            Nós precisamos de capital fluindo para a indústria produtiva e criativa — empresas, fábricas, infraestrutura, cultura e energia — não apenas cobrança de juros.
          </p>
        </section>

        {/* 8. Quote — Roberto Campos Neto (last = centered) */}
        <ManifestoSection
          lines={["“Faremos do Brasil não o país", "do futuro, mas o país do presente.”"]}
          image="/images/hero.jpg"
          italic
          attribution="ROBERTO CAMPOS NETO"
          align="center"
        />

        {/* 11. Featured content — latest project + essay */}
        <ProjectsPreview />

        {/* 12. CTA — Join the Movement */}
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
