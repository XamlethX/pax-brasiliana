"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import Link from "next/link";

const principles = [
  {
    title: "Inclinação para construir",
    desc: "Escolher a dificuldade de criar em vez do conforto de reclamar. O caminho difícil de fazer coisas concretas é melhor do que o caminho fácil de criticar quem tenta.",
  },
  {
    title: "Estratégia, não simbolismo",
    desc: "Ideias que não viram projetos são entretenimento intelectual. Valorizamos execução sobre discurso, resultados sobre intenções, construção sobre protesto.",
  },
  {
    title: "Mudança estrutural",
    desc: "Não basta crescer — é preciso transformar a estrutura produtiva. Sair da dependência de commodities para uma economia que agrega valor, cria tecnologia e exporta conhecimento.",
  },
  {
    title: "Pensar em décadas",
    desc: "O ciclo eleitoral pensa em 4 anos. O mercado financeiro pensa em trimestres. Nós pensamos em gerações. Infraestrutura, educação e indústria demandam paciência e persistência.",
  },
  {
    title: "Amor ao risco",
    desc: "Uma sociedade que pune o fracasso mata a inovação. Precisamos de mais fundadores, mais fábricas, mais tentativas — e menos medo de errar.",
  },
  {
    title: "Restaurar a oportunidade justa",
    desc: "A oportunidade justa nunca foi sobre esmola. Era sobre chances iguais de tentar, competir e prosperar. Vamos trazê-la de volta pela via da produção.",
  },
];

const culturalReset = [
  {
    title: "Celebrar construtores",
    desc: "Os engenheiros, fundadores, operários, pesquisadores e artesãos que criam coisas reais devem ser os heróis culturais do Brasil.",
  },
  {
    title: "Otimismo anti-doomer",
    desc: "Rejeitamos a narrativa de que o Brasil é um caso perdido. Cada problema é uma oportunidade de construção para quem tem coragem de agir.",
  },
  {
    title: "Comunidade e conexão",
    desc: "Construir não é atividade solitária. Criamos redes de pessoas com alta agência que se apoiam, colaboram e elevam umas às outras.",
  },
  {
    title: "Beleza importa",
    desc: "O que construímos deve ser bonito. Cidades, fábricas, produtos e infraestrutura podem e devem inspirar orgulho estético — não apenas funcional.",
  },
  {
    title: "Um Brasil para ter orgulho",
    desc: "Não queremos um Brasil que funcione apesar de si mesmo. Queremos um Brasil que o mundo admire — e que os brasileiros tenham orgulho de chamar de seu.",
  },
];

const dashedBorder = {
  borderTop: "0.5px dashed",
  borderImage:
    "repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1",
} as React.CSSProperties;

export default function ManifestoPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          title="Um chamado para construir o Brasil"
          description="Um movimento cultural-industrial voltado a imaginar, construir e acelerar o futuro brasileiro."
          image="/images/cidade-futura.png"
        />

        {/* Introduction */}
        <section className="bg-mist flex flex-col lg:flex-row border-b-[0.5px] border-b-bark/30">
          <div className="w-full lg:w-1/3 px-5 lg:pl-10 lg:pr-0 pt-16 lg:pt-20 pb-10 lg:pb-20">
            <p className="text-accents text-bark/50 border-l-[1px] border-clay pl-5 py-[9px] font-mono">
              INTRODUÇÃO
            </p>
          </div>
          <div className="w-full lg:w-2/3 px-5 lg:pl-5 lg:pr-10 pt-0 lg:pt-20 pb-16 lg:pb-20">
            <div className="max-w-[800px] prose-pax">
              <p>
                O Brasil tem tudo o que precisa para ser uma das grandes civilizações do século XXI: território continental, recursos naturais imensuráveis, população jovem e criativa, posição geográfica estratégica e uma cultura vibrante que o mundo inteiro admira.
              </p>
              <p>
                E no entanto, nos contentamos com tão pouco. Exportamos soja e minério de ferro em estado bruto. Importamos fertilizantes, baterias, semicondutores e medicamentos. Nossos melhores talentos emigram. Nossas cidades se degradam. Nossa indústria encolhe.
              </p>
              <p>
                <strong>Isso não é destino. É escolha.</strong> E escolhas podem ser mudadas.
              </p>
              <p>
                A Pax Brasiliana nasce da convicção de que o Brasil pode — e deve — construir coisas grandiosas. Não por nostalgia de um passado idealizado, mas pela crença inabalável em um futuro que ainda não foi escrito.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="bg-mist flex flex-col lg:flex-row border-b-[0.5px] border-b-bark/30">
          <div className="w-full lg:w-1/3 px-5 lg:pl-10 lg:pr-0 pt-16 lg:pt-20 pb-10 lg:pb-20">
            <p className="text-accents text-bark/50 border-l-[1px] border-clay pl-5 py-[9px] font-mono">
              PRINCÍPIOS PARA UMA NOVA AMBIÇÃO NACIONAL
            </p>
          </div>
          <div className="w-full lg:w-2/3 px-5 lg:pl-5 lg:pr-10 pt-0 lg:pt-20 pb-16 lg:pb-20">
            <div className="grid md:grid-cols-2 gap-5 max-w-[800px]">
              {principles.map((p, i) => (
                <div
                  key={p.title}
                  className={`bg-sand border-[0.5px] border-bark p-5 min-h-[200px] flex flex-col fade-in-up stagger-${Math.min(i + 1, 5)}`}
                >
                  <h3 className="text-[20px] lg:text-[24px] leading-[120%] tracking-[-0.02em] text-bark font-bold font-heading">
                    {p.title}
                  </h3>
                  <div className="my-4" style={dashedBorder} />
                  <p className="text-bark/70 text-[14px] lg:text-[16px] leading-[140%]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cultural Reset */}
        <section className="bg-mist flex flex-col lg:flex-row border-b-[0.5px] border-b-bark/30">
          <div className="w-full lg:w-1/3 px-5 lg:pl-10 lg:pr-0 pt-16 lg:pt-20 pb-10 lg:pb-20">
            <p className="text-accents text-bark/50 border-l-[1px] border-clay pl-5 py-[9px] font-mono">
              UM RESET CULTURAL
            </p>
          </div>
          <div className="w-full lg:w-2/3 px-5 lg:pl-5 lg:pr-10 pt-0 lg:pt-20 pb-16 lg:pb-20">
            <div className="max-w-[800px]">
              <div className="grid md:grid-cols-2 gap-5">
                {culturalReset.map((item, i) => (
                  <div
                    key={item.title}
                    className={`bg-sand border-[0.5px] border-bark p-5 flex flex-col fade-in-up stagger-${Math.min(i + 1, 5)}`}
                  >
                    <h3 className="text-[16px] lg:text-[18px] leading-[130%] text-bark font-bold font-heading">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-bark/70 text-[14px] lg:text-[16px] leading-[140%]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Economic Imperative */}
        <section className="bg-mist flex flex-col lg:flex-row border-b-[0.5px] border-b-bark/30">
          <div className="w-full lg:w-1/3 px-5 lg:pl-10 lg:pr-0 pt-16 lg:pt-20 pb-10 lg:pb-20">
            <p className="text-accents text-bark/50 border-l-[1px] border-clay pl-5 py-[9px] font-mono">
              UM IMPERATIVO ECONÔMICO
            </p>
          </div>
          <div className="w-full lg:w-2/3 px-5 lg:pl-5 lg:pr-10 pt-0 lg:pt-20 pb-16 lg:pb-20">
            <div className="max-w-[800px] prose-pax">
              <p>
                O Brasil precisa de crescimento real — não inflado por ciclos de commodities, mas sustentado por produtividade, inovação e valor agregado. O caminho passa por:
              </p>
              <ul>
                <li>Reindustrialização inteligente em setores estratégicos: defesa, energia, semicondutores, farmacêutico, aeroespacial</li>
                <li>Infraestrutura de classe mundial: ferrovias, portos, energia nuclear, telecomunicações</li>
                <li>Educação técnica de excelência que forme engenheiros, técnicos e operadores</li>
                <li>Desburocratização radical que libere empreendedores para criar sem pedir permissão</li>
                <li>Capital paciente direcionado a indústrias produtivas, não a especulação imobiliária</li>
              </ul>
              <p>
                <strong>O futuro não acontece por acaso.</strong> Ele é desenhado, planejado e construído por pessoas que se recusam a aceitar o status quo.
              </p>
            </div>
          </div>
        </section>

        {/* The New Dream */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/foguete-orbital.png"
              alt=""
              className="w-full h-full object-cover ken-burns"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 text-center px-5 lg:px-10 py-20">
            <h2 className="text-h3 text-mist fade-in-up font-heading" style={{ textWrap: "balance" } as React.CSSProperties}>
              O novo sonho brasileiro
            </h2>
            <p className="text-mist/70 mt-8 max-w-[600px] mx-auto text-[14px] lg:text-[16px] leading-[140%] fade-in-up stagger-2">
              Não é um sonho de consumo. É um sonho de construção. De ver o nome
              do Brasil em satélites, em patentes, em produtos que o mundo inteiro
              quer comprar. De criar cidades bonitas, indústrias sofisticadas e
              uma cultura que inspira.
            </p>
            <p className="text-mist mt-8 text-[20px] lg:text-[24px] leading-[120%] fade-in-up stagger-3 font-bold font-heading">
              É hora de construir o Brasil.
            </p>
            <Link
              href="/get-involved"
              className="mt-10 inline-flex items-center gap-2 bg-mist text-bark text-[12px] tracking-[-0.06em] uppercase px-4 py-3.5 transition-opacity duration-300 ease-out hover:opacity-80 fade-in-up stagger-4 font-mono"
            >
              JUNTE-SE AO MOVIMENTO
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="currentColor" />
              </svg>
            </Link>
          </div>
        </section>

        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
