import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, clean, isValidEmail, addToAudience, emailLayout, emailButton, FROM, SITE_URL } from "@/lib/email";

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
      subject: "Inscrição confirmada: newsletter da Pax Brasiliana",
      html: emailLayout({
        preheader: "Que bom ter você com a gente. A partir de agora você acompanha o que estamos construindo.",
        heroImage: `${SITE_URL}/images/cidade-futura.png`,
        heroAlt: "Ilustração de uma cidade brasileira futurista",
        body: `
          <p style="margin:0 0 16px;">Olá, ${esc(displayName)}.</p>
          <p style="margin:0 0 16px;">Que bom ter você com a gente.</p>
          <p style="margin:0 0 16px;">A Pax Brasiliana existe porque o Brasil parou de tentar construir coisas grandes, e isso tem um custo real: indústria, tecnologia, infraestrutura e ambição que ficaram pelo caminho. Estamos aqui pra provar que o Brasil ainda pode construir.</p>
          <p style="margin:0 0 24px;">A partir de agora você recebe o que estamos descobrindo e construindo: o que o Brasil produz, o que poderia produzir, quais cadeias produtivas estão travadas e quem já está trabalhando pra destravar isso.</p>
          <p style="margin:0 0 24px;">Pra começar, dá uma olhada no manifesto:</p>
          <p style="margin:0 0 24px;">${emailButton("Ler o manifesto", `${SITE_URL}/manifesto`)}</p>
          <p style="margin:0;">Se quiser bater um papo, é só responder este email. A gente lê tudo.</p>
          <p style="margin:24px 0 0;">Pax Brasiliana</p>
        `,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Erro ao processar inscrição." }, { status: 500 });
  }
}
