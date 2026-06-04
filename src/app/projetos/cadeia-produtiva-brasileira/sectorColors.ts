// Sector → marker color map for the Cadeia Produtiva map and its legend.
// Kept in a standalone module (no maplibre deps) so it can be imported both
// by MapaBrasil (client-only, maplibre) and by page.tsx during SSR safely.

export const FALLBACK_COLOR = "#F8F6E8";

export const sectorColors: Readonly<Record<string, string>> = Object.freeze({
  "Aeroespacial": "#2563eb",
  "Agronegócio / Equipamentos": "#16a34a",
  "Alimentos": "#84cc16",
  "Autopeças": "#0891b2",
  "Automotivo": "#0891b2",
  "Baterias": "#f59e0b",
  "Biotecnologia / Saúde": "#db2777",
  "Calçados": "#a16207",
  "Celulose e Papel": "#65a30d",
  "Compressores / Manufatura": "#0891b2",
  "Construção / Infraestrutura": "#64748b",
  "Defesa": "#7c3aed",
  "Eletrônica": "#e11d48",
  "Energia / Petroquímica": "#ea580c",
  "Energia Renovável": "#16a34a",
  "Fundição": "#6d6300",
  "Logística": "#64748b",
  "Máquinas-Ferramentas": "#0284c7",
  "Materiais de Construção": "#78716c",
  "Mineração": "#dc2626",
  "Motores Elétricos": "#059669",
  "Petroquímica": "#ea580c",
  "Siderurgia": "#b91c1c",
  "Software Industrial": "#4f46e5",
  "Telecomunicações": "#7c3aed",
  "Têxtil": "#9333ea",
  "Veículos Pesados": "#1d4ed8",
  "Cosméticos / Higiene": "#be185d",
  "Química Industrial": "#0e7490",
  "Móveis": "#92400e",
});

export const colorFor = (setor: string) => sectorColors[setor] ?? FALLBACK_COLOR;
