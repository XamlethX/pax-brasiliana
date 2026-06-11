"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import TextWithImage from "@/components/TextWithImage";
import ProjectsPreview from "@/components/ProjectsPreview";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";

const WebGLFlag = dynamic(() => import("@/components/WebGLFlag"), {
  ssr: false,
});

export default function Home() {
  useScrollReveal();
  const reducedMotion = usePrefersReducedMotion();
  const { sectionRef, textRef } = useScrollParallax<
    HTMLElement,
    HTMLDivElement
  >({ maxTranslate: 180 });

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Statement */}
        <section className="grid-lines py-20 lg:min-h-screen flex items-center justify-center flex-col relative" style={{ backgroundColor: "var(--iron)" }}>
          <div className="px-5 lg:px-10 text-center relative z-10">
            <h2 className="text-h2 font-heading text-bark text-center flex flex-col">
              O Brasil é o país do<br />futuro... e sempre será.
            </h2>
            <p className="text-paragraphs text-bark/75 mt-10 max-w-[600px] mx-auto">
              Por tempo demais, o Brasil apostou em exportar commodities aguardando
              o momento em que a história finalmente bata à sua porta e ele tenha
              a coragem de abrir.
            </p>
          </div>
        </section>

        {/* 3. Manifesto — Isto acaba agora */}
        <ManifestoSection
          lines={["Isto acaba agora."]}
          image="/images/estacao-trem.png"
          alt="Estação ferroviária movimentada com trens de alta velocidade em um Brasil futuro"
          overlay
        />

        {/* 4. Text — rentismo */}
        <TextWithImage>
          <span>
            Trocamos o trabalho duro de construir pelo conforto do rentismo.
            O resultado é uma economia frágil, uma cultura que pune a ambição
            e o cinismo sobre nosso futuro.
          </span>
        </TextWithImage>

        {/* 5. Flag + headline */}
        <section
          ref={sectionRef}
          className="bg-mist grid-lines flex flex-col items-center justify-center gap-20 lg:gap-[140px] pt-16 lg:pt-24 relative border-t-[0.5px] border-t-bark/30 overflow-x-clip"
        >
          <div className="w-[310px] lg:w-[500px] mb-[-50px] relative" style={{ aspectRatio: "3.55 / 2" }}>
            {reducedMotion ? (
              <Image
                src="/images/flag.png"
                alt="Bandeira do Brasil"
                fill
                sizes="(min-width: 1024px) 500px, 310px"
                className="object-contain"
              />
            ) : (
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
            )}
          </div>

          <div
            ref={textRef}
            style={{ willChange: "transform" }}
            className="flex flex-col items-center justify-center gap-8 px-5 lg:px-10 pb-25 lg:pb-0"
          >
            <h2 className="text-h1 text-coast text-center flex flex-col">
              <span>Está na hora</span>
              <span>de construir.</span>
            </h2>
            <p className="text-paragraphs text-bark max-w-[700px] text-center">
              Pax Brasiliana é um movimento e uma mudança de mentalidade para
              tirar esse país da estagnação. Nossa missão é reacender a indústria,
              a criatividade e a ambição brasileira.
            </p>
          </div>
        </section>

        {/* 6. Manifesto — Bautista Vidal */}
        <ManifestoSection
          lines={['"Faremos dessa terra a maior', 'civilização que o homem já viu."']}
          image="/images/cidade-futura.png"
          alt="Cidade brasileira futurista à beira-mar com arranha-céus e orla movimentada"
          italic
          attribution="Bautista Vidal"
          overlay
          align="center"
        />

        {/* 7. Text — indústria */}
        <TextWithImage>
          <span>
            A força de uma nação é definida pela sua capacidade de extrair,
            cultivar, manufaturar e mover coisas. Essa capacidade se chama indústria.
          </span>
        </TextWithImage>

        {/* 8. Manifesto — Darcy Ribeiro quote */}
        <ManifestoSection
          lines={['"O Brasil é a Nova Roma.', 'Uma Roma que o mundo', 'vai ver espantado."']}
          image="/images/steel-mill.png"
          alt="Siderúrgica brasileira de larga escala com trabalhadores e pontes rolantes sob vegetação"
          italic
          attribution="Darcy Ribeiro"
          overlay
          align="center"
        />

        {/* 9. Text — empregos + talento */}
        <TextWithImage>
          <span>
            A indústria cria os empregos de alto salário e diminui os custos
            dos bens, o que permite famílias brasileiras prosperarem ao invés
            de sobreviverem. Criando uma geração que herda oportunidades.
          </span>
          <br /><br />
          <span>
            Nós temos a terra, o potencial energético, a criatividade e o talento.
            Agora precisamos da coragem.
          </span>
        </TextWithImage>

        {/* 10. Manifesto — Nietzsche */}
        <ManifestoSection
          lines={['"Quem tem um porquê pode', 'suportar quase qualquer como."']}
          image="/images/irrigation-cerrado.png"
          alt="Sistema de irrigação de larga escala no cerrado brasileiro"
          italic
          attribution="Friedrich Nietzsche"
          overlay
          align="center"
        />

        {/* 11. Text — inovação + capital */}
        <TextWithImage>
          <span>
            Para isso precisamos trocar o rentismo pela inovação.
          </span>
          <br /><br />
          <span>
            Nós precisamos de capital fluindo para a indústria produtiva e criativa
            — empresas, fábricas, infraestrutura, cultura e energia — não apenas
            cobrança de juros.
          </span>
        </TextWithImage>

        {/* 12. Featured content */}
        <ProjectsPreview />

        {/* 12. CTA */}
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
