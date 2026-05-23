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
  "o-brasil-que-pode-ser": {
    title: "O Brasil que pode ser",
    date: "21 Maio 2026",
    category: "Indústria",
    intro:
      "Uma visão de um país que fabrica, exporta tecnologia e lidera os setores do futuro. Por que não nós?",
    sections: [
      {
        heading: "Além das commodities",
        content: [
          "O Brasil é a nona economia do mundo, mas sua participação industrial no PIB caiu para menos de 11%. Exportamos soja, minério e petróleo bruto enquanto importamos fertilizantes, baterias e semicondutores. Esse modelo não é destino — é escolha.",
          "Países com menos recursos que o Brasil construíram indústrias sofisticadas em uma geração. A Coreia do Sul saiu de uma guerra civil para se tornar líder em semicondutores e construção naval. Israel, sem água nem território, exporta tecnologia de irrigação para o mundo. O que nos falta não é capacidade — é decisão.",
          "O Brasil que pode ser é um país que transforma suas vantagens naturais em produtos acabados de alto valor. Que exporta aviões, não apenas minério. Que vende software, não apenas tempo de programador.",
        ],
      },
      {
        heading: "As vantagens que já temos",
        content: [
          "O Brasil possui a maior reserva de terras aráveis do planeta, a matriz energética mais limpa entre grandes economias, reservas estratégicas de nióbio, lítio e terras raras, e uma população jovem e criativa de 210 milhões de pessoas.",
          "A Embraer já provou que podemos competir globalmente em tecnologia de ponta. A WEG exporta motores elétricos para 135 países. O agronegócio brasileiro alimenta um bilhão de pessoas. Essas não são anomalias — são sinais do que é possível em escala.",
        ],
      },
      {
        heading: "O caminho de construção",
        content: [
          "Transformar o Brasil que é no Brasil que pode ser exige três coisas: capital paciente direcionado à indústria produtiva, desburocratização radical que libere empreendedores, e uma mudança cultural que celebre quem constrói em vez de quem especula.",
          "Não é um projeto de governo — é um projeto de geração. De engenheiros, fundadores, operários e investidores que decidiram que o status quo não é aceitável. A Pax Brasiliana existe para conectar essas pessoas e dar visibilidade ao que já está sendo construído.",
        ],
      },
    ],
  },
  reindustrializacao: {
    title: "Reindustrialização: não é nostalgia, é necessidade",
    date: "15 Mai 2026",
    category: "Indústria",
    intro:
      "A desindustrialização silenciosa das últimas décadas e o custo real que pagamos hoje.",
    sections: [
      {
        heading: "O esvaziamento silencioso",
        content: [
          "Entre 1985 e 2024, a participação da indústria de transformação no PIB brasileiro caiu de 35% para menos de 11%. Não foi uma transição natural para uma economia de serviços avançados — foi desindustrialização prematura, causada por juros cronicamente altos, câmbio apreciado por fluxos especulativos e infraestrutura logística precária.",
          "O resultado é visível: cidades industriais decadentes no interior de São Paulo, Minas Gerais e Rio Grande do Sul. Fábricas fechadas que viraram galpões vazios. Engenheiros que migraram para o mercado financeiro porque não havia onde exercer sua profissão.",
          "Enquanto isso, a China construiu a maior base manufatureira da história humana. A Índia formou milhões de engenheiros. Até a Austrália — com 26 milhões de habitantes — decidiu que ser mina a céu aberto não era futuro suficiente.",
        ],
      },
      {
        heading: "O custo real da desindustrialização",
        content: [
          "Cada fábrica que fecha elimina não apenas empregos diretos, mas toda uma cadeia de fornecedores, serviços e conhecimento tácito que leva décadas para reconstruir. A desindustrialização não é apenas perda econômica — é perda de capacidade soberana.",
          "Quando a pandemia chegou, o Brasil não conseguia fabricar seringas em volume suficiente. Quando os fertilizantes russos ficaram sob sanções, descobrimos que importávamos 85% do que consumíamos. Cada crise global expõe nossas vulnerabilidades manufatureiras.",
        ],
      },
      {
        heading: "Reindustrializar é estratégia, não nostalgia",
        content: [
          "Ninguém propõe recriar as fábricas dos anos 1970. A nova industrialização é digital, automatizada, verde e integrada a cadeias globais de valor. É a WEG fabricando inversores para energia solar. É a Embraer projetando aviões elétricos. É startups de agtech no Piauí usando drones e inteligência artificial.",
          "O caminho passa por escolher setores estratégicos — energia, defesa, saúde, semicondutores, biotecnologia — e criar as condições para que empresas brasileiras cresçam, exportem e gerem empregos de alta qualidade. Não por protecionismo, mas por competência.",
        ],
      },
    ],
  },
  "herois-que-fabricam": {
    title: "Por que o Brasil não constrói heróis que fabricam?",
    date: "08 Mai 2026",
    category: "Cultura",
    intro:
      "Nossa cultura celebra o especulador e ignora o industrial. Isso precisa mudar.",
    sections: [
      {
        heading: "O panteão invertido",
        content: [
          "Pergunte a um brasileiro quem são os empresários mais admirados do país. As respostas gravitarão para banqueiros, donos de construtoras envolvidas em escândalos, ou celebridades do mercado financeiro que ensinam day trading no YouTube.",
          "Agora pergunte quem fundou a WEG, a maior fabricante de motores elétricos do hemisfério sul. Ou quem criou a Weg, a Tupy, a Romi. Silêncio. Os construtores reais — as pessoas que fabricam coisas que o mundo compra — são invisíveis na narrativa cultural brasileira.",
          "Nos Estados Unidos, Elon Musk é capa de revista por fabricar foguetes e carros elétricos. Na Coreia, os fundadores da Samsung e Hyundai são heróis nacionais. No Brasil, o industrial é visto com desconfiança quando não com desprezo.",
        ],
      },
      {
        heading: "A cultura do rentismo",
        content: [
          "O Brasil criou uma aristocracia financeira que extrai valor sem produzir nada. Com juros reais entre os maiores do mundo, aplicar dinheiro no Tesouro Direto rende mais do que abrir uma fábrica. O incentivo econômico é claro: por que arriscar em produção se a Selic paga 6% real sem esforço?",
          "Essa lógica contaminou a cultura. O 'esperto' é quem vive de renda. O 'otário' é quem abre empresa, paga impostos e emprega gente. Invertemos completamente a hierarquia de valor que sustenta sociedades prósperas.",
        ],
      },
      {
        heading: "Construindo novos heróis",
        content: [
          "A mudança cultural começa por dar visibilidade a quem já constrói. A Pax Brasiliana mapeia e celebra os fabricantes, fundadores e engenheiros que criam valor real na economia brasileira — não porque são perfeitos, mas porque representam o tipo de ambição que o país precisa.",
          "Precisamos que jovens brasileiros cresçam querendo abrir fábricas, projetar pontes e criar tecnologia — não apenas passar em concurso público ou virar influencer. A cultura é o terreno onde a economia cresce ou apodrece.",
        ],
      },
    ],
  },
  "o-que-o-brasil-pode-construir": {
    title: "O que o Brasil pode construir?",
    date: "01 Mai 2026",
    category: "Indústria",
    intro:
      "Um guia das capacidades produtivas brasileiras e onde estão as maiores oportunidades.",
    sections: [
      {
        heading: "Mapeando a capacidade nacional",
        content: [
          "O Brasil fabrica aviões de classe mundial, mas importa trens. Produz satélites experimentais, mas não fabrica chips. Exporta proteína animal para 150 países, mas importa 85% dos fertilizantes que usa. Esse mapa de capacidades e lacunas é o ponto de partida para qualquer estratégia industrial séria.",
          "O projeto 'O que o Brasil pode construir?' da Pax Brasiliana mapeia sistematicamente o que já produzimos, o que poderíamos produzir com investimento incremental, e onde estão as lacunas críticas que precisam ser endereçadas por questão de soberania.",
        ],
      },
      {
        heading: "Setores de oportunidade imediata",
        content: [
          "Energia renovável: o Brasil tem o maior potencial eólico e solar da América Latina, mas importa painéis solares e inversores. Há espaço imediato para fabricação nacional de componentes de energia limpa.",
          "Defesa e aeroespacial: a Embraer, a Avibras e a Taurus provam que temos capacidade. O novo programa de submarinos nucleares e o veículo lançador de satélites representam fronteiras de expansão.",
          "Biotecnologia e saúde: a Fiocruz e o Butantan são referências mundiais em vacinas. A expansão para biofármacos, terapias gênicas e insumos farmacêuticos ativos é uma progressão natural.",
        ],
      },
      {
        heading: "Da importação à exportação",
        content: [
          "Cada produto que o Brasil deixa de importar e passa a fabricar gera três efeitos simultâneos: cria empregos locais, reduz a vulnerabilidade da balança comercial e acumula conhecimento técnico que pode ser exportado.",
          "O caminho de substituição de importações do século XXI não é protecionismo — é competência. É criar condições para que empresas brasileiras produzam com qualidade global a custos competitivos. O primeiro passo é saber exatamente o que importamos e por quê.",
        ],
      },
    ],
  },
  "o-custo-do-cinismo": {
    title: "O custo do cinismo",
    date: "24 Abr 2026",
    category: "Cultura",
    intro:
      "Pessimismo coletivo tem um preço econômico real. Mensurar esse custo é o primeiro passo.",
    sections: [
      {
        heading: "O pessimismo como identidade nacional",
        content: [
          "O Brasil desenvolveu uma forma sofisticada de pessimismo que se confunde com inteligência. Dizer que 'o Brasil não tem jeito' é visto como realismo. Propor soluções ambiciosas é visto como ingenuidade. O cínico é o adulto na sala; o otimista é o tolo.",
          "Essa atitude não é apenas um estado de humor coletivo — é uma força econômica destrutiva. Quando uma sociedade inteira acredita que nada vai funcionar, o custo do fracasso se torna insuportável. Ninguém arrisca, ninguém investe, ninguém tenta. A profecia se auto-realiza.",
        ],
      },
      {
        heading: "O preço econômico mensurável",
        content: [
          "O cinismo coletivo se traduz em dados concretos: taxa de criação de empresas abaixo do potencial, fuga de cérebros de talentos que não veem futuro no país, subinvestimento crônico em P&D (0,7% do PIB versus 2,5% na média da OCDE), e uma aversão ao risco que engessa o mercado de capital de risco.",
          "Estudos de confiança institucional mostram correlação direta entre otimismo social e crescimento econômico. Sociedades que acreditam no futuro investem mais, empreendem mais e cooperam mais. O cinismo brasileiro não é consequência do subdesenvolvimento — é uma de suas causas.",
        ],
      },
      {
        heading: "Otimismo como ato de resistência",
        content: [
          "Acreditar que o Brasil pode ser melhor não é ingenuidade — é a precondição para qualquer mudança. Toda grande transformação nacional começou com um grupo de pessoas que se recusou a aceitar que as coisas eram como tinham que ser.",
          "A Pax Brasiliana propõe um otimismo calibrado: não ignorar os problemas, mas recusar-se a tratá-los como permanentes. Cada fábrica que abre, cada patente registrada, cada empresa que exporta é uma prova de que o cinismo está errado.",
        ],
      },
    ],
  },
  "energia-abundante": {
    title: "Energia abundante como estratégia nacional",
    date: "17 Abr 2026",
    category: "Indústria",
    intro:
      "O Brasil tem o maior potencial de energia renovável do mundo. Ainda não usamos esse trunfo.",
    sections: [
      {
        heading: "A vantagem que não exploramos",
        content: [
          "O Brasil possui a matriz elétrica mais limpa entre as grandes economias: 83% renovável, entre hidrelétrica, eólica, solar e biomassa. O potencial eólico do Nordeste é comparável ao do Mar do Norte europeu. A irradiação solar do semiárido supera a do Saara em algumas regiões.",
          "E no entanto, tratamos energia como commodity, não como vantagem estratégica. Energia abundante e barata é o insumo fundamental de toda indústria moderna — de data centers a fundições de alumínio, de fábricas de hidrogênio verde a processamento de minerais críticos.",
        ],
      },
      {
        heading: "Energia como atração industrial",
        content: [
          "A Islândia, com 380 mil habitantes, atraiu fundições de alumínio do mundo inteiro por um único motivo: energia geotérmica abundante e barata. O Canadá atrai data centers com hidrelétrica. O Brasil tem potencial para fazer ambos — e mais.",
          "Hidrogênio verde é o caso mais promissor. O Nordeste brasileiro pode produzir hidrogênio verde a custos competitivos com o gás natural, atraindo indústrias europeias que precisam descarbonizar suas cadeias. Aço verde, amônia verde, metanol verde — todos possíveis com a energia que já temos.",
        ],
      },
      {
        heading: "De exportador de energia bruta a potência industrial",
        content: [
          "A estratégia é simples em conceito e complexa em execução: usar energia abundante como âncora para atrair e desenvolver cadeias industriais de alto valor. Não exportar petróleo bruto — refinar, petroquimizar, transformar. Não exportar eletricidade — usá-la para fabricar produtos que o mundo precisa.",
          "Isso exige investimento em transmissão, regulação inteligente e visão de longo prazo. Mas a matéria-prima é a melhor do mundo. Falta apenas a decisão de usá-la estrategicamente.",
        ],
      },
    ],
  },
  "empreender-no-brasil": {
    title: "Empreender no Brasil: resistência, não vocação",
    date: "10 Abr 2026",
    category: "Cultura",
    intro:
      "Criar uma empresa no Brasil ainda exige mais coragem do que talento. Por que aceitamos isso?",
    sections: [
      {
        heading: "O labirinto burocrático",
        content: [
          "Abrir uma empresa no Brasil leva em média 17 dias. Na Nova Zelândia, leva meio dia. Fechar uma empresa leva em média 12 anos nos tribunais brasileiros. O sistema tributário tem mais de 60 tributos diferentes, com regras que mudam constantemente e interpretações que variam por estado e município.",
          "Cada empreendedor brasileiro gasta, em média, 1.500 horas por ano apenas cumprindo obrigações tributárias — o equivalente a 187 dias de trabalho. Na Dinamarca, são 130 horas. Não é que os brasileiros sejam menos capazes — é que o sistema consome a energia que deveria ir para inovação.",
        ],
      },
      {
        heading: "Sobreviventes, não empreendedores",
        content: [
          "O Brasil tem uma das maiores taxas de empreendedorismo do mundo, mas a maior parte é por necessidade, não por oportunidade. São pessoas que abrem negócios porque não encontram emprego formal, não porque identificaram uma oportunidade de mercado.",
          "Os empreendedores por oportunidade — os que criam empresas inovadoras, geram empregos qualificados e exportam — enfrentam um ambiente que parece desenhado para desencorajá-los. Juros proibitivos para capital de giro, burocracia kafkiana para exportar, e um sistema jurídico que trata o empresário como suspeito até prova em contrário.",
        ],
      },
      {
        heading: "O que precisaria mudar",
        content: [
          "A reforma não é mistério. Simplificação tributária radical — um imposto, uma alíquota, uma regra. Abertura e fechamento de empresa em 24 horas. Acesso a crédito produtivo a taxas civilizadas. Judiciário que resolva disputas comerciais em meses, não em décadas.",
          "Nenhuma dessas reformas é tecnicamente difícil. Dezenas de países já as implementaram. O que falta é vontade política sustentada e pressão social organizada. A Pax Brasiliana acredita que essa pressão começa com visibilidade: mostrar quanto custa a inação e quanto ganha quem reforma.",
        ],
      },
    ],
  },
};

export default function EnsaioDetailPage() {
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
              <div className="bg-[#c3be92] h-10 w-10" aria-hidden />
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
