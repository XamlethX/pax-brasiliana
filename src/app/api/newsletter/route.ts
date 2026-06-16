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
      subject: "Boas-vindas à Pax Brasiliana",
      html: emailLayout({
        preheader: "Que bom ter você com a gente. O Brasil ainda pode construir coisas grandes, e agora você faz parte disso.",
        introBody: `
          <p style="margin:0 0 16px;">Olá, ${esc(displayName)}.</p>
          <p style="margin:0 0 16px;">Que bom ter você com a gente.</p>
          <p style="margin:0 0 16px;">A Pax Brasiliana existe porque gente como você cansou de esperar que outra pessoa resolvesse o problema.</p>
          <p style="margin:0 0 16px;">A comunidade em que você acabou de entrar está cheia dessa gente: empreendedores, engenheiros, criadores e otimistas que acreditam que o futuro do Brasil é mais brilhante que o presente, e estão prontos pra colocar a mão na massa.</p>
          <p style="margin:0;">Pra ajudar este email a chegar sempre na sua caixa de entrada, clica em algum link aqui, ou responde dando um oi pro time da Pax Brasiliana.</p>
        `,
        heroImage: `${SITE_URL}/images/espacoporto-brasil.jpg`,
        heroAlt: "Base de lançamento brasileira em um vale, com a bandeira do Brasil",
        darkSection: `
          <p style="margin:0 0 20px; font-family:'Courier New', Courier, monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:#F8F6E8;">Algumas formas de se envolver</p>
          <p style="margin:0 0 16px;"><strong>Espalhe a palavra.</strong> Quantos graus de separação existem entre 200 milhões de brasileiros? Se alguém na sua rede pode ressoar com o que estamos construindo, comece a conversa.</p>
          <p style="margin:0 0 16px;"><strong>Escreva um ensaio.</strong> Se você tem algo a dizer sobre a ambição e os valores do Brasil, a gente quer ouvir. Esta é uma plataforma de ideias e educação.</p>
          <p style="margin:0 0 16px;"><strong>Contribua com um projeto.</strong> Estamos sempre buscando novas formas de mostrar e analisar o que importa pro Brasil. Se você quer construir ou propor uma ideia, fala com a gente.</p>
          <p style="margin:0 0 24px;"><strong>Apoie com uma doação.</strong> Somos um movimento enxuto, tocado por voluntários, com projetos ambiciosos pela frente. Cada contribuição vira combustível direto pra construir, e seria de grande ajuda pra manter tudo de pé.</p>
          <p style="margin:0;">${emailButton("Fazer uma doação", `${SITE_URL}/doar`)}&nbsp;&nbsp;${emailButton("Mande suas ideias", "mailto:contato@paxbrasiliana.com", "light")}</p>
        `,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Erro ao processar inscrição." }, { status: 500 });
  }
}
