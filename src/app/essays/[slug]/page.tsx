"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";

const essaysData: Record<
  string,
  {
    title: string;
    date: string;
    category: string;
    intro: string;
    sections: { heading: string; content: string[] }[];
  }
> = {
  "its-time-to-build": {
    title: "É Hora de Construir",
    date: "22 de Abril de 2026",
    category: "Indústria",
    intro:
      "A Pax Brasiliana é um movimento para reacender a indústria, a criatividade e a ambição brasileira. Este ensaio é uma introdução à nossa missão e ao nosso chamado.",
    sections: [
      {
        heading: "O velho sonho brasileiro acabou",
        content: [
          "Por décadas, o Brasil se contentou com um modelo simples: exportar matérias-primas, importar produtos acabados e esperar que o ciclo de commodities financiasse o bem-estar social. Esse modelo está esgotado.",
          "O velho sonho era ter um emprego público estável, um apartamento financiado em 30 anos e uma aposentadoria do INSS. Não havia espaço para ambição produtiva, para criação de empresas transformadoras ou para pensar em décadas.",
          "Precisamos de um novo sonho. Um sonho de construção.",
        ],
      },
      {
        heading: "Por que construir importa",
        content: [
          "Construir não é apenas sobre fábricas e infraestrutura — embora precisemos desesperadamente de ambos. Construir é sobre criar valor real na economia: produtos que o mundo quer comprar, tecnologias que resolvem problemas reais, instituições que funcionam.",
          "Cada vez que o Brasil exporta soja em grão em vez de proteína processada, exporta minério em vez de aço especial, ou exporta código em vez de produtos de software, estamos abrindo mão de valor — e de empregos de alta qualidade.",
          "A reindustrialização não é nostalgia. É estratégia de sobrevivência em um mundo onde a capacidade produtiva define poder geopolítico.",
        ],
      },
      {
        heading: "O que significa ser um construtor",
        content: [
          "Construtores são pessoas que transformam ideias em realidade. São os fundadores que abrem fábricas, os engenheiros que projetam pontes, os pesquisadores que criam patentes, os artesãos que fabricam com excelência.",
          "Ser construtor no Brasil exige coragem. A burocracia pune quem tenta. O sistema financeiro favorece quem especula. A cultura celebra quem critica, não quem cria.",
          "A Pax Brasiliana existe para mudar isso. Para criar uma comunidade onde construtores se apoiam, onde a ambição é celebrada e onde o fracasso é visto como aprendizado — não como vergonha.",
        ],
      },
      {
        heading: "Como participar",
        content: [
          "O movimento é aberto a todos que compartilham a crença de que o Brasil pode ser mais. Não importa se você é engenheiro, artista, empreendedor ou estudante. O que importa é a disposição para agir.",
          "Participe dos nossos eventos. Contribua com ensaios. Desenvolva projetos. Use nossas ferramentas. Compartilhe com pessoas que pensam como você.",
          "Ou simplesmente comece a construir algo. Qualquer coisa. O ato de criar é em si um ato de resistência contra a estagnação.",
        ],
      },
      {
        heading: "O futuro é brasileiro",
        content: [
          "Temos 210 milhões de pessoas, a maior biodiversidade do planeta, a matriz energética mais limpa entre as grandes economias, terras férteis ilimitadas e uma criatividade cultural que o mundo inteiro inveja.",
          "Falta-nos apenas uma coisa: a decisão coletiva de usar tudo isso para construir algo grandioso.",
          "Essa decisão começa agora. Começa com você. É hora de construir o Brasil.",
        ],
      },
    ],
  },
  "the-old-dream-is-dead": {
    title: "O Velho Sonho Brasileiro Acabou",
    date: "15 de Abril de 2026",
    category: "Cultura",
    intro:
      "Podemos honrar nosso passado sem viver nele. O futuro pertence a quem o constrói.",
    sections: [
      {
        heading: "O modelo esgotado",
        content: [
          "O sonho brasileiro do século XX era simples e previsível: concurso público, imóvel próprio, aposentadoria integral. Um contrato social baseado na estabilidade — que funcionou enquanto o Estado podia financiá-lo.",
          "Mas esse modelo criou uma sociedade avessa ao risco, onde empreender é loucura, inovar é perigoso e questionar é insubordinação. Uma sociedade que premia a conformidade e pune a ambição.",
        ],
      },
      {
        heading: "O custo da inação",
        content: [
          "Enquanto nos contentávamos com o 'jeitinho', o mundo se reindustrializou. A China construiu a maior capacidade manufatureira da história. A Índia formou milhões de engenheiros. Até a Austrália — um país de 26 milhões — decidiu que ser uma mina a céu aberto não era futuro suficiente.",
          "O Brasil, com seu território continental e sua população jovem, ficou para trás. Não por falta de recursos, mas por falta de ambição coletiva.",
        ],
      },
      {
        heading: "Um novo contrato",
        content: [
          "O novo sonho brasileiro não é sobre segurança — é sobre possibilidade. É sobre criar um país onde qualquer pessoa com talento e determinação pode construir algo significativo, sem pedir permissão ao Estado ou proteção aos cartórios.",
          "É sobre merecer nosso território, nossos recursos e nosso potencial. É sobre deixar para nossos filhos um país melhor do que encontramos — não apenas um país que funciona, mas um país que inspira.",
        ],
      },
    ],
  },
  "manufacturing-renaissance": {
    title: "Um Renascimento Industrial",
    date: "8 de Abril de 2026",
    category: "Indústria",
    intro:
      "Como reconstruir a indústria local e criar prosperidade real para pessoas comuns.",
    sections: [
      {
        heading: "O estado da manufatura brasileira",
        content: [
          "A participação da indústria no PIB brasileiro caiu de 35% nos anos 1980 para menos de 11% hoje. Não foi uma transição natural para uma economia de serviços — foi desindustrialização prematura causada por juros altos, câmbio apreciado e infraestrutura precária.",
          "Mas a capacidade não desapareceu completamente. A WEG exporta motores para 135 países. A Embraer fabrica os melhores jatos regionais do mundo. A Gerdau opera siderúrgicas em 10 países. O Brasil sabe fabricar — apenas esqueceu como priorizar isso.",
        ],
      },
      {
        heading: "Setores estratégicos",
        content: [
          "A reindustrialização não precisa ser genérica. O Brasil tem vantagens naturais em setores específicos: energia limpa (hidrogênio verde no Nordeste), defesa (Embraer, Taurus, Avibras), agtech (drones, bioinsumos, agricultura de precisão), minerais críticos (lítio, nióbio, terras raras) e biotecnologia.",
          "O caminho é focar: escolher 5-7 setores onde temos vantagem real e criar condições para que empresas cresçam, exportem e gerem empregos de alta qualidade.",
        ],
      },
      {
        heading: "O papel da comunidade",
        content: [
          "Governos criam condições. Mas quem constrói são pessoas. Engenheiros, operários, fundadores, investidores. A Pax Brasiliana mapeia quem já constrói, conecta quem quer começar e dá visibilidade para quem merece.",
          "Nosso projeto 'O que o Brasil pode construir?' é um primeiro passo: um mapa da capacidade produtiva brasileira que mostra o que já fazemos, o que poderíamos fazer e onde estão as lacunas.",
        ],
      },
    ],
  },
  "sovereign-capability": {
    title: "Capacidade Soberana Importa",
    date: "1 de Abril de 2026",
    category: "Indústria",
    intro:
      "Por que ser dono da nossa infraestrutura crítica não é opcional — é existencial.",
    sections: [
      {
        heading: "Lições da pandemia e da guerra",
        content: [
          "A COVID-19 mostrou o que acontece quando um país depende de cadeias globais para insumos críticos. O Brasil não conseguia fabricar seringas, respiradores ou IFA de vacinas em volume suficiente. A guerra na Ucrânia expôs nossa dependência de fertilizantes russos — 85% do que consumimos é importado.",
          "Soberania produtiva não é autarquia. É ter a capacidade de produzir o essencial quando o mundo entra em crise.",
        ],
      },
      {
        heading: "O que é infraestrutura crítica",
        content: [
          "Energia, alimentação, defesa, telecomunicações, saúde, semicondutores. São os setores que, se interrompidos, paralisam um país. O Brasil é autossuficiente em energia e alimentos — mas depende do exterior para quase todo o resto.",
          "Fertilizantes, baterias, chips, fármacos, satélites, veículos de lançamento. Cada um desses representa uma vulnerabilidade estratégica que precisa ser endereçada em décadas, não em mandatos.",
        ],
      },
      {
        heading: "Construir capacidade leva tempo",
        content: [
          "A Embraer levou 40 anos para se tornar líder mundial em jatos regionais. A Petrobras levou 30 anos para dominar a exploração em águas profundas. Capacidade soberana é um projeto de geração — e por isso mesmo precisa começar agora.",
          "A Pax Brasiliana acompanha e mapeia essas capacidades. Nosso rastreador de empresas da B3 e nosso banco de produtos nacionais são ferramentas para entender onde estamos e para onde precisamos ir.",
        ],
      },
    ],
  },
  "dream-bigger": {
    title: "Sonhe Mais Alto",
    date: "25 de Março de 2026",
    category: "Cultura",
    intro:
      "Rejeitamos a narrativa de que nossos melhores dias ficaram para trás. Ambição é um recurso nacional.",
    sections: [
      {
        heading: "A cultura do 'não vai dar certo'",
        content: [
          "O Brasil desenvolveu uma cultura do pessimismo informado. Pessoas inteligentes competem para explicar por que nada funciona, por que toda tentativa vai falhar, por que o país é inviável. É sofisticado. É convincente. E é profundamente destrutivo.",
          "Porque quando todo mundo acredita que não vai dar certo, ninguém tenta. E quando ninguém tenta, de fato nada muda. A profecia se auto-realiza.",
        ],
      },
      {
        heading: "Ambição como ato de resistência",
        content: [
          "Sonhar alto no Brasil é um ato de coragem. É ir contra a corrente de conformismo, é ignorar os 'realistas' que nunca construíram nada, é aceitar o risco de falhar em público.",
          "Precisamos de mais pessoas dispostas a dizer: 'E se o Brasil tivesse uma indústria de semicondutores? E se lançássemos satélites próprios? E se nossas cidades fossem as mais bonitas do mundo?' Não como fantasia — como projeto.",
        ],
      },
      {
        heading: "O que precisamos construir",
        content: [
          "Fábricas de baterias. Reatores nucleares modulares. Ferrovias transcontinentais. Cidades planejadas com arquitetura digna. Universidades de pesquisa de classe mundial. Empresas de tecnologia que dominem mercados globais.",
          "Nada disso é impossível. Cada item dessa lista já foi realizado por países com menos recursos que o Brasil. A diferença entre nós e eles é apenas uma: eles decidiram fazer.",
        ],
      },
    ],
  },
  "fair-go-restored": {
    title: "Restaurando a Oportunidade Justa",
    date: "18 de Março de 2026",
    category: "Cultura",
    intro:
      "A oportunidade justa nunca foi sobre esmolas. Era sobre oportunidade. Vamos trazê-la de volta.",
    sections: [
      {
        heading: "O que era a oportunidade justa",
        content: [
          "No Brasil de décadas passadas, existia uma promessa implícita: quem trabalha duro prospera. Um operário podia comprar uma casa, criar filhos e ver uma melhora de vida a cada geração. Essa promessa se rompeu.",
          "Hoje, trabalhar duro muitas vezes não é suficiente. Os custos de moradia explodiram. A educação pública se degradou. As oportunidades se concentraram nas mãos de quem já tem capital. O elevador social parou.",
        ],
      },
      {
        heading: "Restaurar pela via da produção",
        content: [
          "A oportunidade justa não volta por decreto ou redistribuição. Volta quando a economia cria empregos bons em quantidade — e empregos bons vêm de empresas produtivas, de fábricas modernas, de obras de infraestrutura, de indústrias que exportam.",
          "Cada fábrica que abre cria centenas de empregos diretos e milhares indiretos. Cada ferrovia construída reduz o custo de tudo. Cada empresa de tecnologia que cresce forma engenheiros e paga salários competitivos.",
        ],
      },
      {
        heading: "Construção como justiça social",
        content: [
          "A verdadeira política social é uma política de empregos. E a verdadeira política de empregos é uma política industrial. Quando o Brasil construir mais, mais brasileiros terão acesso a trabalho digno, renda crescente e mobilidade social.",
          "A Pax Brasiliana acredita que construir é a forma mais eficaz de restaurar a oportunidade justa — não como caridade, mas como consequência natural de uma economia que funciona.",
        ],
      },
    ],
  },
};

export default function EssayDetailPage() {
  useScrollReveal();
  const params = useParams();
  const slug = params.slug as string;
  const essay = essaysData[slug];

  if (!essay) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F8F6E8] flex items-center justify-center">
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
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F8F6E8]">
        {/* Hero */}
        <section className="pt-32 pb-16 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="max-w-[800px] mx-auto">
            <Link
              href="/ensaios"
              className="text-accents text-[#463C2E]/50 mb-10 inline-flex items-center gap-2 link-underline pb-1 transition-opacity duration-300 hover:opacity-60"
            >
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                className="rotate-180"
              >
                <path
                  d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z"
                  fill="currentColor"
                />
              </svg>
              VOLTAR
            </Link>

            <h1
              className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-[#463C2E] font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {essay.title}
            </h1>

            <div className="flex items-center gap-4 mt-8">
              <div
                className="bg-[#c3be92] h-10 w-10"
                aria-hidden
              />
              <div>
                <p
                  className="text-accents text-[#463C2E]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  PAX BRASILIANA
                </p>
                <p
                  className="text-accents text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {essay.date}
                </p>
              </div>
            </div>

            <p className="mt-8 text-[#463C2E]/70 text-[14px] lg:text-[16px] leading-[140%] max-w-[600px]">
              {essay.intro}
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="px-5 lg:px-10 py-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="max-w-[800px] mx-auto">
            <p
              className="text-accents text-[#463C2E]/50 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ÍNDICE
            </p>
            <nav className="flex flex-col gap-2">
              {essay.sections.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  className="text-[14px] lg:text-[16px] text-[#463C2E]/70 hover:text-[#463C2E] transition-colors duration-200"
                >
                  {i + 1}. {s.heading}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Content */}
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

        {/* CTA */}
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
              className="mt-6 inline-flex items-center gap-2 bg-[#463C2E] text-[#F8F6E8] text-[12px] tracking-[-0.06em] uppercase px-4 py-3.5 transition-opacity duration-300 hover:opacity-80"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              PARTICIPE
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
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
    </>
  );
}
