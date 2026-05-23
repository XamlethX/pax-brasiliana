"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Acao {
  ticker: string;
  nome: string;
  setor: string;
  preco: number;
  variacao: number;
  variacaoPct: number;
  marketCap: string;
  volume: string;
  high52: number;
  low52: number;
  descricao: string;
  sparkline: number[];
}

const sectorOrder = [
  "Defesa, Aeroespacial & Soberania",
  "Manufatura Avançada & Materiais",
  "Energia Limpa & Cleantech",
  "Agtech, Segurança Alimentar & Biológicos",
  "Infraestrutura, Recursos & Capacidade Soberana",
  "Tecnologia & Software",
  "Saúde & Farmacêutica",
];

const sectorConfig: Record<
  string,
  {
    shortLabel: string;
    bgClass: string;
    textClass: string;
    sparkColor: string;
  }
> = {
  "Defesa, Aeroespacial & Soberania": {
    shortLabel: "Defesa",
    bgClass: "bg-[#417CE5]/10",
    textClass: "text-[#417CE5]",
    sparkColor: "#417CE5",
  },
  "Manufatura Avançada & Materiais": {
    shortLabel: "Manufatura",
    bgClass: "bg-[#F45141]/10",
    textClass: "text-[#F45141]",
    sparkColor: "#F45141",
  },
  "Energia Limpa & Cleantech": {
    shortLabel: "Energia",
    bgClass: "bg-[#45a832]/10",
    textClass: "text-[#45a832]",
    sparkColor: "#68D34D",
  },
  "Agtech, Segurança Alimentar & Biológicos": {
    shortLabel: "Agtech",
    bgClass: "bg-[#8a8438]/10",
    textClass: "text-[#8a8438]",
    sparkColor: "#ADA446",
  },
  "Infraestrutura, Recursos & Capacidade Soberana": {
    shortLabel: "Infra",
    bgClass: "bg-[#b5a230]/10",
    textClass: "text-[#b5a230]",
    sparkColor: "#DFCB5A",
  },
  "Tecnologia & Software": {
    shortLabel: "Tech",
    bgClass: "bg-[#8B5CF6]/10",
    textClass: "text-[#8B5CF6]",
    sparkColor: "#8B5CF6",
  },
  "Saúde & Farmacêutica": {
    shortLabel: "Saúde",
    bgClass: "bg-[#E5417C]/10",
    textClass: "text-[#E5417C]",
    sparkColor: "#E5417C",
  },
};

const acoes: Acao[] = [
  // ── Defesa, Aeroespacial & Soberania ──
  { ticker: "EMBR3", nome: "Embraer", setor: "Defesa, Aeroespacial & Soberania", preco: 62.45, variacao: 1.41, variacaoPct: 2.3, marketCap: "46.2B", volume: "12.5M", high52: 68.20, low52: 32.10, descricao: "Terceira maior fabricante de jatos do mundo. Líder em aviação executiva e defesa.", sparkline: [40, 42, 41, 45, 48, 52, 50, 55, 58, 56, 60, 62] },
  { ticker: "TASA4", nome: "Taurus Armas", setor: "Defesa, Aeroespacial & Soberania", preco: 14.20, variacao: -0.10, variacaoPct: -0.7, marketCap: "5.6B", volume: "3.2M", high52: 18.50, low52: 11.80, descricao: "Maior fabricante de armas leves do hemisfério sul. Exporta para 100+ países.", sparkline: [15, 14.8, 15.2, 14.5, 14.2, 14, 14.5, 14.8, 14.3, 14, 13.8, 14.2] },

  // ── Manufatura Avançada & Materiais ──
  { ticker: "WEGE3", nome: "WEG", setor: "Manufatura Avançada & Materiais", preco: 42.18, variacao: 0.33, variacaoPct: 0.8, marketCap: "177B", volume: "8.1M", high52: 48.50, low52: 33.20, descricao: "Multinacional de motores elétricos, automação e energia. Referência global em eficiência.", sparkline: [38, 37, 39, 38, 40, 41, 39, 40, 42, 41, 43, 42] },
  { ticker: "CSNA3", nome: "CSN", setor: "Manufatura Avançada & Materiais", preco: 11.80, variacao: -0.18, variacaoPct: -1.5, marketCap: "15.6B", volume: "15.8M", high52: 17.20, low52: 10.50, descricao: "Companhia Siderúrgica Nacional. Aço, mineração, cimento e logística integrada.", sparkline: [14, 13.5, 13, 12.8, 12.5, 12, 12.3, 11.8, 12.1, 11.5, 11.9, 11.8] },
  { ticker: "GGBR4", nome: "Gerdau", setor: "Manufatura Avançada & Materiais", preco: 19.75, variacao: 0.10, variacaoPct: 0.5, marketCap: "33.8B", volume: "9.4M", high52: 24.30, low52: 16.80, descricao: "Maior produtora de aços longos das Américas. Opera em 9 países.", sparkline: [18.5, 18.8, 19, 18.7, 19.2, 19, 19.3, 19.5, 19.4, 19.6, 19.7, 19.75] },
  { ticker: "GOAU4", nome: "Metalúrgica Gerdau", setor: "Manufatura Avançada & Materiais", preco: 10.85, variacao: 0.04, variacaoPct: 0.4, marketCap: "21.5B", volume: "4.2M", high52: 13.10, low52: 8.90, descricao: "Holding de controle da Gerdau. Exposição ao setor siderúrgico global.", sparkline: [10.2, 10.3, 10.5, 10.3, 10.6, 10.4, 10.7, 10.6, 10.8, 10.7, 10.9, 10.85] },
  { ticker: "USIM5", nome: "Usiminas", setor: "Manufatura Avançada & Materiais", preco: 6.42, variacao: -0.14, variacaoPct: -2.1, marketCap: "8.2B", volume: "11.2M", high52: 9.80, low52: 5.50, descricao: "Líder em aços planos no Brasil. Fornece para automotivo, naval e construção.", sparkline: [7.5, 7.3, 7, 7.2, 6.8, 6.5, 6.8, 6.6, 6.3, 6.5, 6.4, 6.42] },
  { ticker: "FRAS3", nome: "Fras-Le", setor: "Manufatura Avançada & Materiais", preco: 22.10, variacao: 0.39, variacaoPct: 1.8, marketCap: "5.4B", volume: "1.8M", high52: 24.50, low52: 15.20, descricao: "Maior fabricante de materiais de fricção da América Latina para autopeças.", sparkline: [18, 19, 18.5, 19.5, 20, 20.5, 20, 21, 21.5, 21, 22, 22.1] },
  { ticker: "MYPK3", nome: "Iochpe-Maxion", setor: "Manufatura Avançada & Materiais", preco: 9.50, variacao: 0.06, variacaoPct: 0.6, marketCap: "2.8B", volume: "2.1M", high52: 14.20, low52: 7.80, descricao: "Maior produtora global de rodas automotivas. Opera em 14 países.", sparkline: [8.5, 8.7, 8.6, 8.9, 9, 8.8, 9.1, 9.2, 9, 9.3, 9.4, 9.5] },
  { ticker: "ROMI3", nome: "Indústrias Romi", setor: "Manufatura Avançada & Materiais", preco: 15.80, variacao: 0.39, variacaoPct: 2.5, marketCap: "1.2B", volume: "0.8M", high52: 16.50, low52: 9.80, descricao: "Fabricante de máquinas-ferramentas CNC e equipamentos industriais de precisão.", sparkline: [12, 12.5, 13, 13.2, 13.8, 14, 14.5, 14.2, 15, 15.3, 15.5, 15.8] },
  { ticker: "SHUL4", nome: "Schulz", setor: "Manufatura Avançada & Materiais", preco: 11.20, variacao: 0.12, variacaoPct: 1.1, marketCap: "3.8B", volume: "1.5M", high52: 12.80, low52: 7.50, descricao: "Compressores, peças automotivas fundidas e usinadas. Exporta para 40+ países.", sparkline: [9.5, 9.8, 10, 10.2, 10, 10.5, 10.3, 10.8, 11, 10.8, 11.1, 11.2] },
  { ticker: "TUPY3", nome: "Tupy", setor: "Manufatura Avançada & Materiais", preco: 24.60, variacao: 0.07, variacaoPct: 0.3, marketCap: "3.7B", volume: "2.4M", high52: 28.50, low52: 19.20, descricao: "Líder global em blocos e cabeçotes de motor em ferro fundido.", sparkline: [23, 23.2, 23.5, 23.3, 23.8, 24, 23.7, 24.2, 24, 24.3, 24.5, 24.6] },
  { ticker: "LEVE3", nome: "Metal Leve (Mahle)", setor: "Manufatura Avançada & Materiais", preco: 30.50, variacao: 0.12, variacaoPct: 0.4, marketCap: "3.9B", volume: "1.1M", high52: 35.80, low52: 25.10, descricao: "Componentes de motor e filtração automotiva. Parte do grupo Mahle.", sparkline: [29, 29.5, 29.3, 30, 29.8, 30.2, 30, 30.3, 30.5, 30.2, 30.4, 30.5] },
  { ticker: "UNIP6", nome: "Unipar", setor: "Manufatura Avançada & Materiais", preco: 78.50, variacao: 0.47, variacaoPct: 0.6, marketCap: "8.5B", volume: "1.3M", high52: 92.30, low52: 62.40, descricao: "Maior produtora de cloro-soda da América do Sul. Química básica industrial.", sparkline: [74, 74.5, 75, 75.5, 76, 76.5, 77, 76.8, 77.5, 78, 78.2, 78.5] },
  { ticker: "SUZB3", nome: "Suzano", setor: "Manufatura Avançada & Materiais", preco: 55.30, variacao: -0.11, variacaoPct: -0.2, marketCap: "72B", volume: "14.2M", high52: 63.50, low52: 44.80, descricao: "Maior produtora mundial de celulose de eucalipto. Biomateriais do futuro.", sparkline: [54, 54.5, 54.2, 55, 54.8, 55.2, 55, 55.5, 55.2, 55.4, 55.3, 55.3] },

  // ── Energia Limpa & Cleantech ──
  { ticker: "RAIZ4", nome: "Raízen", setor: "Energia Limpa & Cleantech", preco: 3.85, variacao: 0.01, variacaoPct: 0.3, marketCap: "39.5B", volume: "22.1M", high52: 4.80, low52: 3.10, descricao: "JV Shell-Cosan. Etanol de 2a geração, biogás e energia renovável integrada.", sparkline: [4, 3.9, 4.1, 4, 3.8, 3.9, 3.7, 3.8, 3.85, 3.9, 3.8, 3.85] },
  { ticker: "CSAN3", nome: "Cosan", setor: "Energia Limpa & Cleantech", preco: 12.30, variacao: -0.05, variacaoPct: -0.4, marketCap: "22.8B", volume: "10.5M", high52: 18.90, low52: 10.20, descricao: "Holding de energia, logística e lubrificantes. Controla Raízen, Compass e Moove.", sparkline: [14, 13.5, 13.2, 13, 12.8, 13, 12.5, 12.8, 12.3, 12.5, 12.4, 12.3] },
  { ticker: "EQTL3", nome: "Equatorial Energia", setor: "Energia Limpa & Cleantech", preco: 31.50, variacao: 0.22, variacaoPct: 0.7, marketCap: "38.5B", volume: "7.8M", high52: 35.20, low52: 26.80, descricao: "Distribuição, transmissão e geração de energia em 7 estados brasileiros.", sparkline: [29, 29.5, 30, 29.8, 30.2, 30.5, 30.3, 31, 30.8, 31.2, 31.3, 31.5] },
  { ticker: "CPLE6", nome: "Copel", setor: "Energia Limpa & Cleantech", preco: 10.15, variacao: 0.02, variacaoPct: 0.2, marketCap: "29.5B", volume: "6.3M", high52: 11.80, low52: 8.50, descricao: "Companhia Paranaense de Energia. Recém-privatizada, foco em eficiência.", sparkline: [9.5, 9.6, 9.8, 9.7, 9.9, 10, 9.8, 10.1, 10, 10.2, 10.1, 10.15] },
  { ticker: "ELET3", nome: "Eletrobras", setor: "Energia Limpa & Cleantech", preco: 38.90, variacao: 0.23, variacaoPct: 0.6, marketCap: "87B", volume: "18.5M", high52: 44.50, low52: 31.20, descricao: "Maior empresa de energia elétrica da América Latina. 30% da capacidade instalada do Brasil.", sparkline: [36, 36.5, 37, 36.8, 37.5, 37.2, 38, 37.8, 38.2, 38.5, 38.7, 38.9] },
  { ticker: "AERI3", nome: "Aeris Energy", setor: "Energia Limpa & Cleantech", preco: 1.20, variacao: -0.04, variacaoPct: -3.2, marketCap: "0.5B", volume: "5.8M", high52: 2.40, low52: 0.95, descricao: "Fabrica pás eólicas para os maiores parques do Brasil. Energia renovável física.", sparkline: [1.6, 1.55, 1.5, 1.45, 1.4, 1.35, 1.38, 1.3, 1.25, 1.28, 1.22, 1.2] },

  // ── Agtech, Segurança Alimentar & Biológicos ──
  { ticker: "KEPL3", nome: "Kepler Weber", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 9.85, variacao: -0.03, variacaoPct: -0.3, marketCap: "3.4B", volume: "1.9M", high52: 12.50, low52: 7.80, descricao: "Líder em armazenagem de grãos e infraestrutura pós-colheita no Brasil.", sparkline: [9, 9.2, 9.4, 9.3, 9.5, 9.6, 9.4, 9.7, 9.8, 9.6, 9.8, 9.85] },
  { ticker: "AGRO3", nome: "BrasilAgro", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 25.40, variacao: -0.31, variacaoPct: -1.2, marketCap: "2.5B", volume: "1.2M", high52: 30.80, low52: 22.10, descricao: "Referência em exploração de propriedades rurais. Agricultura de precisão em escala.", sparkline: [27, 26.5, 27, 26.2, 26, 25.5, 26, 25.8, 25.5, 25.2, 25.5, 25.4] },
  { ticker: "SLCE3", nome: "SLC Agrícola", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 18.20, variacao: 0.07, variacaoPct: 0.4, marketCap: "8.0B", volume: "3.5M", high52: 22.40, low52: 15.60, descricao: "Maior produtora de grãos e fibras do Brasil. Soja, algodão e milho em escala.", sparkline: [17.5, 17.8, 17.6, 18, 17.8, 18.1, 17.9, 18.2, 18, 18.1, 18.3, 18.2] },
  { ticker: "JALL3", nome: "Jalles Machado", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 7.80, variacao: 0.10, variacaoPct: 1.3, marketCap: "2.6B", volume: "2.1M", high52: 9.20, low52: 5.80, descricao: "Açúcar orgânico e etanol. Pioneira em agricultura regenerativa no cerrado.", sparkline: [6.5, 6.8, 7, 6.8, 7.2, 7, 7.3, 7.5, 7.2, 7.6, 7.8, 7.8] },
  { ticker: "CAML3", nome: "Camil Alimentos", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 9.10, variacao: -0.05, variacaoPct: -0.5, marketCap: "3.2B", volume: "1.8M", high52: 11.20, low52: 7.90, descricao: "Líder em arroz e feijão no Brasil. Operações no Uruguai, Chile e Peru.", sparkline: [9.4, 9.3, 9.5, 9.2, 9.1, 9.3, 9, 9.2, 9.1, 9, 9.15, 9.1] },
  { ticker: "SMTO3", nome: "São Martinho", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 27.50, variacao: 0.11, variacaoPct: 0.4, marketCap: "9.5B", volume: "2.8M", high52: 32.80, low52: 23.40, descricao: "Maior grupo sucroenergético do Brasil. Açúcar, etanol e bioenergia.", sparkline: [26, 26.3, 26.5, 26.2, 26.8, 27, 26.5, 27.2, 27, 27.3, 27.4, 27.5] },
  { ticker: "BRFS3", nome: "BRF", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 24.80, variacao: 0.29, variacaoPct: 1.2, marketCap: "40B", volume: "16.5M", high52: 28.50, low52: 14.20, descricao: "Dona das marcas Sadia e Perdigão. Top 10 global em proteína animal.", sparkline: [21, 21.5, 22, 22.5, 23, 22.8, 23.5, 24, 23.5, 24.2, 24.5, 24.8] },
  { ticker: "JBSS3", nome: "JBS", setor: "Agtech, Segurança Alimentar & Biológicos", preco: 38.50, variacao: 0.30, variacaoPct: 0.8, marketCap: "88B", volume: "21.3M", high52: 42.80, low52: 22.50, descricao: "Maior empresa de proteína animal do mundo. Opera em 20+ países.", sparkline: [34, 34.5, 35, 35.5, 36, 35.8, 36.5, 37, 37.5, 38, 38.2, 38.5] },

  // ── Infraestrutura, Recursos & Capacidade Soberana ──
  { ticker: "POMO4", nome: "Marcopolo", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 8.95, variacao: 0.13, variacaoPct: 1.5, marketCap: "8.1B", volume: "6.8M", high52: 10.20, low52: 5.40, descricao: "Segunda maior fabricante de ônibus do mundo. Exporta para 100+ países.", sparkline: [6.5, 7, 7.2, 7.5, 7.8, 8, 7.9, 8.2, 8.5, 8.7, 8.9, 8.95] },
  { ticker: "RSUL4", nome: "Randon", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 12.40, variacao: 0.21, variacaoPct: 1.7, marketCap: "4.1B", volume: "3.2M", high52: 14.80, low52: 9.50, descricao: "Maior fabricante de implementos rodoviários da América Latina.", sparkline: [10, 10.3, 10.5, 10.8, 11, 10.8, 11.2, 11.5, 11.8, 12, 12.2, 12.4] },
  { ticker: "SIMH3", nome: "Simpar", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 7.90, variacao: 0.07, variacaoPct: 0.9, marketCap: "3.5B", volume: "4.5M", high52: 10.80, low52: 6.20, descricao: "Holding de logística e mobilidade. Controla JSL, Movida e Vamos.", sparkline: [7, 7.1, 7.3, 7.2, 7.5, 7.3, 7.6, 7.4, 7.7, 7.8, 7.85, 7.9] },
  { ticker: "VAMO3", nome: "Vamos", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 8.20, variacao: 0.05, variacaoPct: 0.6, marketCap: "9.1B", volume: "5.1M", high52: 12.50, low52: 6.80, descricao: "Maior locadora de caminhões e máquinas do Brasil. Infraestrutura produtiva.", sparkline: [7.5, 7.6, 7.8, 7.7, 7.9, 8, 7.8, 8.1, 8, 8.15, 8.1, 8.2] },
  { ticker: "RAIL3", nome: "Rumo", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 22.30, variacao: 0.15, variacaoPct: 0.7, marketCap: "41B", volume: "8.9M", high52: 25.80, low52: 18.20, descricao: "Maior operadora de ferrovias do Brasil. Escoamento de grãos do Centro-Oeste.", sparkline: [20.5, 21, 20.8, 21.3, 21.5, 21.2, 21.8, 22, 21.8, 22.1, 22.2, 22.3] },
  { ticker: "CCRO3", nome: "CCR", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 13.60, variacao: 0.04, variacaoPct: 0.3, marketCap: "27.5B", volume: "7.2M", high52: 15.50, low52: 11.20, descricao: "Maior grupo de concessões de infraestrutura do Brasil. Rodovias, aeroportos, metrô.", sparkline: [13, 13.1, 13.2, 13, 13.3, 13.2, 13.4, 13.3, 13.5, 13.4, 13.55, 13.6] },
  { ticker: "CMIN3", nome: "CSN Mineração", setor: "Infraestrutura, Recursos & Capacidade Soberana", preco: 5.20, variacao: -0.03, variacaoPct: -0.6, marketCap: "28.5B", volume: "12.8M", high52: 7.80, low52: 4.50, descricao: "Braço de mineração da CSN. Minério de ferro de alta qualidade para exportação.", sparkline: [5.8, 5.6, 5.7, 5.5, 5.3, 5.5, 5.2, 5.4, 5.3, 5.1, 5.3, 5.2] },

  // ── Tecnologia & Software ──
  { ticker: "TOTS3", nome: "TOTVS", setor: "Tecnologia & Software", preco: 28.50, variacao: 0.34, variacaoPct: 1.2, marketCap: "17.8B", volume: "5.5M", high52: 32.80, low52: 22.10, descricao: "Maior empresa de software do Brasil. ERP, fintech e business performance.", sparkline: [24, 25, 24.5, 26, 25.5, 27, 26.8, 27.5, 28, 27.8, 28.2, 28.5] },
  { ticker: "INTB3", nome: "Intelbras", setor: "Tecnologia & Software", preco: 18.90, variacao: 0.30, variacaoPct: 1.6, marketCap: "6.2B", volume: "2.8M", high52: 22.50, low52: 14.30, descricao: "Líder nacional em segurança eletrônica, comunicação e energia solar.", sparkline: [15, 15.5, 16, 16.2, 16.5, 17, 16.8, 17.5, 18, 17.8, 18.5, 18.9] },
  { ticker: "LWSA3", nome: "Locaweb", setor: "Tecnologia & Software", preco: 5.20, variacao: -0.04, variacaoPct: -0.8, marketCap: "3.1B", volume: "4.2M", high52: 8.50, low52: 4.10, descricao: "Plataforma de cloud, e-commerce e serviços digitais para PMEs brasileiras.", sparkline: [5.8, 5.6, 5.5, 5.7, 5.4, 5.3, 5.5, 5.2, 5.4, 5.3, 5.1, 5.2] },
  { ticker: "POSI3", nome: "Positivo Tecnologia", setor: "Tecnologia & Software", preco: 8.75, variacao: 0.18, variacaoPct: 2.1, marketCap: "1.3B", volume: "1.5M", high52: 10.80, low52: 5.90, descricao: "Fabricante de computadores, servidores e soluções de TI. Hardware soberano.", sparkline: [7, 7.2, 7.5, 7.3, 7.8, 7.6, 8, 8.2, 8, 8.4, 8.6, 8.75] },
  { ticker: "VLID3", nome: "Valid", setor: "Tecnologia & Software", preco: 22.80, variacao: 0.23, variacaoPct: 1.0, marketCap: "1.9B", volume: "0.9M", high52: 26.50, low52: 18.20, descricao: "Identidade digital, meios de pagamento e certificação. Infraestrutura soberana de dados.", sparkline: [20, 20.5, 20.8, 21, 20.8, 21.5, 21.2, 22, 21.8, 22.3, 22.5, 22.8] },
  { ticker: "DESK3", nome: "Desktop", setor: "Tecnologia & Software", preco: 16.50, variacao: 0.39, variacaoPct: 2.4, marketCap: "2.4B", volume: "1.1M", high52: 18.20, low52: 8.50, descricao: "Provedor de internet fibra óptica no interior de São Paulo. Conectividade soberana.", sparkline: [12, 12.5, 13, 13.5, 14, 13.8, 14.5, 15, 14.8, 15.5, 16, 16.5] },

  // ── Saúde & Farmacêutica ──
  { ticker: "FLRY3", nome: "Fleury", setor: "Saúde & Farmacêutica", preco: 15.60, variacao: 0.12, variacaoPct: 0.8, marketCap: "8.4B", volume: "3.8M", high52: 18.50, low52: 12.80, descricao: "Maior rede de medicina diagnóstica do Brasil. Laboratórios e centros de imagem.", sparkline: [14, 14.3, 14.5, 14.2, 14.8, 14.5, 15, 14.8, 15.2, 15.4, 15.5, 15.6] },
  { ticker: "HAPV3", nome: "Hapvida", setor: "Saúde & Farmacêutica", preco: 4.10, variacao: -0.02, variacaoPct: -0.5, marketCap: "30B", volume: "25.1M", high52: 5.80, low52: 3.20, descricao: "Maior operadora de saúde do Brasil. Modelo verticalizado com hospitais próprios.", sparkline: [4.6, 4.5, 4.4, 4.5, 4.3, 4.2, 4.4, 4.1, 4.3, 4.2, 4.05, 4.1] },
  { ticker: "HYPE3", nome: "Hypera Pharma", setor: "Saúde & Farmacêutica", preco: 28.90, variacao: 0.34, variacaoPct: 1.2, marketCap: "18.3B", volume: "4.5M", high52: 35.20, low52: 24.50, descricao: "Maior farmacêutica do Brasil. Portfólio de medicamentos OTC e prescrição.", sparkline: [25, 25.5, 26, 26.3, 26.8, 27, 26.8, 27.5, 28, 28.2, 28.5, 28.9] },
  { ticker: "RANI3", nome: "Irani", setor: "Manufatura Avançada & Materiais", preco: 8.30, variacao: 0.11, variacaoPct: 1.4, marketCap: "2.1B", volume: "1.4M", high52: 10.50, low52: 6.20, descricao: "Embalagens sustentáveis de papel ondulado e resina. Economia circular.", sparkline: [7, 7.2, 7.1, 7.5, 7.3, 7.6, 7.8, 7.5, 8, 8.1, 8.2, 8.3] },
  { ticker: "KLBN11", nome: "Klabin", setor: "Manufatura Avançada & Materiais", preco: 21.40, variacao: 0.06, variacaoPct: 0.3, marketCap: "23.5B", volume: "8.2M", high52: 25.80, low52: 18.50, descricao: "Maior produtora e exportadora de papéis para embalagem do Brasil.", sparkline: [20, 20.3, 20.5, 20.2, 20.8, 20.5, 21, 20.8, 21.2, 21, 21.3, 21.4] },
  { ticker: "ALPA4", nome: "Alpargatas", setor: "Manufatura Avançada & Materiais", preco: 7.80, variacao: -0.09, variacaoPct: -1.1, marketCap: "4.2B", volume: "5.5M", high52: 12.50, low52: 6.80, descricao: "Dona da Havaianas. Calçados brasileiros reconhecidos globalmente.", sparkline: [8.5, 8.3, 8.1, 8.2, 8, 7.9, 8.1, 7.8, 8, 7.7, 7.9, 7.8] },
  { ticker: "MTSA4", nome: "Metisa", setor: "Manufatura Avançada & Materiais", preco: 22.50, variacao: 0.20, variacaoPct: 0.9, marketCap: "0.4B", volume: "0.1M", high52: 25.80, low52: 18.50, descricao: "Implementos agrícolas e peças para máquinas. Metal transformado em produtividade.", sparkline: [20, 20.5, 20.8, 21, 20.5, 21.2, 21.5, 21.8, 22, 21.8, 22.3, 22.5] },
];

function Sparkline({
  data,
  color,
  id,
}: {
  data: number[];
  color: string;
  id: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 240;
  const h = 36;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polylinePoints = points.join(" ");
  const areaPoints = `0,${h} ${polylinePoints} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${id})`} />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniSparkline({
  data,
  positive,
}: {
  data: number[];
  positive: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#45a832" : "#F45141"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RastreadorB3() {
  useScrollReveal();
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("Todos");
  const [sort, setSort] = useState("sector");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [liveTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    acoes.forEach((a) => {
      counts[a.setor] = (counts[a.setor] || 0) + 1;
    });
    return counts;
  }, []);

  const filtradas = useMemo(() => {
    const filtered = acoes
      .filter((a) => {
        const matchBusca =
          busca === "" ||
          a.ticker.toLowerCase().includes(busca.toLowerCase()) ||
          a.nome.toLowerCase().includes(busca.toLowerCase());
        const matchSetor = setor === "Todos" || a.setor === setor;
        return matchBusca && matchSetor;
      });

    if (sort === "sector") {
      return filtered.sort((a, b) => {
        const aIdx = sectorOrder.indexOf(a.setor);
        const bIdx = sectorOrder.indexOf(b.setor);
        if (aIdx !== bIdx) return aIdx - bIdx;
        return a.ticker.localeCompare(b.ticker);
      });
    }
    if (sort === "ticker") return filtered.sort((a, b) => a.ticker.localeCompare(b.ticker));
    if (sort === "preco-desc") return filtered.sort((a, b) => b.preco - a.preco);
    if (sort === "preco-asc") return filtered.sort((a, b) => a.preco - b.preco);
    if (sort === "variacao-desc") return filtered.sort((a, b) => b.variacaoPct - a.variacaoPct);
    if (sort === "variacao-asc") return filtered.sort((a, b) => a.variacaoPct - b.variacaoPct);
    if (sort === "marketcap") return filtered.sort((a, b) => {
      const parse = (s: string) => {
        const num = parseFloat(s);
        if (s.endsWith("B")) return num * 1000;
        return num;
      };
      return parse(b.marketCap) - parse(a.marketCap);
    });
    return filtered;
  }, [busca, setor, sort, sectorCounts]);

  const totalMarketCap = useMemo(() => {
    let total = 0;
    acoes.forEach((a) => {
      const num = parseFloat(a.marketCap);
      if (a.marketCap.endsWith("B")) total += num;
      else total += num / 1000;
    });
    return `R$${total.toFixed(0)}B`;
  }, []);

  const gainers = acoes.filter((a) => a.variacaoPct > 0).length;
  const losers = acoes.filter((a) => a.variacaoPct < 0).length;
  const avgChange =
    acoes.reduce((sum, a) => sum + a.variacaoPct, 0) / acoes.length;

  const groupedBySector = useMemo(() => {
    if (sort !== "sector" || setor !== "Todos") return null;
    const groups: { sector: string; stocks: Acao[] }[] = [];
    let currentSector = "";
    filtradas.forEach((stock) => {
      if (stock.setor !== currentSector) {
        currentSector = stock.setor;
        groups.push({ sector: currentSector, stocks: [] });
      }
      groups[groups.length - 1].stocks.push(stock);
    });
    return groups;
  }, [filtradas, sort, setor]);

  const renderCard = (stock: Acao) => {
    const sector = sectorConfig[stock.setor] || sectorConfig["Manufatura Avançada & Materiais"];
    const isPositive = stock.variacaoPct >= 0;
    return (
      <div
        key={stock.ticker}
        className="bg-[#F8F6E8] border border-[#463C2E]/10 p-4 transition-all duration-200 hover:border-[#463C2E]/25 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex justify-between items-start mb-1.5">
          <span
            className="text-[15px] font-bold text-[#463C2E] tracking-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {stock.ticker}
          </span>
          <span
            className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 ${sector.bgClass} ${sector.textClass}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {sector.shortLabel}
          </span>
        </div>

        <div className="text-[13px] text-[#463C2E]/50 mb-3 line-clamp-1">
          {stock.nome}
        </div>

        <div className="flex items-baseline gap-2.5 mb-0.5">
          <span
            className="text-[24px] font-bold text-[#463C2E] leading-none"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {stock.preco.toFixed(2)}
          </span>
          <span
            className={`text-[12px] font-semibold px-1.5 py-0.5 ${
              isPositive
                ? "bg-[#45a832]/10 text-[#45a832]"
                : stock.variacaoPct === 0
                  ? "bg-[#463C2E]/5 text-[#463C2E]/40"
                  : "bg-[#F45141]/10 text-[#F45141]"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {isPositive ? "+" : ""}
            {stock.variacaoPct.toFixed(1)}%
          </span>
        </div>

        <div className="h-[36px] mt-2 mb-3 opacity-80">
          <Sparkline
            data={stock.sparkline}
            color={sector.sparkColor}
            id={stock.ticker}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-[#463C2E]/30" style={{ fontFamily: "var(--font-mono)" }}>
              Mkt Cap
            </span>
            <span className="text-[#463C2E]/60 font-medium" style={{ fontFamily: "var(--font-mono)" }}>
              R${stock.marketCap}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#463C2E]/30" style={{ fontFamily: "var(--font-mono)" }}>
              Volume
            </span>
            <span className="text-[#463C2E]/60 font-medium" style={{ fontFamily: "var(--font-mono)" }}>
              {stock.volume}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#463C2E]/30" style={{ fontFamily: "var(--font-mono)" }}>
              52s Alta
            </span>
            <span className="text-[#463C2E]/60 font-medium" style={{ fontFamily: "var(--font-mono)" }}>
              {stock.high52.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#463C2E]/30" style={{ fontFamily: "var(--font-mono)" }}>
              52s Baixa
            </span>
            <span className="text-[#463C2E]/60 font-medium" style={{ fontFamily: "var(--font-mono)" }}>
              {stock.low52.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#463C2E]/35 mt-3 pt-3 border-t border-[#463C2E]/8 line-clamp-3 leading-relaxed">
          {stock.descricao}
        </p>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero — two-column like BA */}
        <section className="bg-[#463C2E] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#F8F6E8 1px, transparent 1px), linear-gradient(90deg, #F8F6E8 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:h-[476px]">
            <div className="w-full lg:w-1/2 px-5 lg:pl-10 lg:pr-10 pt-40 pb-16 lg:pb-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  className="text-accents text-[#F8F6E8]/50 mb-8 border-l-[1px] border-[#F45141] pl-5 py-[9px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  PROJETO / DADOS
                </p>
                <h1
                  className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.04em] text-[#F8F6E8]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Rastreador B3
                </h1>
                <p
                  className="text-[#F8F6E8]/40 mt-4 text-[13px] tracking-tight"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {acoes.length} Empresas · {sectorOrder.length} Setores · Dados Simulados
                </p>
                <p className="text-[#F8F6E8]/60 mt-6 max-w-[500px] text-[14px] lg:text-[16px] leading-[140%]">
                  Acompanhamento de {acoes.length} empresas listadas na B3 que constroem capacidade soberana em defesa, manufatura avançada, energia limpa, agtech, infraestrutura, tecnologia e saúde.
                </p>
              </motion.div>
            </div>
            <div className="hidden lg:block w-1/2 relative">
              <img
                src="/images/hero.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#463C2E] via-[#463C2E]/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* Content — cream bg like BA */}
        <section className="bg-[#F8F6E8] py-10 px-5 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6 fade-in-up">
              <div className="bg-[#F8F6E8] border border-[#463C2E]/10 p-3">
                <div
                  className="text-[10px] uppercase tracking-wide text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Empresas
                </div>
                <div
                  className="text-[22px] font-bold mt-0.5 leading-tight text-[#417CE5]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {acoes.length}
                </div>
              </div>
              <div className="bg-[#F8F6E8] border border-[#463C2E]/10 p-3">
                <div
                  className="text-[10px] uppercase tracking-wide text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Market Cap Total
                </div>
                <div
                  className="text-[22px] font-bold mt-0.5 leading-tight text-[#417CE5]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {totalMarketCap}
                </div>
              </div>
              <div className="bg-[#F8F6E8] border border-[#463C2E]/10 p-3">
                <div
                  className="text-[10px] uppercase tracking-wide text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Altas Hoje
                </div>
                <div
                  className="text-[22px] font-bold mt-0.5 leading-tight text-[#45a832]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {gainers}
                </div>
              </div>
              <div className="bg-[#F8F6E8] border border-[#463C2E]/10 p-3">
                <div
                  className="text-[10px] uppercase tracking-wide text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Quedas Hoje
                </div>
                <div
                  className="text-[22px] font-bold mt-0.5 leading-tight text-[#F45141]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {losers}
                </div>
              </div>
              <div className="bg-[#F8F6E8] border border-[#463C2E]/10 p-3">
                <div
                  className="text-[10px] uppercase tracking-wide text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Variação Média
                </div>
                <div
                  className={`text-[22px] font-bold mt-0.5 leading-tight ${avgChange >= 0 ? "text-[#45a832]" : "text-[#F45141]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {avgChange >= 0 ? "+" : ""}
                  {avgChange.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-[#463C2E]/10 fade-in-up stagger-2">
              {/* Live indicator */}
              <div className="flex items-center gap-2 mr-auto">
                <span className="w-2 h-2 rounded-full bg-[#45a832] animate-pulse" />
                <span
                  className="text-[12px] text-[#463C2E]/50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Simulado · {liveTime}
                </span>
              </div>

              {/* Search */}
              <div className="relative order-3 lg:order-none w-full lg:w-auto">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#463C2E]/30"
                >
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar ticker ou nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="bg-[#F8F6E8] border border-[#463C2E]/15 pl-9 pr-4 py-2 text-[12px] text-[#463C2E] placeholder:text-[#463C2E]/30 focus:border-[#417CE5] focus:outline-none transition-colors w-full lg:w-[200px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[#F8F6E8] border border-[#463C2E]/15 text-[#463C2E]/60 text-[12px] tracking-tight px-3 py-2 appearance-none cursor-pointer focus:outline-none transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <option value="sector">Ordenar: Setor</option>
                <option value="ticker">Ordenar: Ticker A-Z</option>
                <option value="preco-desc">Ordenar: Preço ↓</option>
                <option value="preco-asc">Ordenar: Preço ↑</option>
                <option value="variacao-desc">Ordenar: Melhor Perf.</option>
                <option value="variacao-asc">Ordenar: Pior Perf.</option>
                <option value="marketcap">Ordenar: Market Cap</option>
              </select>

              {/* Grid / Table toggle */}
              <div className="flex border border-[#463C2E]/15 divide-x divide-[#463C2E]/15">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 transition-colors duration-200 ${
                    view === "grid"
                      ? "bg-[#463C2E] text-[#F8F6E8]"
                      : "text-[#463C2E]/40 hover:text-[#463C2E]/60"
                  }`}
                  aria-label="Visualização em grade"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("table")}
                  className={`p-2 transition-colors duration-200 ${
                    view === "table"
                      ? "bg-[#463C2E] text-[#F8F6E8]"
                      : "text-[#463C2E]/40 hover:text-[#463C2E]/60"
                  }`}
                  aria-label="Visualização em tabela"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={() => window.location.reload()}
                className="border border-[#463C2E]/15 px-3 py-2 text-[12px] text-[#463C2E]/50 hover:text-[#463C2E]/70 transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Atualizar
              </button>
            </div>

            {/* Sector filters */}
            <div className="flex flex-wrap gap-1.5 mb-6 fade-in-up stagger-3">
              <button
                onClick={() => setSetor("Todos")}
                className={`text-[11px] uppercase tracking-tight px-3 py-1.5 border transition-all duration-200 whitespace-nowrap ${
                  setor === "Todos"
                    ? "border-[#463C2E]/30 text-[#463C2E] bg-[#463C2E]/5"
                    : "border-[#463C2E]/10 text-[#463C2E]/40 hover:border-[#463C2E]/20 hover:text-[#463C2E]/60 bg-[#F8F6E8]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Todos ({acoes.length})
              </button>
              {sectorOrder.map((s) => {
                const config = sectorConfig[s];
                const count = sectorCounts[s] || 0;
                if (!count) return null;
                const isActive = setor === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSetor(s)}
                    className={`text-[11px] uppercase tracking-tight px-3 py-1.5 border transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? `border-current ${config.textClass} ${config.bgClass}`
                        : "border-[#463C2E]/10 text-[#463C2E]/40 hover:border-[#463C2E]/20 hover:text-[#463C2E]/60 bg-[#F8F6E8]"
                    }`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {config.shortLabel} ({count})
                  </button>
                );
              })}
            </div>

            {/* === GRID VIEW === */}
            {view === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {groupedBySector
                  ? groupedBySector.map((group) => {
                      const config = sectorConfig[group.sector];
                      return [
                        <div
                          key={`header-${group.sector}`}
                          className="col-span-full flex items-center gap-3 pt-6 pb-2 border-b border-[#463C2E]/10 first:pt-0"
                        >
                          <span
                            className={`text-[13px] uppercase tracking-tight font-semibold ${config?.textClass || "text-[#463C2E]"}`}
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {group.sector}
                          </span>
                          <span
                            className="text-[11px] text-[#463C2E]/30 bg-[#E4DECC] px-2 py-0.5"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {group.stocks.length}
                          </span>
                        </div>,
                        ...group.stocks.map(renderCard),
                      ];
                    })
                  : filtradas.map(renderCard)}
              </div>
            )}

            {/* === TABLE VIEW === */}
            {view === "table" && (
              <div className="overflow-x-auto bg-[#F8F6E8] border border-[#463C2E]/10">
                <table className="w-full text-[13px] min-w-[1000px]">
                  <thead>
                    <tr className="border-b-2 border-[#463C2E]/15">
                      {["Ticker", "Empresa", "Setor", "Preço", "Variação", "Var. %", "Mkt Cap", "Volume", "52s Range", "Gráfico"].map((col) => (
                        <th
                          key={col}
                          className="text-left py-3 px-3 text-[10px] uppercase tracking-wide text-[#463C2E]/40 font-normal"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((a) => {
                      const sector = sectorConfig[a.setor] || sectorConfig["Manufatura Avançada & Materiais"];
                      const isPositive = a.variacaoPct >= 0;
                      return (
                        <tr
                          key={a.ticker}
                          className="border-b border-[#463C2E]/8 hover:bg-[#E4DECC]/50 transition-colors"
                        >
                          <td
                            className="py-3 px-3 font-bold text-[#463C2E] tracking-tight"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {a.ticker}
                          </td>
                          <td className="py-3 px-3 text-[#463C2E]/60 max-w-[200px] truncate">
                            {a.nome}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 ${sector.bgClass} ${sector.textClass}`}
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {sector.shortLabel}
                            </span>
                          </td>
                          <td
                            className="py-3 px-3 text-[#463C2E] tabular-nums"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {a.preco.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`tabular-nums ${isPositive ? "text-[#45a832]" : "text-[#F45141]"}`}
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {isPositive ? "+" : ""}
                              {a.variacao.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[12px] font-semibold px-1.5 py-0.5 ${
                                isPositive
                                  ? "bg-[#45a832]/10 text-[#45a832]"
                                  : "bg-[#F45141]/10 text-[#F45141]"
                              }`}
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {isPositive ? "+" : ""}
                              {a.variacaoPct.toFixed(1)}%
                            </span>
                          </td>
                          <td
                            className="py-3 px-3 text-[#463C2E]/60"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            R${a.marketCap}
                          </td>
                          <td
                            className="py-3 px-3 text-[#463C2E]/60"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {a.volume}
                          </td>
                          <td
                            className="py-3 px-3 text-[#463C2E]/50 text-[11px]"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {a.low52.toFixed(2)} – {a.high52.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            <MiniSparkline
                              data={a.sparkline}
                              positive={a.variacaoPct >= 0}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filtradas.length === 0 && (
              <div className="py-16 text-center">
                <p
                  className="text-[11px] uppercase tracking-wide text-[#463C2E]/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  NENHUMA EMPRESA ENCONTRADA
                </p>
              </div>
            )}

            {/* Disclaimer — centered like BA */}
            <div className="mt-10 pt-6 border-t border-[#463C2E]/10 text-center">
              <p
                className="text-[10px] uppercase tracking-wide text-[#463C2E]/25 leading-relaxed"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Dados simulados para fins de demonstração. Em produção, preços virão via API da B3 com atualização em tempo real. Não constitui recomendação de investimento.
              </p>
              <p
                className="text-[10px] uppercase tracking-wide text-[#463C2E]/25 mt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Curado com tese de capacidade soberana.
              </p>
            </div>
          </div>
        </section>

        {/* Join the Movement CTA */}
        <section className="relative min-h-[600px] flex flex-col lg:flex-row w-full">
          <img src="/images/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />

          <div className="lg:w-2/3 pt-10 pb-5 lg:py-10 z-[2] relative px-5 lg:pl-10 flex flex-col gap-6 justify-between">
            <h2 className="text-[#F8F6E8] text-h3 font-bold flex flex-col" style={{ fontFamily: "var(--font-heading)" }}>
              <span>Junte-se ao</span><span>Movimento</span>
            </h2>
            <div className="lg:max-w-[412px] text-[#F8F6E8]/70 text-paragraphs flex flex-col gap-8">
              <p>Nossa comunidade é aberta e ambiciosa. Somos empreendedores, criadores, construtores. Pessoas que acreditam, que tentam.</p>
              <p>Alta agência, com altas expectativas de que podemos construir um Brasil melhor.</p>
            </div>
          </div>

          <div className="lg:w-1/3 z-[2] relative px-2.5 lg:pr-5 lg:pl-0 flex-1">
            <div className="px-2.5 lg:px-5 relative py-5 lg:py-10 border-t-[0.5px] border-t-[#F8F6E8]/30 lg:border-t-0 h-full">
              <form className="bg-[rgba(228,222,204,0.30)] p-8 border border-[#463C2E]/40 relative z-10" style={{ boxShadow: "var(--shadow-md)" }}>
                <div className="text-paragraphs text-[#463C2E] font-bold" style={{ fontFamily: "var(--font-heading)" }}>Participe</div>
                <div className="pt-5" style={{ fontFamily: "var(--font-mono)" }}>
                  <input type="text" placeholder="NOME" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
                  <input type="text" placeholder="SOBRENOME" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
                  <input type="email" placeholder="EMAIL" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
                  <select required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent appearance-none cursor-pointer">
                    <option value="" disabled selected>ESTADO</option>
                    <option value="ac">Acre</option><option value="al">Alagoas</option><option value="am">Amazonas</option>
                    <option value="ba">Bahia</option><option value="ce">Ceará</option><option value="df">Distrito Federal</option>
                    <option value="es">Espírito Santo</option><option value="go">Goiás</option><option value="ma">Maranhão</option>
                    <option value="mg">Minas Gerais</option><option value="ms">Mato Grosso do Sul</option><option value="mt">Mato Grosso</option>
                    <option value="pa">Pará</option><option value="pb">Paraíba</option><option value="pe">Pernambuco</option>
                    <option value="pi">Piauí</option><option value="pr">Paraná</option><option value="rj">Rio de Janeiro</option>
                    <option value="rn">Rio Grande do Norte</option><option value="ro">Rondônia</option><option value="rr">Roraima</option>
                    <option value="rs">Rio Grande do Sul</option><option value="sc">Santa Catarina</option><option value="se">Sergipe</option>
                    <option value="sp">São Paulo</option><option value="to">Tocantins</option><option value="exterior">Exterior</option>
                  </select>
                  <input type="text" placeholder="PROFISSÃO" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
                </div>
                <button type="submit" className="uppercase leading-none flex gap-2 px-4 py-3.5 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between mt-10 transition-all duration-300 hover:opacity-80 cursor-pointer text-accents" style={{ fontFamily: "var(--font-mono)" }}>
                  <span>JUNTE-SE AO MOVIMENTO</span>
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="#F8F6E8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
