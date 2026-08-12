import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";
import GitHubCommandButton from "@/components/GitHubCommandButton";
import Image from "next/image";

const passos = [
  {
    n: "01",
    title: "Detectar",
    desc: "Uma passada de regex captura identificadores rígidos — e-mails, telefones, CPF, CNPJ, chaves de API — e um modelo pequeno rodando no seu computador encontra os dados sutis: nomes, empregadores, localizações.",
  },
  {
    n: "02",
    title: "Decidir",
    desc: "Nem tudo deve ser escondido. Um segundo modelo local julga se cada detalhe é essencial pra responder sua pergunta ou incidental. “Qual a alíquota de imposto em Curitiba?” mantém “Curitiba”; o nome de um colega citado de passagem é trocado.",
  },
  {
    n: "03",
    title: "Substituir",
    desc: "Detalhes incidentais são trocados por substitutos realistas — nomes e cidades fictícios de verdade, nunca [REDACTED] — pra que o modelo na nuvem veja um prompt coerente e respondível.",
  },
  {
    n: "04",
    title: "Reidratar",
    desc: "Quando a resposta volta, os substitutos são mapeados de volta pras suas entidades reais, localmente. A resposta se lê como se nada tivesse sido alterado — porque, pra você, nada foi.",
  },
];

const pilares = [
  {
    title: "Privacidade por arquitetura",
    desc: "Não é uma promessa de política de privacidade — é estrutura. O dado pessoal não vaza porque nunca sai da sua máquina. Os dois modelos de detecção rodam 100% localmente, via Ollama.",
  },
  {
    title: "Respostas que continuam úteis",
    desc: "Redação bruta quebra a resposta: apague a cidade de uma pergunta sobre lei local e a IA não consegue ajudar. O modelo de relevância mantém o que a resposta genuinamente precisa e troca só o resto.",
  },
  {
    title: "Software livre, tropicalizado",
    desc: "Código aberto sob licença MIT, adaptado pro Brasil: detecção de CPF, CNPJ, CEP e telefone brasileiro que o pipeline original, centrado nos EUA, não cobria.",
  },
];

export default function PaxMantlePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section
          className="grid-lines relative bg-mist pt-[140px] pb-16 lg:pt-[180px] lg:pb-24"
          style={{ "--grid-line-color": "#463C2E4D" } as React.CSSProperties}
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 relative z-[1]">
            <div className="lg:w-3/5 px-5 lg:px-10 flex flex-col gap-6">
              <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5 text-bark/70">
                Projeto · Software livre
              </div>
              <h1 className="text-h3 font-heading text-bark">Pax Mantle</h1>
              <p className="text-paragraphs text-bark/70 max-w-[640px]">
                Converse com IAs de nuvem sem entregar quem você é. Um modelo rodando no seu
                próprio computador detecta seus dados pessoais, troca por substitutos realistas
                antes de o prompt sair da máquina — e traduz a resposta de volta pro seu mundo real.
              </p>
            </div>
            <div className="lg:w-2/5 px-5 lg:px-10 flex flex-col gap-4 justify-end">
              <GitHubCommandButton />
            </div>
          </div>
        </section>

        {/* Statement */}
        <section className="bg-bark py-20 lg:py-28 px-5 lg:px-10">
          <p className="text-h3 font-heading text-mist max-w-[1000px]">
            Toda pergunta pessoal feita a uma IA é um dado entregue a um servidor de outro país.{" "}
            <span className="text-khaki">Não precisa ser assim.</span>
          </p>
        </section>

        {/* Illustration */}
        <section
          className="grid-lines relative bg-mist py-20"
          style={{ "--grid-line-color": "#463C2E4D" } as React.CSSProperties}
        >
          <div className="px-5 lg:px-10 relative z-[1] flex flex-col gap-10">
            <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5 text-bark/70">
              O pipeline
            </div>
            <div className="overflow-hidden border-[0.5px] border-bark/40 bg-sand/30 shadow-md">
              <div className="grid grid-cols-3 border-b-[0.5px] border-bark/25 bg-mist font-mono text-[10px] uppercase tracking-[0.08em] text-bark/65 sm:text-xs">
                <div className="border-r-[0.5px] border-bark/20 px-3 py-3 sm:px-5">Seu computador</div>
                <div className="border-r-[0.5px] border-bark/20 px-3 py-3 text-center sm:px-5">Pax Mantle · local</div>
                <div className="px-3 py-3 text-right sm:px-5">IA na nuvem</div>
              </div>
              <Image
                src="/images/pax-mantle-pipeline-functional-v1.png"
                alt="Um único computador envia o prompt para o Pax Mantle, que troca dados pessoais vermelhos por substitutos azuis antes de chegar à IA na nuvem. A resposta volta pela faixa inferior e os dados reais são restaurados localmente."
                width={1775}
                height={886}
                sizes="(min-width: 1024px) calc(100vw - 80px), calc(100vw - 40px)"
                className="h-auto w-full"
              />
              <ol className="grid grid-cols-1 border-t-[0.5px] border-bark/25 bg-mist sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["01", "Detecta", "O prompt entra com dados pessoais em vermelho."],
                  ["02", "Substitui", "Só os dados sensíveis viram substitutos azuis."],
                  ["03", "Consulta", "A nuvem recebe um prompt coerente e protegido."],
                  ["04", "Restaura", "Na volta, os dados reais reaparecem localmente."],
                ].map(([n, title, desc], index) => (
                  <li
                    key={n}
                    className={`flex gap-3 px-4 py-4 ${index > 0 ? "border-t-[0.5px] border-bark/20 sm:border-l-[0.5px] sm:border-t-0" : ""} ${index === 2 ? "sm:border-l-0 lg:border-l-[0.5px]" : ""}`}
                  >
                    <span className="font-mono text-xs text-clay">{n}</span>
                    <span className="flex flex-col gap-1">
                      <strong className="font-mono text-xs uppercase font-normal text-bark">{title}</strong>
                      <span className="text-xs leading-relaxed text-bark/55">{desc}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-accents font-mono uppercase text-bark/40 max-w-[720px]">
              A substituição de ida e volta é o diferencial: a nuvem vê um prompt coerente,
              você recebe uma resposta real — e o dado pessoal nunca saiu do seu computador.
            </p>
          </div>
        </section>

        {/* Como funciona */}
        <section
          id="como-funciona"
          className="grid-lines relative bg-sand py-20 scroll-mt-24"
          style={{ "--grid-line-color": "#463C2E4D" } as React.CSSProperties}
        >
          <div className="px-5 lg:px-10 relative z-[1] flex flex-col gap-10">
            <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5 text-bark/70">
              Como funciona
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              {passos.map((p) => (
                <div
                  key={p.n}
                  className="bg-mist border-[0.5px] border-bark p-5 flex flex-col gap-5"
                >
                  <div className="font-mono text-accents text-clay">{p.n}</div>
                  <div className="text-paragraphs font-heading text-bark">{p.title}</div>
                  <p className="text-sm leading-relaxed text-bark/60">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que importa */}
        <section
          className="grid-lines relative bg-mist py-20"
          style={{ "--grid-line-color": "#463C2E4D" } as React.CSSProperties}
        >
          <div className="px-5 lg:px-10 relative z-[1] flex flex-col gap-10">
            <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5 text-bark/70">
              Por que importa
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10">
              {pilares.map((p) => (
                <div key={p.title} className="flex flex-col gap-4">
                  <div className="text-paragraphs font-heading text-bark">{p.title}</div>
                  <p
                    className="text-sm leading-relaxed text-bark/60 pb-5"
                    style={{
                      borderBottom: "0.5px solid",
                      borderImage:
                        "repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1",
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specs + GitHub */}
        <section className="bg-bark py-20 px-5 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
            <div className="lg:w-3/5 flex flex-col gap-6">
              <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5 text-mist/70">
                Ficha técnica
              </div>
              <dl className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4 max-w-[720px]">
                {[
                  ["Detecção local", "2 modelos de 3B rodando via Ollama"],
                  ["Formatos brasileiros", "CPF · CNPJ · CEP · telefone com DDD"],
                  ["Provedores", "Anthropic e OpenAI, com a sua própria chave"],
                  ["Licença", "MIT — código aberto, auditável"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 border-b-[0.5px] border-mist/20 pb-4">
                    <dt className="font-mono uppercase text-accents text-mist/50">{k}</dt>
                    <dd className="text-mist text-sm leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:w-2/5 flex flex-col gap-4 justify-end lg:pl-10">
              <GitHubCommandButton />
            </div>
          </div>
        </section>

        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
