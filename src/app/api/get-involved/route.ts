import { NextRequest, NextResponse } from "next/server";
import { getResend, esc, clean, isValidEmail, addToAudience, emailLayout, emailButton, TO, FROM, SITE_URL } from "@/lib/email";

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
      subject: "Bem-vindo ao movimento: Pax Brasiliana",
      html: emailLayout({
        preheader: "Recebemos seu interesse. O Brasil precisa de gente como você.",
        heroImage: `${SITE_URL}/images/hangar-drones.png`,
        heroAlt: "Ilustração de um hangar industrial brasileiro",
        body: `
          <p style="margin:0 0 16px;">Olá, ${esc(nome)}.</p>
          <p style="margin:0 0 16px;">Recebemos seu interesse em fazer parte da Pax Brasiliana, e isso significa muito pra gente.</p>
          <p style="margin:0 0 16px;">O Brasil tem gente capaz de construir coisas grandes. O que falta, na maioria das vezes, é direção e companhia. É exatamente isso que estamos tentando criar: um movimento de gente que decidiu parar de esperar e começar a construir.</p>
          <p style="margin:0 0 24px;">Vamos entrar em contato em breve com formas concretas de você ajudar. Enquanto isso, dois jeitos rápidos de já se aprofundar:</p>
          <p style="margin:0 0 12px;">${emailButton("Ler o manifesto", `${SITE_URL}/manifesto`)}</p>
          <p style="margin:0 0 24px;">${emailButton("Ler o último ensaio", `${SITE_URL}/ensaios/construida-nao-herdada`)}</p>
          <p style="margin:0;">Responda este email e conta um pouco mais sobre você: o que você faz, onde mora, onde gostaria de ajudar. A gente lê tudo, e isso ajuda a gente saber quem está do nosso lado.</p>
          <p style="margin:24px 0 0;">O Brasil precisa de gente como você.</p>
          <p style="margin:8px 0 0;">Pax Brasiliana</p>
        `,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[get-involved]", err);
    return NextResponse.json({ error: "Erro ao processar inscrição." }, { status: 500 });
  }
}
