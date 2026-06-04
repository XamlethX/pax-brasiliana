import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, clean, isValidEmail, addToAudience, FROM } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Email não configurado." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { company } = body ?? {};

    // Honeypot: bots fill hidden fields. Pretend success, do nothing.
    if (company) return NextResponse.json({ ok: true });

    const email = clean(body?.email);
    const nome = clean(body?.nome);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Informe um email válido." }, { status: 400 });
    }

    const displayName = nome || "construtor";
    const firstName = nome ? nome.split(" ")[0] : undefined;
    const lastName = nome ? nome.split(" ").slice(1).join(" ") || undefined : undefined;

    await addToAudience(resend, { email, firstName, lastName });

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Inscrição confirmada — Newsletter Pax Brasiliana",
      html: `
        <p>Olá, ${esc(displayName)}.</p>
        <p>Sua inscrição na newsletter da Pax Brasiliana está confirmada.</p>
        <p>Você receberá análises mensais sobre indústria, tecnologia e construção nacional.</p>
        <p>— Pax Brasiliana</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Erro ao processar inscrição." }, { status: 500 });
  }
}
