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
      html: `
        <p>Olá, ${esc(nome)}.</p>
        <p>Recebemos seu interesse em contribuir com a Pax Brasiliana. Analisaremos seu perfil e entraremos em contato em breve.</p>
        <p>— Pax Brasiliana</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contribute]", err);
    return NextResponse.json({ error: "Erro ao enviar interesse." }, { status: 500 });
  }
}
