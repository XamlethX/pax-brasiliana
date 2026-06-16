-- ============================================================================
-- Pax Brasiliana · Cadeia Produtiva Brasileira — schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- Idempotent: safe to re-run.
-- ============================================================================

-- ── fabricantes: o índice curado (servido publicamente) ─────────────────────
create table if not exists public.fabricantes (
  id           bigint primary key,
  nome         text   not null,
  website      text,
  cidade       text,
  estado       text,
  sigla        text,
  setor        text,
  produtos     text[] not null default '{}',
  descricao    text,
  fundacao     int,
  funcionarios text,
  origem       text check (origem in ('BR', 'MNC')) default 'BR',
  status       text   not null default 'aprovado'
                 check (status in ('aprovado', 'pendente', 'rejeitado')),
  created_at   timestamptz not null default now()
);

create index if not exists fabricantes_setor_idx  on public.fabricantes (setor);
create index if not exists fabricantes_sigla_idx  on public.fabricantes (sigla);
create index if not exists fabricantes_status_idx on public.fabricantes (status);

-- ── contribuicoes: submissões da comunidade (entram como pendente) ──────────
create table if not exists public.contribuicoes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  website       text,
  cidade        text,
  estado        text,
  sigla         text,
  setor         text,
  produtos      text[] not null default '{}',
  descricao     text,
  fundacao      int,
  funcionarios  text,
  origem        text check (origem in ('BR', 'MNC')) default 'BR',
  contato_email text,
  status        text not null default 'pendente'
                  check (status in ('pendente', 'aprovado', 'rejeitado')),
  created_at    timestamptz not null default now()
);

-- ── melhor_envio_token: tokens OAuth da Melhor Envio (1 linha só) ───────────
-- Persistido aqui porque o refresh_token rotaciona a cada uso, então não dá
-- pra guardar em env var (imutável em runtime). O callback OAuth grava, e o
-- cálculo de frete renova sozinho quando perto de expirar.
create table if not exists public.melhor_envio_token (
  id            int primary key default 1 check (id = 1),
  access_token  text not null,
  refresh_token text not null,
  expires_at    timestamptz not null,
  updated_at    timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.fabricantes  enable row level security;
alter table public.contribuicoes enable row level security;
-- Tokens: RLS ligado e SEM policy = ninguém anon acessa. Só service-role.
alter table public.melhor_envio_token enable row level security;

-- Qualquer um (anon) pode LER fabricantes aprovados.
drop policy if exists "fabricantes_public_read" on public.fabricantes;
create policy "fabricantes_public_read"
  on public.fabricantes for select
  using (status = 'aprovado');

-- Qualquer um (anon) pode SUBMETER uma contribuição (insert apenas).
drop policy if exists "contribuicoes_public_insert" on public.contribuicoes;
create policy "contribuicoes_public_insert"
  on public.contribuicoes for insert
  with check (true);

-- Nada de leitura pública das contribuições (só service-role / admin).
-- (sem policy de select = ninguém anon lê)

-- O service-role key ignora RLS, então seed e moderação funcionam server-side.
