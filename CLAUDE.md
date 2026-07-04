# CLAUDE.md — Pax Brasiliana Website

This file is the single source of truth for every decision made while building the Pax Brasiliana website. Read it completely before writing a single line of code. Internalize it. Then build.

## 0. MISSION BRIEF

Movimento cultural-industrial voltado a imaginar, construir e acelerar o futuro brasileiro. A PAX acredita que o Brasil possui os recursos, o território, a criatividade e o talento necessários para se tornar uma sociedade mais ambiciosa, produtiva e sofisticada. Nosso objetivo é reacender a capacidade nacional de construir: indústria, tecnologia, infraestrutura, cultura, energia, arquitetura, pesquisa e novas instituições. Por um Brasil criativo, industrial, tecnológico e culturalmente ambicioso — imaginar e construir o futuro brasileiro. O indivíduo deve sentir: talvez o Brasil ainda possa construir coisas grandiosas.

**BENCHMARK:** https://buildaustralia.com/

## Stack
- Next.js 14 App Router, React, TypeScript, Tailwind CSS 3.x
- Fonts: Gabarito (headings), Plus Jakarta Sans (body), Martian Mono (mono/accents)
- All via Google Fonts — single import in globals.css
- To upgrade to RJ Afilador / RJ Schema: add @font-face in globals.css and prepend to --font-heading / --font-body

## Design System (matches BA exactly)
- **Colors**: bark `#463C2E`, mist `#F8F6E8`, khaki `#C3BE92`, coast `#417CE5`, sand `#E4DECC`, clay `#F45141`, wattle `#DFCB5A`, bush `#ADA446`
- **Opacity hierarchy**: use `bark` (#463C2E) with Tailwind opacity (`/50`, `/30`, `/70`) — never hardcode muddy hex colors
- **Border radius**: `--radius: 0rem` — angular design, zero rounded corners on cards/buttons/inputs
- **Card borders**: `border-[0.5px] border-[#463C2E]`
- **Section dividers**: `border-[0.5px] border-[#463C2E]/30`
- **Grid lines**: `border-[#463C2E]/30` (light sections), `border-[#F8F6E8]/50` (dark sections)
- **Section labels**: `border-l-[1px] border-[#F45141]` (clay red left border)
- **Card/bg contrast**: sand cards on mist sections OR mist cards on sand sections
- **Dashed separator**: `border-image: repeating-linear-gradient(to right, #463C2E4D 0px, #463C2E4D 6px, transparent 6px, transparent 8px) 1`
- **CTA buttons**: `bg-[#463C2E] text-[#F8F6E8]` with arrow SVG, `hover:opacity-80`
- **Accent buttons**: `bg-[#417CE5] text-[#F8F6E8]` (coast blue)
- **Form cards**: `bg-[rgba(228,222,204,0.30)]` (sand/30), `border-[#463C2E]/40`, `shadow-md`
- **Shadows**: `--shadow-sm`, `--shadow`, `--shadow-md` defined in globals.css
- **Typography**: text-h1 (clamp 80-160px), text-h2 (clamp 48-100px), text-h3 (clamp 36-64px), text-accents (14px mono)

## Site Map (18 pages)
| Route | Description |
|-------|-------------|
| `/` | Homepage — narrative scroll with hero, statements, photo sections, featured content, join form |
| `/about` | Vision, goals, founding beliefs, FAQ |
| `/manifesto` | Full manifesto — principles, cultural reset, economic imperative |
| `/projetos` | Projects index with tag filters |
| `/projetos/o-que-o-brasil-pode-construir` | Interactive product database with filters |
| `/projetos/o-que-o-brasil-pode-construir/[slug]` | Product detail pages |
| `/projetos/rastreador-b3` | B3 stock tracker — 50 companies, grid/table view, sparklines |
| `/essays` | Essays index with featured hero + category filters |
| `/essays/[slug]` | Essay detail — long-form reading with TOC |
| `/store` | Store — product grid with search/sort |
| `/store/product/[slug]` | Product detail — image, sizes, quantity, add to cart |
| `/contact` | Contact form |
| `/contribute` | Contribution form — skills, availability, leadership interest |
| `/get-involved` | Join the movement — hero + signup form |
| `/newsletter` | Newsletter subscription |
| `/privacy` | Privacy policy |
| `/projects` | Redirect → `/projetos` |

## Commands
- Dev: `npx next dev` (port 3000)
- Build: `npx next build`
- Screenshots: `node scripts/screenshot-compare.mjs` (both | local | reference)
- Diagnóstico de produção: `GET /api/status` (protegido por STATUS_SECRET em prod) — valida Stripe/Supabase/Melhor Envio/Resend com chamadas vivas. Recuperação operacional: **RUNBOOK.md** (prazo crítico: token Melhor Envio expira ~15/07/2026)

## Stale cache fix
The Next.js dev server frequently produces `Cannot find module './XXX.js'` errors (stale webpack chunks in `.next/server/`). **After creating or modifying any page/component**, always run `rm -rf .next` and restart the dev server before testing. When verifying routes via curl or browser during a session, if ANY route returns a 500 with this error, delete `.next` immediately — the cache is corrupt and no route is trustworthy until it's rebuilt.

## Key Directories
- `src/app/` — pages (App Router)
- `src/components/` — shared components (Navbar, Footer, PageHero, HeroSection, ProjectsPreview)
- `src/data/` — data files (produtos.ts)
- `src/hooks/` — custom hooks (useScrollReveal)
- `scripts/` — tooling scripts
- `screenshots/` — comparison screenshots (gitignored)
- `public/fonts/` — RJ Afilador + RJ Schema font files (add here)
- `public/images/` — static images and SVGs
