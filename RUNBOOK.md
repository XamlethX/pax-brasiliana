# RUNBOOK — Recuperação de produção (paxbrasiliana.com)

Estado auditado em 2026-07-02. Este documento é paint-by-numbers: siga na
ordem, e **depois de cada seção rode a verificação** — o endpoint
`/api/status` diz exatamente o que ainda falta e aponta de volta pra seção
certa deste arquivo.

**PRAZO CRÍTICO: o token da Melhor Envio em produção expira ~2026-07-15.**
Sem a § 1 + § 2 feitas antes disso, o cálculo de frete morre e a loja para de
vender (o checkout agora recusa venda sem frete confirmado, de propósito).

Como verificar a qualquer momento:

```bash
# produção (depois da § 0):
curl -s "https://paxbrasiliana.com/api/status?key=SEU_STATUS_SECRET" | python3 -m json.tool
# local:
curl -s "http://localhost:3000/api/status" | python3 -m json.tool
```

`ok: true` = lançável. Cada item de `pendencias` referencia a seção que o resolve.

---

## § 0 — STATUS_SECRET (2 min, só uma vez)

1. Gere um segredo: `openssl rand -hex 16`
2. Vercel → projeto → Settings → Environment Variables → adicione
   `STATUS_SECRET` = (o valor gerado) em **Production**.
3. Redeploy (Deployments → ⋯ → Redeploy).
4. Verifique: o curl de produção acima deve responder JSON (401 sem a key,
   JSON com a key certa).

> Env local: adicione `STATUS_SECRET=` no `.env.local` só se quiser testar o
> gate; em dev o endpoint é aberto.

## § 1 — Recriar o Supabase (15 min)

O projeto antigo (`liaelesmbdfhdtkaxmmj.supabase.co`) foi deletado/pausado —
não tem como reativar; crie um novo.

1. **Criar projeto**: supabase.com → New project (org de sempre, região
   `sa-east-1` São Paulo, senha de banco qualquer — guarde no gerenciador).
2. **Aplicar schema**: Dashboard → SQL Editor → New query → cole o conteúdo
   inteiro de [`supabase/schema.sql`](supabase/schema.sql) → Run. É
   idempotente; re-rodar não quebra nada.
3. **Envs** — pegue em Project Settings → API e configure NOS DOIS lugares
   (`.env.local` e Vercel/Production):
   - `NEXT_PUBLIC_SUPABASE_URL` (https://xxxx.supabase.co)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role — **secreta**, nunca em código)
4. **Seed dos fabricantes** (local, lê o `.env.local`):
   ```bash
   npx tsx scripts/seed-fabricantes.ts
   ```
5. Redeploy na Vercel (envs novas só valem em deploy novo).
6. **Verifique**: `/api/status` → `supabase.ok: true` com contagem de
   fabricantes, e a página `/projetos/cadeia-produtiva-brasileira` deve sair
   do fallback estático.

## § 2 — Refazer OAuth da Melhor Envio (10 min) — ANTES DE 15/07

Pré-requisito: § 1 feita (sem Supabase o token não renova sozinho e você
volta aqui a cada 30 dias).

1. Confirme na Vercel (Production) que existem: `MELHOR_ENVIO_CLIENT_ID`,
   `MELHOR_ENVIO_CLIENT_SECRET`, `MELHOR_ENVIO_FROM_CEP`, e
   `MELHOR_ENVIO_REDIRECT_URI=https://paxbrasiliana.com/api/shipping/oauth/callback`.
   (Se o app OAuth não existir mais: melhorenvio.com.br → Painel → Gerenciar →
   Tokens/Aplicativos → criar app com esse callback.)
2. No navegador, **logado na conta Melhor Envio da Pax**, acesse:
   `https://paxbrasiliana.com/api/shipping/oauth/start`
3. Autorize. A página de callback deve dizer **"Frete configurado ✅ …
   renovação agora é automática"**. Se disser "Token gerado ⚠️" é porque o
   Supabase (§ 1) não está de pé — resolva e repita.
4. Depois disso, **remova** `MELHOR_ENVIO_TOKEN` e
   `MELHOR_ENVIO_REFRESH_TOKEN` das envs da Vercel (o par estático vira fonte
   de confusão; a fonte da verdade agora é o Supabase). Redeploy.
5. **Verifique**: `/api/status` → `melhor_envio.ok: true` com
   `fonte: Supabase (renovação automática ATIVA)`. Teste real: numa página de
   produto da loja, calcule frete com um CEP válido.

## § 3 — Stripe (30–45 min, precisa do responsável legal)

Nunca foi configurado. Loja e doações respondem 503 até aqui.

1. **Conta**: dashboard.stripe.com → criar/ativar conta business no Brasil
   (dados bancários e fiscais — só o responsável consegue).
2. **Chave**: Developers → API keys → copie a **Secret key** (`sk_live_...`)
   → Vercel env `STRIPE_SECRET_KEY` (Production). Local: use a de teste
   (`sk_test_...`).
3. `STRIPE_PUBLISHABLE_KEY` hoje não é usada pelo código — pode configurar,
   mas não bloqueia nada.
4. **Webhook**: Developers → Webhooks → Add endpoint →
   URL `https://paxbrasiliana.com/api/webhook` → eventos:
   `checkout.session.completed` e `invoice.paid` → copie o **Signing secret**
   (`whsec_...`) → Vercel env `STRIPE_WEBHOOK_SECRET`. Redeploy.
5. **Verifique**: `/api/status` → `stripe.ok: true` (a chave é validada ao
   vivo contra a API). Depois um teste ponta-a-ponta em modo teste: com
   `sk_test_` + `stripe listen --forward-to localhost:3000/api/webhook`,
   compre na loja local com o cartão `4242 4242 4242 4242` e confirme os dois
   emails (pedido pro admin, recibo pro cliente).

## § 4 — Resend

Já está OK em produção (entrega confirmada na auditoria). Só entra aqui se o
`/api/status` reclamar: recriar chave em resend.com → API Keys →
`RESEND_API_KEY` na Vercel.

## § 5 — Checagem final de lançamento

1. `/api/status` → `ok: true`, zero pendências.
2. Compra real de R$ baixo na loja em produção (pode reembolsar depois no
   dashboard da Stripe).
3. Doação teste em `/doar`.
4. Checklist completo de lançamento (fora do repo):
   `~/Desktop/Second brain/03 Projects/Pax Brasiliana/03 Launch/Checklist de Lançamento.md`

---

## Notas de arquitetura (pra quem mexer depois)

- **Frete no checkout é revalidado no servidor** (`src/app/api/checkout/route.ts`):
  o cliente manda só `{ id da opção, cep }`; o servidor recota na Melhor Envio
  e cobra o preço da cotação dele. Não "simplifique" isso voltando a aceitar
  preço do cliente — era um buraco de frete grátis por curl, fechado em
  2026-07-03. Sem cotação confiável o checkout responde 503 e **não vende** —
  comportamento intencional (fail closed).
- **Token Melhor Envio**: fonte da verdade é a tabela `melhor_envio_token` no
  Supabase (o refresh_token rotaciona a cada uso, env var não serve). O
  fallback `MELHOR_ENVIO_TOKEN` do env existe só pra emergência e NÃO renova.
- **/api/status** é a fonte de verdade operacional — se mudar env ou
  integração, atualize o check correspondente em
  `src/app/api/status/route.ts`.
