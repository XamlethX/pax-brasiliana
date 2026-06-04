import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, clean, isValidEmail, TO, FROM } from "@/lib/email";

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
    const email = clean(body?.email);
    const assunto = clean(body?.assunto);
    const mensagem = clean(body?.mensagem);

    if (!nome || !assunto || !mensagem || !isValidEmail(email)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes ou inválidos." }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Contato] ${assunto}`,
      html: `
        <p><strong>Nome:</strong> ${esc(nome)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Assunto:</strong> ${esc(assunto)}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="white-space:pre-wrap">${esc(mensagem)}</p>
      `,
    });

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Recebemos sua mensagem — Pax Brasiliana",
      html: `
        <p>Olá, ${esc(nome)}.</p>
        <p>Recebemos sua mensagem e retornaremos em breve.</p>
        <p>— Pax Brasiliana</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Erro ao enviar mensagem." }, { status: 500 });
  }
}
