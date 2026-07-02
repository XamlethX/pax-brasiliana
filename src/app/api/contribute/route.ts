import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, clean, isValidEmail, emailLayout, emailButton, TO, FROM, SITE_URL } from "@/lib/email";

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
    const timeAllocation = clean(body?.timeAllocation);
    const capabilities = clean(body?.capabilities);
    const pastProjects = clean(body?.pastProjects);
    const preference = clean(body?.preference);

    if (!nome || !capabilities || !isValidEmail(email)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes ou inválidos." }, { status: 400 });
    }

    const preferenceLabel =
      preference === "lead" ? "Capaz de liderar projetos" :
      preference === "contribute" ? "Apenas contribuir" :
      preference === "either" ? "Aberto a ambos" : preference || "—";

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Contribuir] ${nome} quer contribuir`,
      html: `
        <p><strong>Nome:</strong> ${esc(nome)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Disponibilidade:</strong> ${esc(timeAllocation) || "—"}</p>
        <p><strong>Habilidades:</strong></p>
        <p style="white-space:pre-wrap">${esc(capabilities)}</p>
        <p><strong>Experiência anterior:</strong></p>
        <p style="white-space:pre-wrap">${esc(pastProjects) || "—"}</p>
        <p><strong>Preferência de envolvimento:</strong> ${esc(preferenceLabel)}</p>
      `,
    });

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Interesse recebido — Pax Brasiliana",
      html: emailLayout({
        preheader: "Recebemos seu interesse em contribuir. Vamos entrar em contato em breve.",
        body: `
          <p style="margin:0 0 16px;">Olá, ${esc(nome)}.</p>
          <p style="margin:0 0 16px;">Recebemos seu interesse em contribuir com a Pax Brasiliana. Vamos ler seu perfil com atenção e entrar em contato em breve com formas concretas de ajudar.</p>
          <p style="margin:0 0 24px;">Enquanto isso, um jeito rápido de se aprofundar:</p>
          <p style="margin:0;">${emailButton("Ler o manifesto", `${SITE_URL}/manifesto`)}</p>
        `,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contribute]", err);
    return NextResponse.json({ error: "Erro ao enviar interesse." }, { status: 500 });
  }
}
