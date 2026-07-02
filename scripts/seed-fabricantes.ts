/**
 * Seed / sync the Supabase `fabricantes` table from the curated static dataset
 * in src/data/fabricantes.ts.
 *
 * Usage:
 *   npx tsx scripts/seed-fabricantes.ts [--prune]
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (read from
 * .env.local automatically). Idempotent — upserts by `id`, so re-running just
 * refreshes the rows.
 *
 * --prune: além do upsert, apaga do banco as linhas com id DENTRO da faixa do
 * dataset estático que não existem mais nele (ex.: duplicatas removidas na
 * curadoria). Linhas com id acima da faixa (contribuições promovidas
 * manualmente) nunca são tocadas.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { fabricantes, mncIds } from "../src/data/fabricantes";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── minimal .env.local loader (no extra deps) ───────────────────────────────
function loadEnv(file: string) {
  try {
    const raw = readFileSync(resolve(__dirname, "..", file), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    /* file optional — vars may already be in the environment */
  }
}
loadEnv(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "✗ Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY (.env.local)."
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const rows = fabricantes.map((f) => ({
  id: f.id,
  nome: f.nome,
  website: f.website ?? null,
  cidade: f.localizacao?.cidade ?? null,
  estado: f.localizacao?.estado ?? null,
  sigla: f.localizacao?.sigla ?? null,
  setor: f.setor ?? null,
  produtos: f.produtos ?? [],
  descricao: f.descricao ?? null,
  fundacao: f.fundacao ?? null,
  funcionarios: f.funcionarios ?? null,
  origem: f.origem ?? (mncIds.has(f.id) ? "MNC" : "BR"),
  status: "aprovado" as const,
}));

async function main() {
  console.log(`→ Enviando ${rows.length} fabricantes para o Supabase...`);
  const BATCH = 200;
  let done = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from("fabricantes")
      .upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error("✗ Erro no upsert:", error.message);
      process.exit(1);
    }
    done += chunk.length;
    console.log(`  ${done}/${rows.length}`);
  }
  console.log("✓ Seed concluído.");

  if (process.argv.includes("--prune")) {
    const staticIds = new Set(rows.map((r) => r.id));
    const maxId = Math.max(...rows.map((r) => r.id));
    const { data, error } = await supabase
      .from("fabricantes")
      .select("id")
      .lte("id", maxId);
    if (error) {
      console.error("✗ Erro ao listar ids para prune:", error.message);
      process.exit(1);
    }
    const stale = (data ?? []).map((r) => r.id as number).filter((id) => !staticIds.has(id));
    if (stale.length === 0) {
      console.log("✓ Prune: nenhuma linha obsoleta.");
      return;
    }
    const { error: delError } = await supabase
      .from("fabricantes")
      .delete()
      .in("id", stale);
    if (delError) {
      console.error("✗ Erro no prune:", delError.message);
      process.exit(1);
    }
    console.log(`✓ Prune: ${stale.length} linhas obsoletas removidas (ids ≤ ${maxId}).`);
  }
}

main();
