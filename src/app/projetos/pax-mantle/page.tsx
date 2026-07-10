import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinCTA from "@/components/JoinCTA";

const GITHUB_PAX = "https://github.com/XamlethX";
const GITHUB_UPSTREAM = "https://github.com/Praxis-Society/praxis-cloak";

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

function ArrowIcon({ fill = "#F8F6E8" }: { fill?: string }) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path
        d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z"
        fill={fill}
      />
    </svg>
  );
}

function PipelineIllustration() {
  return (
    <svg
      viewBox="0 0 1120 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagrama do pipeline do Pax Mantle: o prompt passa pela detecção e substituição locais antes de ir pra nuvem, e a resposta é reidratada de volta."
      className="w-full h-auto"
    >
      {/* device boundary */}
      <rect x="20" y="40" width="700" height="480" fill="#E4DECC" fillOpacity="0.35" stroke="#463C2E" strokeWidth="1" strokeDasharray="6 4" />
      <text x="40" y="76" fontFamily="var(--font-mono, monospace)" fontSize="14" letterSpacing="1.5" fill="#463C2E">
        SEU COMPUTADOR
      </text>

      {/* prompt card */}
      <g>
        <rect x="56" y="120" width="240" height="180" fill="#F8F6E8" stroke="#463C2E" strokeWidth="1" />
        <text x="76" y="152" fontFamily="var(--font-mono, monospace)" fontSize="13" letterSpacing="1" fill="#463C2E">SEU PROMPT</text>
        <rect x="76" y="172" width="160" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="76" y="196" width="90" height="12" fill="#F45141" />
        <rect x="174" y="196" width="90" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="76" y="220" width="190" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="76" y="244" width="120" height="12" fill="#F45141" />
        <text x="76" y="284" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#F45141">■ DADO PESSOAL</text>
      </g>

      {/* arrow prompt -> mantle */}
      <line x1="296" y1="210" x2="384" y2="210" stroke="#463C2E" strokeWidth="2" />
      <path d="M376 203 L388 210 L376 217" fill="#463C2E" />

      {/* mantle block */}
      <g>
        <rect x="392" y="104" width="288" height="290" fill="#463C2E" />
        <text x="536" y="142" fontFamily="var(--font-mono, monospace)" fontSize="14" letterSpacing="2" fill="#F8F6E8" textAnchor="middle">PAX MANTLE</text>
        <line x1="416" y1="158" x2="656" y2="158" stroke="#F8F6E8" strokeOpacity="0.3" strokeWidth="1" />
        <text x="416" y="190" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#C3BE92">1 · DETECTA</text>
        <rect x="416" y="202" width="150" height="9" fill="#F45141" />
        <text x="416" y="242" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#C3BE92">2 · DECIDE O QUE FICA</text>
        <rect x="416" y="254" width="72" height="9" fill="#DFCB5A" />
        <rect x="496" y="254" width="72" height="9" fill="#F45141" />
        <text x="416" y="294" fontFamily="var(--font-mono, monospace)" fontSize="12" fill="#C3BE92">3 · SUBSTITUI POR FAKES</text>
        <rect x="416" y="306" width="150" height="9" fill="#417CE5" />
        <text x="416" y="352" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#F8F6E8" fillOpacity="0.65">2 MODELOS LOCAIS · OLLAMA</text>
        <text x="416" y="372" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#F8F6E8" fillOpacity="0.65">NADA SENSÍVEL SAI DAQUI</text>
      </g>

      {/* arrow mantle -> cloud (crossing the boundary) */}
      <line x1="680" y1="210" x2="812" y2="210" stroke="#463C2E" strokeWidth="2" />
      <path d="M804 203 L816 210 L804 217" fill="#463C2E" />
      <text x="748" y="196" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#463C2E" fillOpacity="0.6" textAnchor="middle">PROMPT LIMPO</text>

      {/* cloud card */}
      <g>
        <rect x="820" y="120" width="240" height="180" fill="#E4DECC" stroke="#463C2E" strokeWidth="1" />
        <text x="840" y="152" fontFamily="var(--font-mono, monospace)" fontSize="13" letterSpacing="1" fill="#463C2E">LLM NA NUVEM</text>
        <rect x="840" y="172" width="160" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="840" y="196" width="90" height="12" fill="#417CE5" />
        <rect x="938" y="196" width="90" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="840" y="220" width="190" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="840" y="244" width="120" height="12" fill="#417CE5" />
        <text x="840" y="284" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#417CE5">■ SUBSTITUTO REALISTA</text>
      </g>

      {/* return path: cloud -> rehydrate -> answer */}
      <line x1="940" y1="300" x2="940" y2="452" stroke="#463C2E" strokeWidth="2" />
      <line x1="940" y1="452" x2="316" y2="452" stroke="#463C2E" strokeWidth="2" />
      <path d="M324 445 L312 452 L324 459" fill="#463C2E" />
      <text x="748" y="440" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#463C2E" fillOpacity="0.6" textAnchor="middle">RESPOSTA VOLTA</text>

      {/* rehydration station on the return path, inside the device */}
      <g>
        <rect x="392" y="420" width="288" height="64" fill="#417CE5" />
        <text x="536" y="448" fontFamily="var(--font-mono, monospace)" fontSize="12" letterSpacing="1.5" fill="#F8F6E8" textAnchor="middle">4 · REIDRATA LOCALMENTE</text>
        <text x="536" y="468" fontFamily="var(--font-mono, monospace)" fontSize="11" fill="#F8F6E8" fillOpacity="0.8" textAnchor="middle">fakes → suas entidades reais</text>
      </g>

      {/* answer card */}
      <g>
        <rect x="56" y="404" width="240" height="96" fill="#F8F6E8" stroke="#463C2E" strokeWidth="1" />
        <text x="76" y="434" fontFamily="var(--font-mono, monospace)" fontSize="13" letterSpacing="1" fill="#463C2E">SUA RESPOSTA</text>
        <rect x="76" y="452" width="160" height="12" fill="#463C2E" fillOpacity="0.25" />
        <rect x="76" y="476" width="90" height="12" fill="#F45141" />
        <rect x="174" y="476" width="60" height="12" fill="#463C2E" fillOpacity="0.25" />
      </g>
    </svg>
  );
}

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
            <div className="lg:w-2/3 px-5 lg:px-10 flex flex-col gap-6">
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
            <div className="lg:w-1/3 px-5 lg:px-10 flex flex-col gap-4 justify-end">
              <a
                href={GITHUB_PAX}
                target="_blank"
                rel="noreferrer"
                className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center transition-all duration-300 ease-out hover:opacity-80 text-accents text-mist bg-bark w-full justify-between"
              >
                <span>Pax no GitHub</span>
                <ArrowIcon />
              </a>
              <a
                href="#como-funciona"
                className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center transition-all duration-300 ease-out hover:opacity-80 text-accents text-mist bg-coast w-full justify-between"
              >
                <span>Como funciona</span>
                <ArrowIcon />
              </a>
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
            <div className="bg-sand/30 border-[0.5px] border-bark/40 shadow-md p-5 lg:p-10 overflow-x-auto">
              <div className="min-w-[720px]">
                <PipelineIllustration />
              </div>
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
            <div className="lg:w-2/3 flex flex-col gap-6">
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
              <p className="text-sm text-mist/50 max-w-[640px]">
                O Pax Mantle é uma adaptação brasileira, mantida pela Pax, do projeto open source{" "}
                <a
                  href={GITHUB_UPSTREAM}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-mist transition-colors"
                >
                  Cloak (Praxis Society)
                </a>
                , com detecção estendida pra formatos de dados brasileiros e interface em português.
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col gap-4 justify-end lg:pl-10">
              <a
                href={GITHUB_PAX}
                target="_blank"
                rel="noreferrer"
                className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center transition-all duration-300 ease-out hover:opacity-80 text-accents text-bark bg-mist w-full justify-between"
              >
                <span>Ver no GitHub</span>
                <ArrowIcon fill="#463C2E" />
              </a>
            </div>
          </div>
        </section>

        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
