"use client";

import { useState, useMemo, useEffect, type ChangeEvent, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  fabricantes as fabricantesSeed,
  mncIds,
  coordenadasEstados,
  coordenadasCidades,
  setoresBrasileiros,
  estadosBrasileiros,
  type Fabricante,
} from "@/data/fabricantes";

function isMNC(fab: Fabricante) {
  return mncIds.has(fab.id) || fab.origem === "MNC";
}

// ─── Taxonomy ───────────────────────────────────────────────────────────────

const taxonomia = [
  {
    tier: "S",
    rotulo: "Recursos naturais e metais primários",
    secoes: [
      {
        nome: "Extração",
        cor: "#2563eb",
        subcategorias: [
          { nome: "Minério de ferro / bauxita", setores: ["Mineração"], palavras: ["minério de ferro", "bauxita", "mineração"] },
          { nome: "Lítio / nióbio / vanádio", setores: ["Mineração"], palavras: ["lítio", "nióbio", "vanádio", "minerais críticos"] },
          { nome: "Ouro / cobre / zinco / prata", setores: ["Mineração"], palavras: ["ouro", "cobre", "zinco", "prata", "cobalto"] },
          { nome: "Alumínio primário", setores: ["Mineração"], palavras: ["alumínio", "alumínio primário"] },
        ],
      },
      {
        nome: "Processamento Primário",
        cor: "#dc2626",
        subcategorias: [
          { nome: "Siderurgia / aços planos e longos", setores: ["Siderurgia"], palavras: ["aço", "siderurgia", "laminação", "vergalhão"] },
          { nome: "Petróleo / refinamento / petroquímica", setores: ["Energia / Petroquímica", "Petroquímica"], palavras: ["petróleo", "refino", "petroquímica", "combustível"] },
          { nome: "Celulose / papel", setores: ["Celulose e Papel"], palavras: ["celulose", "papel", "eucalipto", "kraftliner"] },
        ],
      },
    ],
  },
  {
    tier: "A",
    rotulo: "Materiais avançados e fabricação crítica",
    secoes: [
      {
        nome: "Materiais Avançados",
        cor: "#059669",
        subcategorias: [
          { nome: "Biopolímeros / plástico verde", setores: ["Petroquímica"], palavras: ["biopolímero", "plástico verde", "polietileno verde", "polipropileno"] },
          { nome: "Compósitos e fibra de carbono", setores: ["Aeroespacial"], palavras: ["compósito", "fibra de carbono", "aeroestruturas compostas"] },
          { nome: "Baterias LFP / chumbo-ácido", setores: ["Baterias"], palavras: ["bateria", "célula", "acumulador", "lfp", "bateria automotiva"] },
          { nome: "Aços especiais e ligas", setores: ["Siderurgia"], palavras: ["aço especial", "ferramenta", "inoxidável", "liga"] },
          { nome: "Química industrial / intermediários", setores: ["Química Industrial"], palavras: ["borracha sintética", "cloro", "soda cáustica", "anidrido", "intermediário químico", "polímero industrial"] },
        ],
      },
      {
        nome: "Fabricação Crítica",
        cor: "#f59e0b",
        subcategorias: [
          { nome: "Vacinas e imunobiológicos", setores: ["Biotecnologia / Saúde"], palavras: ["vacina", "imunobiológico", "biofármaco", "insulina"] },
          { nome: "Farmacêuticos / genéricos", setores: ["Biotecnologia / Saúde"], palavras: ["genérico", "medicamento", "farmacêutico", "insumo farmacêutico"] },
          { nome: "Aeronaves e estruturas aeroespaciais", setores: ["Aeroespacial"], palavras: ["aeronave", "avião", "jato", "helicóptero", "aeroestruturas"] },
          { nome: "Mísseis / foguetes / defesa", setores: ["Aeroespacial", "Defesa"], palavras: ["foguete", "míssil", "artilharia", "astros"] },
        ],
      },
    ],
  },
  {
    tier: "B",
    rotulo: "Conformação, energia e processos",
    secoes: [
      {
        nome: "Conformação",
        cor: "#0891b2",
        subcategorias: [
          { nome: "Fundição / forjaria", setores: ["Fundição"], palavras: ["fundição", "forja", "casting", "fundido"] },
          { nome: "Usinagem CNC / máquinas-ferramentas", setores: ["Máquinas-Ferramentas"], palavras: ["cnc", "usinagem", "torno", "compressor", "máquina-ferramenta"] },
          { nome: "Compressores / equipamentos industriais", setores: ["Compressores / Manufatura"], palavras: ["compressor", "pneumático", "válvula", "bomba"] },
          { nome: "Britagem / processamento mineral", setores: ["Máquinas-Ferramentas"], palavras: ["britagem", "peneira", "britador", "processamento mineral"] },
        ],
      },
      {
        nome: "Sistemas de Energia",
        cor: "#16a34a",
        subcategorias: [
          { nome: "Energia eólica / solar", setores: ["Energia Renovável"], palavras: ["eólica", "solar", "aerogerador", "inversor solar", "parque eólico", "parque solar"] },
          { nome: "Motores / geradores / transformadores", setores: ["Motores Elétricos"], palavras: ["motor elétrico", "gerador", "transformador", "inversores de frequência"] },
          { nome: "Petróleo e gás / refinamento", setores: ["Energia / Petroquímica"], palavras: ["petróleo", "gás natural", "offshore", "pré-sal"] },
          { nome: "Eletrodomésticos / refrigeração", setores: ["Compressores / Manufatura"], palavras: ["geladeira", "lavadora", "fogão", "ar-condicionado", "eletrodoméstico"] },
        ],
      },
    ],
  },
  {
    tier: "C",
    rotulo: "Montagens e manufatura aplicada",
    secoes: [
      {
        nome: "Eletrônica",
        cor: "#db2777",
        subcategorias: [
          { nome: "Computadores / eletrônica de consumo", setores: ["Eletrônica"], palavras: ["computador", "eletrônica", "smartphone", "tablet", "pdv"] },
          { nome: "Equipamentos de segurança / redes", setores: ["Eletrônica"], palavras: ["câmera", "roteador", "segurança eletrônica", "alarme"] },
          { nome: "Telecomunicações / satélites", setores: ["Telecomunicações"], palavras: ["satélite de comunicação", "backbone", "fibra óptica", "satélite geoestacionário"] },
          { nome: "Aviônica / eletrônica embarcada", setores: ["Aeroespacial"], palavras: ["aviônico", "cockpit", "navegação", "display de cockpit"] },
        ],
      },
      {
        nome: "Veículos",
        cor: "#1d4ed8",
        subcategorias: [
          { nome: "Automóveis / montadoras", setores: ["Automotivo"], palavras: ["automóvel", "carro", "veículo", "montadora", "plataforma modular"] },
          { nome: "Ônibus / carrocerias", setores: ["Veículos Pesados"], palavras: ["ônibus", "carroceria", "microônibus", "brt", "articulado"] },
          { nome: "Implementos / veículos pesados", setores: ["Veículos Pesados"], palavras: ["semirreboque", "implemento", "reboque", "caminhão"] },
          { nome: "Autopeças / sistemas de freio", setores: ["Autopeças"], palavras: ["freio", "pastilha", "roda", "autopeça", "câmbio", "rolamento", "pistão"] },
          { nome: "Tratores / colheitadeiras", setores: ["Agronegócio / Equipamentos"], palavras: ["trator", "colheitadeira", "massey", "new holland", "valtra"] },
        ],
      },
      {
        nome: "Defesa",
        cor: "#7c3aed",
        subcategorias: [
          { nome: "Armas de fogo / munições", setores: ["Defesa"], palavras: ["pistola", "revólver", "rifle", "munição", "cartucho", "fuzil"] },
          { nome: "Sistemas de artilharia", setores: ["Defesa"], palavras: ["artilharia", "sistema de armas", "bélico"] },
        ],
      },
    ],
  },
  {
    tier: "D",
    rotulo: "Bens de consumo industrializados",
    secoes: [
      {
        nome: "Alimentos e Bebidas",
        cor: "#84cc16",
        subcategorias: [
          { nome: "Proteína animal / frigoríficos", setores: ["Alimentos"], palavras: ["carne", "frango", "suíno", "frigorífico", "proteína"] },
          { nome: "Bebidas / cervejaria", setores: ["Alimentos"], palavras: ["cerveja", "bebida", "guaraná", "refrigerante"] },
          { nome: "Massas / biscoitos / alimentos processados", setores: ["Alimentos"], palavras: ["macarrão", "biscoito", "arroz", "feijão", "alimento processado"] },
        ],
      },
      {
        nome: "Calçados e Têxtil",
        cor: "#9333ea",
        subcategorias: [
          { nome: "Calçados sintéticos / sandálias", setores: ["Calçados"], palavras: ["sandália", "melissa", "rider", "ipanema", "havaianas"] },
          { nome: "Calçados esportivos / couro", setores: ["Calçados"], palavras: ["calçado esportivo", "olympikus", "couro", "calçado de couro"] },
          { nome: "Fios / tecidos / malha", setores: ["Têxtil"], palavras: ["fio", "tecido", "malha", "denim", "algodão"] },
          { nome: "Confecção / cama mesa banho", setores: ["Têxtil"], palavras: ["camiseta", "toalha", "lençol", "edredom", "confecção"] },
        ],
      },
      {
        nome: "Cosméticos e Móveis",
        cor: "#be185d",
        subcategorias: [
          { nome: "Cosméticos / higiene pessoal", setores: ["Cosméticos / Higiene"], palavras: ["cosmético", "perfume", "creme", "maquiagem", "shampoo", "higiene pessoal"] },
          { nome: "Móveis planejados / residenciais", setores: ["Móveis"], palavras: ["móvel", "cozinha planejada", "dormitório", "armário", "closet"] },
        ],
      },
    ],
  },
  {
    tier: "E",
    rotulo: "Infraestrutura, software e habilitadores",
    secoes: [
      {
        nome: "Software e Automação",
        cor: "#4f46e5",
        subcategorias: [
          { nome: "ERP / software industrial", setores: ["Software Industrial"], palavras: ["erp", "software de manufatura", "wms", "mes"] },
          { nome: "Automação / CLPs / IoT", setores: ["Software Industrial", "Máquinas-Ferramentas"], palavras: ["automação", "clp", "scada", "iot", "controlador"] },
          { nome: "Serviços de TI / transformação digital", setores: ["Software Industrial"], palavras: ["transformação digital", "serviços de ti", "iot industrial"] },
        ],
      },
      {
        nome: "Infraestrutura",
        cor: "#64748b",
        subcategorias: [
          { nome: "Cimento / concreto / materiais", setores: ["Materiais de Construção"], palavras: ["cimento", "concreto", "agregado", "argamassa"] },
          { nome: "Tubos / conexões / construção", setores: ["Materiais de Construção"], palavras: ["tubo", "conexão", "pvc", "telha", "caixa d'água"] },
          { nome: "Equipamentos agrícolas / armazenagem", setores: ["Agronegócio / Equipamentos"], palavras: ["silo", "secador de grãos", "armazenagem", "pulverizador", "implemento agrícola"] },
          { nome: "Logística / obras de infraestrutura", setores: ["Logística", "Construção / Infraestrutura"], palavras: ["logística", "barragem", "rodovia", "obra civil"] },
        ],
      },
    ],
  },
];

// Flat taxonomy for assignment
const taxonomiaFlat = taxonomia.flatMap((tier) =>
  tier.secoes.flatMap((secao) =>
    secao.subcategorias.map((sub) => ({
      secao: secao.nome,
      subcategoria: sub.nome,
      cor: secao.cor,
      setores: sub.setores,
      palavras: sub.palavras,
    }))
  )
);

function atribuirCategoria(fab: Fabricante) {
  const haystack = [fab.nome, fab.setor, fab.descricao, fab.produtos.join(" ")]
    .join(" ")
    .toLowerCase();

  const bySetor = taxonomiaFlat.find((e) => e.setores.includes(fab.setor));
  if (bySetor) return bySetor;

  return (
    taxonomiaFlat.find((e) =>
      e.palavras.some((p) => haystack.includes(p.toLowerCase()))
    ) || null
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function coordFabricante(fab: Fabricante): [number, number] | null {
  const cidadeKey = normalizar(fab.localizacao.cidade) + "|" + fab.localizacao.sigla.toLowerCase();
  if (coordenadasCidades[cidadeKey]) return coordenadasCidades[cidadeKey];
  const estadoKey = fab.localizacao.sigla.toUpperCase();
  return coordenadasEstados[estadoKey] || null;
}

// ─── Map component (client-only via dynamic import) ──────────────────────────

const MapaBrasil = dynamic(() => import("./MapaBrasil"), { ssr: false });

// ─── Icons ───────────────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path
      d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z"
      fill="currentColor"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// ─── Company detail panel ─────────────────────────────────────────────────────

function PainelDetalhe({
  fab,
  onClose,
}: {
  fab: Fabricante | null;
  onClose: () => void;
}) {
  if (!fab) return null;
  const cat = atribuirCategoria(fab);

  return (
    <aside className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-mist border-l border-bark/20 z-[1000] shadow-lg flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-5 border-b border-bark/10">
        <span className="font-mono text-accents text-bark/50 uppercase">Detalhes</span>
        <button onClick={onClose} className="text-bark/50 hover:text-bark transition-colors">
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col gap-6">
        {cat && (
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.cor }}
            />
            <span className="font-mono text-accents text-bark/50 uppercase">{cat.secao} › {cat.subcategoria}</span>
          </div>
        )}

        <div>
          <h2 className="text-[clamp(1.2rem,3vw,1.6rem)] leading-tight font-bold text-bark" style={{ fontFamily: "var(--font-heading)" }}>
            {fab.nome}
          </h2>
          <div className="font-mono text-accents text-bark/40 mt-1 uppercase">
            {fab.localizacao.cidade}, {fab.localizacao.estado}
          </div>
        </div>

        <p className="text-[14px] text-bark/70 leading-[150%]">{fab.descricao}</p>

        <div
          style={{
            borderTop: "0.5px dashed",
            borderImage: "repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1",
          }}
        />

        <div className="flex flex-col gap-3">
          <div className="font-mono text-accents text-bark/40 uppercase">Produtos</div>
          <div className="flex flex-wrap gap-2">
            {fab.produtos.map((p) => (
              <span
                key={p}
                className="bg-sand border border-bark/20 font-mono text-[11px] px-2 py-1 text-bark/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {fab.fundacao && (
            <div className="flex justify-between">
              <span className="font-mono text-accents text-bark/40 uppercase">Fundação</span>
              <span className="font-mono text-accents text-bark">{fab.fundacao}</span>
            </div>
          )}
          {fab.funcionarios && (
            <div className="flex justify-between">
              <span className="font-mono text-accents text-bark/40 uppercase">Funcionários</span>
              <span className="font-mono text-accents text-bark">{fab.funcionarios}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-mono text-accents text-bark/40 uppercase">Setor</span>
            <span className="font-mono text-accents text-bark text-right max-w-[200px]">{fab.setor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-accents text-bark/40 uppercase">Capital</span>
            <span className={`font-mono text-accents px-1.5 py-0.5 ${isMNC(fab) ? "bg-coast/10 text-coast" : "bg-bark/10 text-bark"}`}>
              {isMNC(fab) ? "Multinacional" : "Capital Nacional"}
            </span>
          </div>
        </div>

        {fab.website && (
          <a
            href={fab.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-accents text-coast hover:opacity-70 transition-opacity uppercase"
          >
            Visitar site <ArrowIcon />
          </a>
        )}
      </div>
    </aside>
  );
}

// ─── Contribute modal ─────────────────────────────────────────────────────────

const SIGLA_POR_ESTADO: Record<string, string> = {
  Acre: "AC", Alagoas: "AL", Amazonas: "AM", Amapá: "AP", Bahia: "BA",
  Ceará: "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", Goiás: "GO",
  Maranhão: "MA", "Minas Gerais": "MG", "Mato Grosso do Sul": "MS",
  "Mato Grosso": "MT", Pará: "PA", Paraíba: "PB", Pernambuco: "PE", Piauí: "PI",
  Paraná: "PR", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
  Rondônia: "RO", Roraima: "RR", "Rio Grande do Sul": "RS",
  "Santa Catarina": "SC", Sergipe: "SE", "São Paulo": "SP", Tocantins: "TO",
};

function ModalContribuir({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    nome: "",
    website: "",
    setor: "",
    estado: "",
    cidade: "",
    produtos: "",
    descricao: "",
    funcionarios: "",
    fundacao: "",
    origem: "BR",
    contato_email: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [erro, setErro] = useState("");

  const set = (k: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const fieldCls =
    "w-full bg-sand border-[0.5px] border-bark/30 px-3 py-2 text-[13px] text-bark placeholder:text-bark/30 focus:border-bark/60 focus:outline-none";
  const labelCls = "font-mono text-[10px] uppercase tracking-[0.1em] text-bark/40 mb-1 block";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      setErro("Informe o nome da empresa.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErro("");
    try {
      const res = await fetch("/api/fabricantes/contribuir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sigla: SIGLA_POR_ESTADO[form.estado] ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        setStatus("ok");
      } else {
        setErro(data?.error ?? "Não foi possível enviar. Tente novamente.");
        setStatus("error");
      }
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-bark/40" onClick={onClose} />
      <div className="relative z-[1] bg-mist border border-bark/20 w-full max-w-[560px] mx-4 p-8 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-accents text-bark/40 uppercase mb-1">Contribuição comunitária</p>
            <h2 className="text-[1.4rem] font-bold text-bark" style={{ fontFamily: "var(--font-heading)" }}>
              Adicionar empresa
            </h2>
          </div>
          <button onClick={onClose} className="text-bark/40 hover:text-bark transition-colors mt-1">
            <CloseIcon />
          </button>
        </div>

        {status === "ok" ? (
          <div className="py-8 text-center">
            <p className="text-[15px] text-bark leading-[150%] mb-2">
              Contribuição recebida. Obrigado.
            </p>
            <p className="text-[13px] text-bark/50 leading-[150%] mb-6">
              Sua sugestão entra na fila de moderação. Depois de revisada, a
              empresa aparece no índice.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center cursor-pointer transition-all hover:opacity-80 text-accents text-mist bg-bark w-full justify-between"
            >
              <span>FECHAR</span>
              <ArrowIcon />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <p className="text-[13px] text-bark/60 leading-[150%] -mt-2">
              Conhece uma fabricante, indústria ou empresa que deveria estar
              aqui? Submeta e nós revisamos.
            </p>

            {/* honeypot — escondido de humanos */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={set("company")}
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label className={labelCls}>Empresa *</label>
              <input className={fieldCls} value={form.nome} onChange={set("nome")} placeholder="Ex.: WEG" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Setor</label>
                <select className={fieldCls} value={form.setor} onChange={set("setor")}>
                  <option value="">Selecione…</option>
                  {setoresBrasileiros.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Capital</label>
                <select className={fieldCls} value={form.origem} onChange={set("origem")}>
                  <option value="BR">Nacional (BR)</option>
                  <option value="MNC">Multinacional (MNC)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Estado</label>
                <select className={fieldCls} value={form.estado} onChange={set("estado")}>
                  <option value="">Selecione…</option>
                  {estadosBrasileiros.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Cidade</label>
                <input className={fieldCls} value={form.cidade} onChange={set("cidade")} placeholder="Ex.: Jaraguá do Sul" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Website</label>
              <input className={fieldCls} value={form.website} onChange={set("website")} placeholder="https://" />
            </div>

            <div>
              <label className={labelCls}>Produtos (separados por vírgula)</label>
              <input className={fieldCls} value={form.produtos} onChange={set("produtos")} placeholder="Motores elétricos, automação, energia" />
            </div>

            <div>
              <label className={labelCls}>Descrição</label>
              <textarea className={`${fieldCls} resize-none`} rows={2} value={form.descricao} onChange={set("descricao")} placeholder="O que a empresa fabrica e por que importa." />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Funcionários</label>
                <input className={fieldCls} value={form.funcionarios} onChange={set("funcionarios")} placeholder="5000+" />
              </div>
              <div>
                <label className={labelCls}>Fundação</label>
                <input className={fieldCls} value={form.fundacao} onChange={set("fundacao")} placeholder="1961" inputMode="numeric" />
              </div>
              <div>
                <label className={labelCls}>Seu email</label>
                <input className={fieldCls} value={form.contato_email} onChange={set("contato_email")} placeholder="opcional" type="email" />
              </div>
            </div>

            {status === "error" && erro && (
              <p className="font-mono text-[11px] text-clay uppercase">{erro}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center cursor-pointer transition-all hover:opacity-80 disabled:opacity-50 text-accents text-mist bg-bark w-full justify-between mt-1"
            >
              <span>{status === "sending" ? "ENVIANDO…" : "SUBMETER EMPRESA"}</span>
              <ArrowIcon />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── List / Directory view ────────────────────────────────────────────────────

function VisualizacaoLista({
  filtrados,
  onSelectFab,
}: {
  filtrados: Fabricante[];
  onSelectFab: (f: Fabricante) => void;
}) {
  const agrupados = useMemo(() => {
    const map = new Map<string, { cor: string; secao: string; items: Fabricante[] }>();

    filtrados.forEach((fab) => {
      const cat = atribuirCategoria(fab);
      const key = cat ? cat.subcategoria : "Outros";
      const cor = cat ? cat.cor : "#94a3b8";
      const secao = cat ? cat.secao : "Outros";
      if (!map.has(key)) map.set(key, { cor, secao, items: [] });
      map.get(key)!.items.push(fab);
    });

    return map;
  }, [filtrados]);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {taxonomia.map((tier) => (
        <section key={tier.tier}>
          <div className="flex items-center gap-3 px-5 lg:px-10 py-4 border-b border-bark/10 sticky top-0 bg-mist z-10">
            <span className="font-mono text-[11px] bg-bark text-mist px-2 py-0.5 uppercase">
              TIER {tier.tier}
            </span>
            <span className="font-mono text-accents text-bark/60 uppercase">{tier.rotulo}</span>
          </div>

          <div className="px-5 lg:px-10 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {tier.secoes.flatMap((secao) =>
              secao.subcategorias.map((sub) => {
                const grupo = agrupados.get(sub.nome);
                const count = grupo?.items.length ?? 0;
                const isEmpty = count === 0;

                return (
                  <div
                    key={sub.nome}
                    className={`border p-4 flex flex-col gap-3 ${isEmpty ? "border-bark/10 bg-transparent" : "border-bark/20 bg-sand cursor-pointer hover:border-bark/40 transition-colors"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: secao.cor }}
                        />
                        <span className="font-mono text-[11px] text-bark/60 uppercase">{sub.nome}</span>
                      </div>
                      <span
                        className={`font-mono text-[11px] px-1.5 py-0.5 ${isEmpty ? "text-bark/20" : "bg-bark text-mist"}`}
                      >
                        {count}
                      </span>
                    </div>

                    {isEmpty ? (
                      <p className="font-mono text-[10px] text-bark/20 uppercase">
                        Nenhuma empresa indexada — lacuna produtiva
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {grupo!.items.slice(0, 4).map((fab) => (
                          <button
                            key={fab.id}
                            onClick={() => onSelectFab(fab)}
                            className="text-left font-mono text-[11px] text-bark/70 hover:text-bark transition-colors truncate uppercase"
                          >
                            {fab.nome}
                          </button>
                        ))}
                        {grupo!.items.length > 4 && (
                          <span className="font-mono text-[10px] text-bark/30 uppercase">
                            +{grupo!.items.length - 4} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Table view ───────────────────────────────────────────────────────────────

function VisualizacaoTabela({
  filtrados,
  onSelectFab,
}: {
  filtrados: Fabricante[];
  onSelectFab: (f: Fabricante) => void;
}) {
  return (
    <div className="overflow-x-auto pb-20">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-bark/10">
            {["Empresa", "Setor", "Capital", "Localização", "Funcionários", "Site"].map((h) => (
              <th
                key={h}
                className="text-left font-mono text-accents text-bark/40 uppercase px-5 lg:px-10 py-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtrados.map((fab) => {
            const cat = atribuirCategoria(fab);
            return (
              <tr
                key={fab.id}
                className="border-b border-bark/5 hover:bg-sand/50 cursor-pointer transition-colors"
                onClick={() => onSelectFab(fab)}
              >
                <td className="px-5 lg:px-10 py-3">
                  <div className="flex items-center gap-2">
                    {cat && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.cor }}
                      />
                    )}
                    <span className="font-mono text-[12px] text-bark font-medium">{fab.nome}</span>
                  </div>
                </td>
                <td className="px-5 lg:px-10 py-3">
                  <span className="font-mono text-[11px] text-bark/60">{fab.setor}</span>
                </td>
                <td className="px-5 lg:px-10 py-3 whitespace-nowrap">
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 ${isMNC(fab) ? "bg-coast/10 text-coast" : "bg-bark/10 text-bark/60"}`}>
                    {isMNC(fab) ? "MNC" : "BR"}
                  </span>
                </td>
                <td className="px-5 lg:px-10 py-3">
                  <span className="font-mono text-[11px] text-bark/60 whitespace-nowrap">
                    {fab.localizacao.cidade}, {fab.localizacao.sigla}
                  </span>
                </td>
                <td className="px-5 lg:px-10 py-3">
                  <span className="font-mono text-[11px] text-bark/40">{fab.funcionarios || "—"}</span>
                </td>
                <td className="px-5 lg:px-10 py-3">
                  {fab.website ? (
                    <a
                      href={fab.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-coast hover:opacity-70 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ↗
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] text-bark/20">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CadeiaProdutivaBrasileiraPage() {
  const [vista, setVista] = useState<"mapa" | "lista" | "tabela">("mapa");
  const [busca, setBusca] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [setorFiltro, setSetorFiltro] = useState("");
  const [origemFiltro, setOrigemFiltro] = useState<"" | "BR" | "MNC">("");
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState<Fabricante | null>(null);
  const [modalContribuir, setModalContribuir] = useState(false);
  // Map view: collapse the secondary filters on mobile so the floating card
  // stays compact and doesn't eat the map. Always expanded on desktop (lg:).
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  // Index data: seeded from the static dataset for an instant first paint, then
  // hydrated from /api/fabricantes (Supabase). The API falls back to the same
  // static set, so this never empties the page.
  const [fabricantes, setFabricantes] = useState<Fabricante[]>(fabricantesSeed);

  useEffect(() => {
    let active = true;
    fetch("/api/fabricantes", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (active && data?.ok && Array.isArray(data.fabricantes) && data.fabricantes.length) {
          setFabricantes(data.fabricantes as Fabricante[]);
        }
      })
      .catch(() => {
        /* keep the seed — the page already works offline */
      });
    return () => {
      active = false;
    };
  }, []);

  const filtrados = useMemo(() => {
    const q = normalizar(busca.trim());
    return fabricantes.filter((fab) => {
      if (estadoFiltro && fab.localizacao.estado !== estadoFiltro) return false;
      if (setorFiltro && fab.setor !== setorFiltro) return false;
      if (origemFiltro === "MNC" && !isMNC(fab)) return false;
      if (origemFiltro === "BR" && isMNC(fab)) return false;
      if (!q) return true;
      const haystack = normalizar(
        [fab.nome, fab.setor, fab.descricao, fab.produtos.join(" "), fab.localizacao.cidade, fab.localizacao.estado].join(" ")
      );
      return q.split(/\s+/).filter(Boolean).every((token) => haystack.includes(token));
    });
  }, [busca, estadoFiltro, setorFiltro, origemFiltro, fabricantes]);

  const fabricantesComCoordenadas = useMemo(
    () =>
      filtrados
        .map((fab) => {
          const coords = coordFabricante(fab);
          return coords ? { fab, coords } : null;
        })
        .filter(Boolean) as { fab: Fabricante; coords: [number, number] }[],
    [filtrados]
  );

  // Sectors that have companies under the current filters *except* the sector
  // filter itself — so the legend can dim empty sectors while keeping every
  // populated sector switchable.
  const setoresPresentes = useMemo(() => {
    const q = normalizar(busca.trim());
    const tokens = q.split(/\s+/).filter(Boolean);
    const set = new Set<string>();
    for (const fab of fabricantes) {
      if (estadoFiltro && fab.localizacao.estado !== estadoFiltro) continue;
      if (origemFiltro === "MNC" && !isMNC(fab)) continue;
      if (origemFiltro === "BR" && isMNC(fab)) continue;
      if (tokens.length) {
        const haystack = normalizar(
          [fab.nome, fab.setor, fab.descricao, fab.produtos.join(" "), fab.localizacao.cidade, fab.localizacao.estado].join(" ")
        );
        if (!tokens.every((t) => haystack.includes(t))) continue;
      }
      set.add(fab.setor);
    }
    return set;
  }, [busca, estadoFiltro, origemFiltro, fabricantes]);

  function limparFiltros() {
    setBusca("");
    setEstadoFiltro("");
    setSetorFiltro("");
    setOrigemFiltro("");
  }

  const temFiltro = Boolean(busca || estadoFiltro || setorFiltro || origemFiltro);

  const autocompleteHits = useMemo(() => {
    const q = normalizar(busca.trim());
    if (q.length < 2) return [] as Fabricante[];
    const starts: Fabricante[] = [];
    const contains: Fabricante[] = [];
    for (const fab of filtrados) {
      const nome = normalizar(fab.nome);
      if (nome.startsWith(q)) starts.push(fab);
      else contains.push(fab);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [busca, filtrados]);

  // Shared filter controls — rendered inline (list/tabela) or as overlay (mapa).
  // NOTE: called as a function (not a JSX component) so React does not
  // remount the input subtree on every parent render — preserves focus.
  function renderFiltros(overlay: boolean) {
    const inputCls = overlay
      ? "w-full bg-mist/95 border border-bark/20 px-3 py-2 font-mono text-[12px] text-bark placeholder:text-bark/30 focus:outline-none focus:border-bark/60 transition-colors"
      : "flex-1 bg-transparent border border-bark/20 px-4 py-2.5 font-mono text-[12px] text-bark placeholder:text-bark/30 focus:outline-none focus:border-bark/60 transition-colors";
    const selectCls = overlay
      ? "w-full bg-mist/95 border border-bark/20 px-3 py-2 font-mono text-[12px] text-bark focus:outline-none focus:border-bark/60 transition-colors"
      : "bg-transparent border border-bark/20 px-4 py-2.5 font-mono text-[12px] text-bark focus:outline-none focus:border-bark/60 transition-colors min-w-[180px]";

    const searchInput = (
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar empresa, produto, cidade..."
        className={inputCls}
        aria-label="Buscar"
      />
    );
    const estadoSelect = (
      <select
        value={estadoFiltro}
        onChange={(e) => setEstadoFiltro(e.target.value)}
        className={selectCls}
        aria-label="Estado"
      >
        <option value="">Todos os estados</option>
        {estadosBrasileiros.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
    );
    const setorSelect = (
      <select
        value={setorFiltro}
        onChange={(e) => setSetorFiltro(e.target.value)}
        className={overlay ? selectCls : `${selectCls} min-w-[200px]`}
        aria-label="Setor"
      >
        <option value="">Todos os setores</option>
        {setoresBrasileiros.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    );
    const origemToggle = (
      <div className={`flex gap-0 border border-bark/20 ${overlay ? "w-full" : ""}`}>
        {(["", "BR", "MNC"] as const).map((o) => (
          <button
            key={o || "all"}
            onClick={() => setOrigemFiltro(o)}
            className={`font-mono text-accents uppercase ${overlay ? "px-2 py-2 flex-1" : "px-3 py-2.5"} transition-colors whitespace-nowrap ${
              origemFiltro === o ? "bg-bark text-mist" : "text-bark/50 hover:text-bark"
            }`}
          >
            {o === "" ? "Todas" : o === "BR" ? "BR" : "MNC"}
          </button>
        ))}
      </div>
    );
    const clearBtn = temFiltro && (
      <button
        onClick={limparFiltros}
        className={`font-mono text-accents text-bark/60 hover:text-bark transition-colors border border-bark/20 ${overlay ? "px-2 py-2" : "px-4 py-2.5"} uppercase whitespace-nowrap`}
      >
        Limpar filtros
      </button>
    );

    if (overlay) {
      const ativos = [estadoFiltro, setorFiltro, origemFiltro].filter(Boolean).length;
      return (
        <div className="flex flex-col gap-2">
          {searchInput}
          {/* Mobile-only toggle: keeps the floating card from eating the map */}
          <button
            type="button"
            onClick={() => setFiltrosExpandidos((v) => !v)}
            className="lg:hidden flex items-center justify-between font-mono text-accents uppercase text-bark/60 border border-bark/20 px-3 py-2"
          >
            <span>Filtros{ativos ? ` · ${ativos}` : ""}</span>
            <span className="text-bark/40">{filtrosExpandidos ? "−" : "+"}</span>
          </button>
          <div className={`${filtrosExpandidos ? "flex" : "hidden"} lg:flex flex-col gap-2`}>
            {estadoSelect}
            {setorSelect}
            {origemToggle}
            {clearBtn}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row gap-3">
        {searchInput}
        {estadoSelect}
        {setorSelect}
        {origemToggle}
        {clearBtn}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1 bg-mist flex flex-col">
        {/* Compact top bar */}
        <section className="border-b border-bark/10 pt-24 pb-0">
          <div className="px-5 lg:px-10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="border-l border-clay pl-2.5 font-mono text-accents text-bark/50 uppercase mb-3">
                Projeto Pax Brasiliana
              </div>
              <h1
                className="text-[clamp(1.8rem,5vw,3rem)] leading-[1.05] tracking-[-0.03em] text-bark font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Cadeia Produtiva Brasileira
              </h1>
              <p className="text-[14px] text-bark/50 mt-2 max-w-[600px] leading-[150%]">
                Índice aberto de fabricantes e industriais brasileiros por categoria, localização e capacidade produtiva.
              </p>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <span className="font-mono text-accents text-bark/40 uppercase">
                {filtrados.length} {filtrados.length === 1 ? "empresa" : "empresas"}
              </span>
              <button
                onClick={() => setModalContribuir(true)}
                className="font-mono text-accents text-mist bg-bark px-3 py-2 hover:opacity-80 transition-opacity uppercase"
              >
                Contribuir
              </button>
            </div>
          </div>

          {/* Inline filters only when NOT map view */}
          {vista !== "mapa" && (
            <div className="px-5 lg:px-10 pb-4">
              {renderFiltros(false)}
            </div>
          )}

          {/* View toggle */}
          <div className="px-5 lg:px-10 flex gap-0 border-t border-bark/10">
            {(["mapa", "lista", "tabela"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`font-mono text-accents uppercase px-4 py-3 transition-colors border-b-2 ${
                  vista === v
                    ? "text-bark border-bark"
                    : "text-bark/30 border-transparent hover:text-bark/60"
                }`}
              >
                {v === "mapa" ? "Mapa" : v === "lista" ? "Diretório" : "Tabela"}
              </button>
            ))}
          </div>
        </section>

        {/* Map view — immersive with floating panel */}
        {vista === "mapa" && (
          <div
            className="relative flex-1"
            style={{ height: "calc(100dvh - 220px)", minHeight: 480 }}
          >
            <MapaBrasil
              fabricantes={fabricantesComCoordenadas}
              onSelect={setFabricanteSelecionado}
              selecionado={fabricanteSelecionado}
              setorAtivo={setorFiltro}
              onSelectSetor={setSetorFiltro}
              setoresPresentes={setoresPresentes}
            />

            {/* Floating search + filters + autocomplete */}
            <div
              className="absolute top-3 left-3 lg:top-4 lg:left-4 z-30 w-[calc(100%-24px)] lg:w-[360px] bg-mist/95 border border-bark/20 shadow-lg"
              style={{ backdropFilter: "blur(6px)" }}
            >
              <div className="px-3 py-3 border-b border-bark/10 flex items-center justify-between gap-2">
                <span className="font-mono text-accents text-bark/60 uppercase">
                  Buscar no mapa
                </span>
                <span className="font-mono text-accents text-bark/40 uppercase">
                  {filtrados.length}
                </span>
              </div>
              <div className="p-3">
                {renderFiltros(true)}
              </div>
              {autocompleteHits.length > 0 && (
                <div className="border-t border-bark/10 max-h-[40dvh] overflow-y-auto">
                  <div className="px-3 py-2 font-mono text-[10px] text-bark/40 uppercase">
                    {autocompleteHits.length} {autocompleteHits.length === 1 ? "resultado" : "resultados"}
                  </div>
                  <ul>
                    {autocompleteHits.map((fab) => (
                      <li key={fab.id}>
                        <button
                          onClick={() => setFabricanteSelecionado(fab)}
                          className="w-full text-left px-3 py-2 hover:bg-sand/60 transition-colors border-t border-bark/10 flex flex-col gap-0.5"
                        >
                          <span className="font-mono text-[12px] text-bark font-medium truncate">
                            {fab.nome}
                          </span>
                          <span className="font-mono text-[10px] text-bark/50 uppercase truncate">
                            {fab.setor} · {fab.localizacao.cidade}, {fab.localizacao.sigla}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* List / directory view */}
        {vista === "lista" && (
          <VisualizacaoLista filtrados={filtrados} onSelectFab={setFabricanteSelecionado} />
        )}

        {/* Table view */}
        {vista === "tabela" && (
          <VisualizacaoTabela filtrados={filtrados} onSelectFab={setFabricanteSelecionado} />
        )}

        {/* Add company CTA */}
        <section className="border-t border-bark/10 px-5 lg:px-10 py-12 bg-sand">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 max-w-[800px]">
            <div>
              <p className="text-paragraphs text-bark">Conhece uma empresa que falta aqui?</p>
              <p className="text-[14px] text-bark/40 mt-1">
                Este índice é aberto. Contribua com dados sobre fabricantes brasileiros.
              </p>
            </div>
            <button
              onClick={() => setModalContribuir(true)}
              className="uppercase font-mono leading-none flex gap-2 px-4 py-3.5 items-center cursor-pointer transition-all hover:opacity-80 text-accents text-mist bg-bark whitespace-nowrap flex-shrink-0"
            >
              CONTRIBUIR <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      {/* Detail panel */}
      {fabricanteSelecionado && (
        <PainelDetalhe
          fab={fabricanteSelecionado}
          onClose={() => setFabricanteSelecionado(null)}
        />
      )}

      {/* Contribute modal */}
      {modalContribuir && <ModalContribuir onClose={() => setModalContribuir(false)} />}

      <Footer />
    </div>
  );
}
