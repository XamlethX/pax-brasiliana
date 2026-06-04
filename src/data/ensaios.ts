export type EnsaioCategoria =
  | "industria"
  | "cultura"
  | "economia"
  | "energia";

export interface EnsaioSection {
  heading: string;
  content: string[];
}

export interface Ensaio {
  slug: string;
  title: string;
  /** Short summary used in cards and meta descriptions. */
  desc: string;
  author: string;
  /** Display date, e.g. "15 Mai 2026". */
  date: string;
  /** ISO date for <time>, sitemap and structured data. */
  isoDate: string;
  category: EnsaioCategoria;
  categoryLabel: string;
  image: string;
  /** Lead paragraph shown under the title. */
  intro: string;
  sections: EnsaioSection[];
}

export const ensaios: Ensaio[] = [
  {
    slug: "construida-nao-herdada",
    title: "A Pax Brasiliana será construída, não herdada",
    desc: "O Brasil não parou de construir por falta de recurso, mas por falta de crença. Por que o futuro não virá da abundância que já temos, e sim da decisão de criar o que ainda não existe.",
    author: "Pax Brasiliana",
    date: "04 Jun 2026",
    isoDate: "2026-06-04",
    category: "cultura",
    categoryLabel: "Cultura",
    image: "/images/cidade-futura.png",
    intro:
      "Olhamos para o estado das nossas instituições, para nosso lugar no mundo, para nossa cultura, e a pergunta retorna: é isso? Temos a maior bacia hidrográfica do planeta. A maior floresta tropical. Uma das demografias mais jovens do hemisfério. E produzimos, sistematicamente, uma elite que imita em vez de inventar e instituições que gerem em vez de construir.",
    sections: [
      {
        heading: "O país que parou de construir",
        content: [
          "Gerações inteiras aprenderam que a riqueza do Brasil já está dada, debaixo da terra, no meio da floresta, no clima generoso, e que basta administrá-la. Mas herança não constrói civilização. Herança é ponto de partida, não destino.",
          "Houve um tempo em que o Brasil sabia construir. No século XIX, o Barão de Mauá construiu estradas de ferro, estaleiros, bancos e linhas de telégrafo num país de economia escravocrata que não queria industrializar. Foi sozinho contra a maré e ergueu a primeira centelha industrial do Brasil. Um século depois, engenheiros brasileiros fundaram a Embraer do zero e a transformaram na terceira maior fabricante de aeronaves comerciais do mundo, competindo de igual para igual com gigantes americanos e europeus.",
          "Construíram Itaipu, por décadas a maior hidrelétrica do mundo em geração de energia. A Embrapa pegou 60 milhões de hectares de cerrado que o mundo inteiro chamava de terra infértil e os transformou no celeiro tropical do planeta, num dos feitos científicos mais subestimados da história moderna. E quando o petróleo foi descoberto a quilômetros de profundidade sob o oceano, o Brasil desenvolveu tecnologia de extração em águas ultra-profundas que não existia em lugar nenhum do mundo.",
          "O Brasil já foi um país que construía. Que olhava para o que não existia e decidia fazer existir. E então parou. Não de uma vez. Aos poucos. O país descobriu que era mais fácil extrair do que produzir. Mais seguro comprar imóvel do que fundar empresa. Mais racional viver de juros do que investir em tecnologia.",
          "O rentismo, essa lógica de acumular sobre o que já existe em vez de criar o que ainda não existe, foi se tornando o modelo de prosperidade dominante. A ambição que antes mirava o longo prazo passou a mirar o próximo ciclo eleitoral. A cultura que antes celebrava o engenheiro e o inventor passou a celebrar o irônico e o cético. O Brasil não parou de construir por falta de recurso. Parou por falta de crença, e a crença foi assassinada sistematicamente por uma cultura que aprendeu a punir a ambição.",
        ],
      },
      {
        heading: "A armadilha do cinismo",
        content: [
          "Existe um problema mais fundo que a burocracia, mais difícil de consertar que a taxa de juros. Alguém anuncia que vai construir algo grande. A primeira reação coletiva não é curiosidade nem apoio. É ceticismo performático. “Isso nunca vai funcionar aqui.” “Você não conhece o Brasil.” “Já tentaram antes.” Duvidar é visto como inteligência. Acreditar é visto como ingenuidade.",
          "O resultado é que o brasileiro com alta capacidade aprende cedo que ambição é risco social. Que sonhar em voz alta é se expor ao ridículo. Que o caminho mais seguro é a ironia preventiva, duvidar de tudo antes que o fracasso prove que você estava errado.",
          "Isso tem nome em outras culturas: tall poppy syndrome, a tendência de cortar quem cresce além do esperado. No Brasil, a versão é mais elegante e por isso mais perigosa, porque vem embrulhada em sofisticação. Não é inveja declarada. É “realismo”. É “experiência de vida”. É a voz que diz que você está sendo ingênuo quando, na verdade, está sendo corajoso.",
          "E assim, sistematicamente, o país desperdiça sua própria energia. A forma mais visível desse desperdício tem endereço: Boston, Londres, San Francisco, Lisboa. São os brasileiros extraordinários que foram embora, não por falta de amor ao país, mas porque o país não soube acolher o que eles tinham para oferecer. Cada um deles levou consigo exatamente o que o Brasil mais precisa: a disposição de construir algo que ainda não existe.",
          "Não é culpa individual. É o produto de décadas de inflação que destruiu o planejamento de longo prazo, de ciclos políticos que ensinaram que o esforço pode ser apagado por um decreto, de uma burocracia que trata o empreendedor como suspeito por padrão. O sistema treinou o brasileiro para a baixa agência, para encarar o mundo como algo que acontece com ele, não como algo que ele pode mudar. A armadilha não é a abundância. A armadilha é ter aprendido a não acreditar que pode construir algo com ela.",
        ],
      },
      {
        heading: "O que significa construir",
        content: [
          "Construir não é só erguer prédios ou montar fábricas. Construir é uma postura. É decidir que o mundo pode ser diferente do que é e agir como se essa diferença dependesse de você. É o que separa as pessoas que comentam das que fazem: agência.",
          "Pessoas de alta agência encaram obstáculos como variáveis a resolver. Quando algo está errado, perguntam o que podem fazer para mudar. Não porque sejam ingênuas sobre as dificuldades, mas porque recusam a dificuldade como veredicto final.",
          "Pessoas de baixa agência tratam obstáculos como confirmação. O sistema é grande demais, o problema é complexo demais, o momento é errado demais. E assim nunca agem, e nunca erram, porque nunca tentam.",
        ],
      },
      {
        heading: "O sonho que precisa ser construído",
        content: [
          "Existe um país com o maior sistema de água doce do planeta. Com o potencial energético mais promissor. Com território continental, biodiversidade sem par e 200 milhões de pessoas jovens e criativas. Um país que já demonstrou, várias vezes, que sabe construir coisas extraordinárias quando decide fazê-lo. Esse potencial não é motivo de orgulho passivo. É uma responsabilidade ativa.",
          "O Brasil pode ter indústria de ponta, pesquisa que compete com os melhores do mundo, cidades planejadas para pessoas, infraestrutura que não envergonha, uma geração formada para inventar em vez de copiar. Tudo isso já foi feito por países com menos do que o Brasil tem. A diferença nunca foi o recurso. Foi a decisão de construir e a cultura que sustenta essa decisão ao longo do tempo.",
          "Roma não se tornou Roma por acidente. Tornou-se Roma porque decidiu, repetidamente, construir além do que parecia necessário: estradas, aquedutos, leis, instituições, língua. O legado não foi a conquista militar. Foi a civilização que ficou depois.",
          "O Brasil tem o perfil geográfico, demográfico e cultural de um hegemon civilizacional para o século XXI. Território que nenhuma potência rival pode ameaçar. Recursos que o mundo vai precisar cada vez mais. Uma população jovem num mundo que envelhece. Uma posição no hemisfério sul que o coloca fora dos principais eixos de conflito geopolítico. Isso é uma vantagem estrutural que precisa ser convertida em projeto.",
          "E o resultado final desse projeto não é abstrato. É concreto e humano: um Brasil onde as famílias prosperam. Onde trabalhar duro constrói patrimônio, não só sobrevivência. Onde a ambição não é punida, é celebrada, financiada e recompensada.",
        ],
      },
      {
        heading: "O sonho brasileiro não vai aparecer sozinho",
        content: [
          "Não vai brotar da terra junto com a soja. Não vai subir com o preço do minério. Não vai ser aprovado no Congresso nem decretado por nenhum presidente. Vai ser construído. Por pessoas de alta agência que recusam a herança passiva e escolhem a construção ativa. Que olham para o Brasil e enxergam o que ainda pode ser, não só o que já é.",
          "Há um padrão na história que não é coincidência: civilizações inteiras nasceram e pereceram em função do que um grupo pequeno de pessoas muito determinadas decidiu fazer. Os Estados Unidos foram fundados por um punhado de fazendeiros e advogados reunidos na Filadélfia. Atenas pelos discípulos de Sócrates. As navegações por uma corte que cabia em uma sala. O Vale do Silício pelos chamados Traitorous Eight. Antes do programa, vem o pacto. Antes da causa, vem a confiança.",
          "Para isso vão ser necessários milhares de projetos, empresas, fornecedores. Centenas de milhares de empreendedores, engenheiros, criativos e fundadores dispostos a apostar no país. Uma mobilização. O Brasil do século XXI não vai se construir sozinho e não vai se construir aos poucos. Vai exigir o equivalente civil de um programa Apollo: uma geração inteira orientada para um objetivo maior que ela mesma, com a convicção de que o que estão construindo importa e com a capacidade de fazer acontecer.",
          "O Brasil merece isso. E vai ter que conquistar. A Pax Brasiliana será construída, não herdada.",
        ],
      },
    ],
  },
  {
    slug: "reindustrializacao",
    title: "O sonho brasileiro não será herdado, será construído",
    desc: "A desindustrialização silenciosa das últimas décadas e o custo real que pagamos hoje.",
    author: "Pax Brasiliana",
    date: "15 Mai 2026",
    isoDate: "2026-05-15",
    category: "industria",
    categoryLabel: "Indústria",
    image: "/images/laboratorio-robos.png",
    intro:
      "Em 1985, a indústria de transformação respondia por cerca de um quarto do PIB brasileiro. Hoje, esse número beira os 11%. Não houve um colapso dramático, nenhuma data para marcar no calendário — apenas o desmonte lento de uma capacidade que levou gerações para ser construída. Este ensaio é sobre o que perdemos, por que perdemos, e por que recuperar essa capacidade não é saudosismo: é a condição para qualquer futuro próspero.",
    sections: [
      {
        heading: "O encolhimento que ninguém anunciou",
        content: [
          "A desindustrialização brasileira foi precoce e silenciosa. Países ricos viram sua indústria encolher depois de atingir renda alta — o Brasil começou a perder densidade industrial ainda pobre, antes de completar a travessia para o desenvolvimento. Trocamos a complexidade da manufatura pela simplicidade da extração: voltamos a ser, em larga medida, uma economia de commodities.",
          "O problema não é exportar soja, minério ou petróleo. O problema é depender quase exclusivamente disso. Uma economia que só sabe extrair e enviar matéria-prima para que outros transformem está, por definição, capturando a fatia mais magra da cadeia de valor — e exportando junto os empregos qualificados, a pesquisa aplicada e o adensamento tecnológico que a transformação industrial carrega.",
        ],
      },
      {
        heading: "Por que a indústria importa mais do que parece",
        content: [
          "A indústria não é apenas mais um setor ao lado de serviços e agropecuária. Ela é o motor que puxa os demais. É na manufatura que a produtividade cresce mais rápido, que a inovação encontra aplicação concreta, e que se formam as cadeias densas de fornecedores, engenheiros e técnicos que sustentam tudo o mais.",
          "Quando uma fábrica de equipamentos complexos fecha, não se perde só a linha de montagem. Perde-se o ecossistema ao redor dela: as oficinas de precisão, os laboratórios de materiais, os engenheiros que aprenderam a resolver problemas reais, os fornecedores que se especializaram. Esse conhecimento tácito não está em nenhum manual — ele vive nas pessoas e nas organizações, e quando se dispersa, reconstruí-lo custa décadas.",
          "É por isso que países que levam o futuro a sério — dos Estados Unidos à China, da Coreia à Alemanha — voltaram a tratar política industrial como política de Estado. Não por nostalgia, mas porque entenderam que quem não fabrica, não inova; e quem não inova, obedece.",
        ],
      },
      {
        heading: "O custo que já estamos pagando",
        content: [
          "A conta da desindustrialização chega disfarçada. Chega na forma de empregos que não existem, de salários que estagnaram, de uma balança comercial que depende do humor das commodities, e de uma vulnerabilidade estratégica que ficou nua durante a pandemia, quando o país descobriu não saber fabricar insumos básicos.",
          "Chega também na forma de cérebros que partem. Sem indústria sofisticada, não há demanda para engenheiros, cientistas e técnicos de ponta — e eles vão construir o futuro de outros países. A fuga de talentos não é causa, é sintoma: pessoas ambiciosas vão para onde há projetos ambiciosos.",
        ],
      },
      {
        heading: "Reconstruir é uma decisão",
        content: [
          "Nada disso é destino. A reindustrialização não exige um milagre — exige decisão. Capital paciente fluindo para a produção em vez de para a renda fácil. Energia abundante e barata como vantagem competitiva. Um Estado que compra de quem produz aqui e exige contrapartidas tecnológicas. Uma cultura que volte a admirar quem constrói.",
          "O Brasil tem terra, energia, mercado interno e talento. O que falta não é recurso — é a convicção de que ainda somos capazes de fazer coisas difíceis. Reindustrializar é, antes de tudo, recusar a ideia de que nosso lugar na divisão internacional do trabalho é apenas cavar buracos e plantar grãos. É decidir que queremos transformar — e construir o país que isso exige.",
        ],
      },
    ],
  },
];

export function getEnsaio(slug: string): Ensaio | undefined {
  return ensaios.find((e) => e.slug === slug);
}

export const ensaioCategorias: { label: string; value: string }[] = [
  { label: "TODOS", value: "todos" },
  { label: "INDÚSTRIA", value: "industria" },
];
