import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, clean, isValidEmail, addToAudience, TO, FROM } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Email não configurado." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { company } = body ?? {};

    // Honeypot: bots fill this hidden field. Pretend success, do nothing.
    if (company) return NextResponse.json({ ok: true });

    const nome = clean(body?.nome);
    const sobrenome = clean(body?.sobrenome);
    const email = clean(body?.email);
    const estado = clean(body?.estado);
    const profissao = clean(body?.profissao);

    if (!nome || !isValidEmail(email)) {
      return NextResponse.json({ error: "Nome e email válido são obrigatórios." }, { status: 400 });
    }

    const nomeCompleto = [nome, sobrenome].filter(Boolean).join(" ");

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Participe] ${nomeCompleto} quer se juntar`,
      html: `
        <p><strong>Nome:</strong> ${esc(nomeCompleto)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Estado:</strong> ${esc(estado) || "—"}</p>
        <p><strong>Profissão:</strong> ${esc(profissao) || "—"}</p>
      `,
    });

    await addToAudience(resend, { email, firstName: nome, lastName: sobrenome });

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Bem-vindo ao movimento — Pax Brasiliana",
      html: `
        <p>Olá, ${esc(nome)}.</p>
        <p>Recebemos seu interesse em participar da Pax Brasiliana. Entraremos em contato em breve.</p>
        <p>O Brasil precisa de pessoas como você.</p>
        <p>— Pax Brasiliana</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[get-involved]", err);
    return NextResponse.json({ error: "Erro ao processar inscrição." }, { status: 500 });
  }
}
