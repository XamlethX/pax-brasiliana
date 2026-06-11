import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { fabricantes as staticFabricantes, mncIds, type Fabricante } from "@/data/fabricantes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Supabase queries go through the global fetch, which Next.js would otherwise
// cache in its persistent Data Cache (keyed by URL). That made the unfiltered
// list serve a stale snapshot after re-seeding / approving new fabricantes,
// while filtered URLs stayed fresh. Force every fetch in this route to no-store.
export const fetchCache = "force-no-store";

/**
 * GET /api/fabricantes
 *
 * Serves the Cadeia Produtiva index from Supabase, with optional server-side
 * filters. Falls back to the curated static dataset (src/data/fabricantes.ts)
 * whenever Supabase isn't configured or the query fails, so the page never
 * renders empty.
 *
 * Query params (all optional):
 *   q       — texto livre (nome / descrição / cidade)
 *   estado  — sigla da UF (ex.: SP)
 *   setor   — setor exato
 *   origem  — BR | MNC
 */

interface DbRow {
  id: number;
  nome: string;
  website: string | null;
  cidade: string | null;
  estado: string | null;
  sigla: string | null;
  setor: string | null;
  produtos: string[] | null;
  descricao: string | null;
  fundacao: number | null;
  funcionarios: string | null;
  origem: "BR" | "MNC" | null;
}

function rowToFabricante(r: DbRow): Fabricante {
  return {
    id: r.id,
    nome: r.nome,
    website: r.website ?? undefined,
    localizacao: {
      cidade: r.cidade ?? "",
      estado: r.estado ?? "",
      sigla: r.sigla ?? "",
    },
    setor: r.setor ?? "",
    produtos: r.produtos ?? [],
    descricao: r.descricao ?? "",
    fundacao: r.fundacao ?? undefined,
    funcionarios: r.funcionarios ?? undefined,
    origem: r.origem ?? undefined,
  };
}

/** Static dataset with `origem` resolved from mncIds, plus optional filtering. */
function staticPayload(params: URLSearchParams) {
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const estado = (params.get("estado") ?? "").trim().toUpperCase();
  const setor = (params.get("setor") ?? "").trim();
  const origem = (params.get("origem") ?? "").trim().toUpperCase();

  const list = staticFabricantes
    .map((f) => ({ ...f, origem: f.origem ?? (mncIds.has(f.id) ? "MNC" : "BR") }))
    .filter((f) => {
      if (estado && f.localizacao.sigla.toUpperCase() !== estado) return false;
      if (setor && f.setor !== setor) return false;
      if (origem && f.origem !== origem) return false;
      if (q) {
        const hay = `${f.nome} ${f.descricao} ${f.localizacao.cidade} ${f.produtos.join(
          " "
        )}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

  return { ok: true, source: "static", count: list.length, fabricantes: list };
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(staticPayload(params), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  }

  try {
    let query = supabase
      .from("fabricantes")
      .select(
        "id,nome,website,cidade,estado,sigla,setor,produtos,descricao,fundacao,funcionarios,origem"
      )
      .eq("status", "aprovado")
      .order("nome", { ascending: true })
      .limit(2000);

    const estado = (params.get("estado") ?? "").trim().toUpperCase();
    const setor = (params.get("setor") ?? "").trim();
    const origem = (params.get("origem") ?? "").trim().toUpperCase();
    const q = (params.get("q") ?? "").trim();

    if (estado) query = query.eq("sigla", estado);
    if (setor) query = query.eq("setor", setor);
    if (origem === "BR" || origem === "MNC") query = query.eq("origem", origem);
    if (q) {
      const safe = q.replace(/[%,]/g, " ");
      query = query.or(
        `nome.ilike.%${safe}%,descricao.ilike.%${safe}%,cidade.ilike.%${safe}%`
      );
    }

    const { data, error } = await query;
    if (error || !data) throw error ?? new Error("no data");

    const list = (data as DbRow[]).map(rowToFabricante);
    return NextResponse.json(
      { ok: true, source: "supabase", count: list.length, fabricantes: list },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } }
    );
  } catch {
    // Supabase down / misconfigured → never break the page.
    return NextResponse.json(staticPayload(params), {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
