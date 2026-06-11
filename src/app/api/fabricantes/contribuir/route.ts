import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";
import { getResend, esc, clean, FROM, TO } from "@/lib/email";

export const runtime = "nodejs";

/**
 * POST /api/fabricantes/contribuir
 *
 * Community submission of a new manufacturer. Persists to Supabase
 * `contribuicoes` (status = 'pendente') for later moderation, and notifies the
 * team by email. Submissions are NOT shown publicly until approved (promoted
 * into `fabricantes`).
 */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const nome = clean(body.nome);
  if (!nome || nome.length < 2) {
    return NextResponse.json({ error: "Informe o nome da empresa." }, { status: 400 });
  }

  const origemRaw = clean(body.origem).toUpperCase();
  const fundacaoNum = Number.parseInt(clean(body.fundacao), 10);
  const produtos = Array.isArray(body.produtos)
    ? (body.produtos as unknown[]).map((p) => clean(p)).filter(Boolean).slice(0, 20)
    : clean(body.produtos)
        .split(/[,;\n]/)
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 20);

  const record = {
    nome,
    website: clean(body.website) || null,
    cidade: clean(body.cidade) || null,
    estado: clean(body.estado) || null,
    sigla: clean(body.sigla).toUpperCase() || null,
    setor: clean(body.setor) || null,
    produtos,
    descricao: clean(body.descricao) || null,
    fundacao: Number.isFinite(fundacaoNum) ? fundacaoNum : null,
    funcionarios: clean(body.funcionarios) || null,
    origem: origemRaw === "MNC" ? "MNC" : "BR",
    contato_email: clean(body.contato_email) || null,
    status: "pendente" as const,
  };

  // Persist (admin bypasses RLS; anon also allowed by the insert policy).
  const db = getSupabaseAdmin() ?? getSupabase();
  if (db) {
    const { error } = await db.from("contribuicoes").insert(record);
    if (error) {
      return NextResponse.json(
        { error: "Não foi possível salvar a contribuição." },
        { status: 502 }
      );
    }
  } else if (!getResend()) {
    // No DB and no email — nowhere to send it.
    return NextResponse.json(
      { error: "Contribuições não estão configuradas no momento." },
      { status: 503 }
    );
  }

  // Best-effort team notification.
  const resend = getResend();
  if (resend) {
    try {
      await resend.emails.send({
        from: FROM,
        to: TO,
        subject: `Nova contribuição — Cadeia Produtiva: ${nome}`,
        html: `
          <h2>Nova fabricante submetida</h2>
          <p><strong>Empresa:</strong> ${esc(nome)}</p>
          <p><strong>Site:</strong> ${esc(record.website ?? "—")}</p>
          <p><strong>Local:</strong> ${esc(record.cidade ?? "—")} / ${esc(record.sigla ?? "—")}</p>
          <p><strong>Setor:</strong> ${esc(record.setor ?? "—")}</p>
          <p><strong>Origem:</strong> ${esc(record.origem)}</p>
          <p><strong>Produtos:</strong> ${esc(produtos.join(", ") || "—")}</p>
          <p><strong>Descrição:</strong> ${esc(record.descricao ?? "—")}</p>
          <p><strong>Funcionários:</strong> ${esc(record.funcionarios ?? "—")}</p>
          <p><strong>Fundação:</strong> ${esc(String(record.fundacao ?? "—"))}</p>
          <p><strong>Contato:</strong> ${esc(record.contato_email ?? "—")}</p>
        `,
      });
    } catch {
      /* notification is best-effort — the row is already saved */
    }
  }

  return NextResponse.json({ ok: true });
}
