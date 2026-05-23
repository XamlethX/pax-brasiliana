---
title: "Build Australia — Design System & Frontend Architecture"
source: "https://buildaustralia.com"
analyzed_at: "2026-05-21"
framework: "Next.js + Tailwind CSS (v4 syntax) + shadcn/ui tokens"
---

# 1. Arquitetura do Site e Fluxo de Páginas

O site é um **manifesto editorial + hub de movimento cívico** estruturado como um Next.js App Router com Tailwind CSS v4 (uso de `@theme` via CSS variables, `grid-lines` utilities customizadas e tokens `--color-*` mapeados a nomes da paleta australiana). Todas as páginas compartilham um shell visual idêntico: header fixo translúcido, fundo *mist* (creme), tipografia display em `RJ Afilador` e mono em `Martian Mono`.

## Mapeamento de rotas

| Rota | Tipo | Função |
|------|------|--------|
| `/` | Landing/manifesto | Hero em tela cheia, scroll narrativo em múltiplas seções "screen-height", CTA de e-mail/Movimento |
| `/about` | Conteúdo institucional | Hero com vídeo/imagem de fundo + texto sobreposto, sidebar de seções (`GOAL`, `OUR FOUNDING BELIEFS`), blocos *Our vision* / *Our goal* |
| `/projects` | Catálogo | Hero curto com imagem panorâmica + grid de cards de projeto (3 colunas desktop) |
| `/essays` | Blog/feed editorial | Card hero "Featured Essay" (image + glass overlay) + lista cronológica de ensaios |
| `/store` | E-commerce | Header de página em duas colunas (título + descrição), filtros (search + sort) e grid de produtos 3-col |
| `/get-involved` | Conversão | Formulário longo de inscrição (firstname, surname, email, location select, vocation) |
| `/contact`, `/contribute`, `/privacy` | Páginas utilitárias | Layout de conteúdo simples herdando o shell global |
| `/llms.txt`, `/llms-full.txt` | Texto plano | Endpoint para LLMs (sem layout) |

## Layout Global compartilhado

Todas as páginas usam o padrão **Header fixo (z-50) → Main flex-1 → Footer khaki**:

```
<body class="bg-mist text-bark font-sans">
  <header class="fixed top-0 z-50 w-full py-5 lg:py-7 grid-lines">...</header>
  <main class="flex-1">...</main>
  <footer class="bg-khaki relative">...</footer>
</body>
```

Característica visual marcante: **`grid-lines`** — utilitária custom que desenha linhas verticais sutis (em `--khaki`/`#c3be92`) dividindo o viewport em 3 colunas iguais (33vw cada), sangrando do topo ao fundo. Aparece em header, hero e nas principais sections do home, criando uma "moldura editorial" recorrente.

---

# 2. Design System Global

## Paleta de Cores

A paleta é nomeada com referências à paisagem/flora australiana e mapeada às semantic tokens do shadcn/ui.

### Cores brutas (nomeadas)

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `--bark` | `#463c2e` | `rgb(70, 60, 46)` | Texto principal, primary, footer text |
| `--mist` | `#f8f6e8` | `rgb(248, 246, 232)` | Background global (creme), foreground sobre dark |
| `--sand` | `#e4decc` | `rgb(228, 222, 204)` | Secondary/muted, body alt |
| `--khaki` | `#c3be92` | `rgb(195, 190, 146)` | Border, sidebar accent, footer bg |
| `--coast` | `#417ce5` | `rgb(65, 124, 229)` | Accent (azul oceano), CTAs sutis, *focus ring*, display highlights |
| `--clay` | `#f45141` | `rgb(244, 81, 65)` | Destructive, alerta |
| `--wattle` | `#dfcb5a` | `rgb(223, 203, 90)` | Chart 3 (amarelo wattle, flor nacional) |
| `--gumleaf` | `#68d34d` | `rgb(104, 211, 77)` | Chart 2 (verde gum leaf) — feedback positivo |
| `--bush` | `#ada446` | `rgb(173, 164, 70)` | Chart 4 (verde-oliva), gráficos |

### Semantic tokens (shadcn pattern)

| Semantic | Valor |
|----------|-------|
| `--background` | `var(--mist)` `#f8f6e8` |
| `--foreground` | `var(--bark)` `#463c2e` |
| `--card` / `--popover` | `var(--mist)` |
| `--card-foreground` | `var(--bark)` |
| `--primary` | `var(--bark)` |
| `--primary-foreground` | `var(--mist)` |
| `--secondary` / `--muted` | `var(--sand)` |
| `--muted-foreground` | `#6b5f4f` |
| `--accent` | `var(--coast)` `#417ce5` |
| `--accent-foreground` | `#fff` |
| `--destructive` | `var(--clay)` `#f45141` |
| `--destructive-foreground` | `#fff` |
| `--border` / `--input` | `var(--khaki)` `#c3be92` |
| `--ring` | `var(--coast)` |
| `--sidebar` | `var(--sand)` |
| `--sidebar-border` | `var(--khaki)` |
| `--chart-1..5` | coast / gumleaf / wattle / bush / clay |

### Variações de opacidade observadas

Tailwind arbitrary opacity é usado livremente: `bg-black/20`, `bg-black/30`, `bg-muted/30`, `border-t-[0.5px] border-t-[#463c2e]/30`. Não há tema escuro (dark mode) implementado — o site opera em "warm light mode" único, com inversões locais via overlays escuros sobre fotografias do hero.

---

## Tipografia

Três famílias custom + fallback serif:

| Família | Token | Uso |
|---------|-------|-----|
| **RJ Schema** | `--font-sans` → `"RJ Schema", serif` | Body, parágrafos, navegação corpo, headings menores |
| **RJ Afilador** | `--font-heading` → `"RJ Afilador", sans-serif` | Display *gigante* (h1 hero, números, slogans) — sans condensado com bold weight visual |
| **Martian Mono** | `--font-mono` → `"Martian Mono", monospace` | Eyebrows, labels, botões, formulário labels, datas |
| **Lora** | `--font-serif` → `Lora, serif` | Reserva para conteúdo longform (essays prose) |

### Escala tipográfica observada

| Nível | Tamanho | Line-height | Letter-spacing | Família |
|-------|---------|-------------|----------------|---------|
| Display XXL | `160px` | `128px` (0.8) | `-8px` (-0.05em) | RJ Afilador 400 |
| Display XL | `100px` | `80px` (0.8) | `-5px` (-0.05em) | RJ Afilador 400 |
| Display L | `60-72px` | `0.9` | `-0.02em` | RJ Afilador 400 |
| H3 / card title | `24px` | `1.33` | `normal` | RJ Schema |
| H4 | `20px` | `1.4` | `normal` | RJ Schema |
| Body large | `18px` | `1.55` | `normal` | RJ Schema |
| Body | `16px` | `1.5` | `normal` | RJ Schema |
| Caption / Mono UI | `12px` | `1` | `-0.06em` | Martian Mono |
| Form label | `14px` | `1` | `0.05em` | Martian Mono |

---

# 3. Grid, Layout e Responsividade

## Sistema dominante

**Flexbox vertical** para o page shell, **CSS Grid + Flex** para conteúdo.

1. **`grid-lines` utility** — desenha 2 linhas verticais (3 colunas iguais) como elemento visual decorativo.
2. **Flex row 1/3 + 2/3** ou **2-col / 3-col grid** em desktop.
3. **Stacking vertical** completo em mobile.

## Container e espaçamento

- **Sem `max-w` global rígido.** Main ocupa 100% da viewport.
- **Padding horizontal padrão:** `px-5 lg:px-10` (20px mobile → 40px desktop).
- **Padding vertical de seção:** `py-20` (80px).
- **Cards/sub-containers:** `mx-5 lg:mx-10` com `rounded-[6px]` (raro).

## Breakpoints

Só **um corte real**: `lg: 1024px`. Mobile e desktop são dois layouts discretos.

## Border-radius

Global `--radius: 0rem`. Square-corner, com exceções pontuais (`rounded-[6px]` em cards de essay, `rounded-full` em badges/pills).

---

# 4. Componentes Globais

## Navigation (Navbar)

- **Altura:** `96px` — `py-5 lg:py-7`
- **Posição:** `fixed top-0 z-50 w-full`
- **Background:** transparente default. `header-active` aplica `bg-mist` ao rolar.
- **Layout:** `flex justify-between` — logo esquerda, links centrais, cart + CTA direita.
- **Decoração:** `grid-lines` ativas no header.
- **Links:** Martian Mono, 12px, uppercase, `-0.06em`, cor `--bark`. Sem sublinhado.
- **Mobile:** links ocultos, botão hamburger, drawer fullscreen.
- **CTA "GET INVOLVED":** `bg-bark`, `color-mist`, `px-4`, `h-36px`, `radius: 0`, Martian Mono 12px uppercase.

## Footer

- **Background:** `bg-khaki` (`#c3be92`)
- **Texto:** `--bark`
- **Layout:** multi-coluna (logo + newsletter form, SITEMAP, SOCIAL MEDIA, copyright)
- **Newsletter form inline:** input underline + botão SUBSCRIBE Martian Mono uppercase.
- **Labels:** Martian Mono 12px uppercase, tracking-wider.
- **Logo grande** próximo ao bottom.

## Botões

| Variante | Bg | Color | Border | Padding | Font |
|----------|----|----|--------|---------|------|
| Primary | `--bark` | `--mist` | none | `0 16px` h~36px | Martian Mono 12px uppercase -0.06em |
| Ghost | transparent | `--bark` | none | `0 12px` | mesma |
| Outline/Link | transparent | `--bark` | `0.5px solid --bark/30` ou seta → | mesma | mesma |
| Accent CTA | `--coast` | `#fff` | none | mesma | mesma |

- **Border-radius:** `0px` todos.
- **Hover:** opacity-80 ou bg-coast.
- **Focus-visible:** `outline: 2px solid var(--ring)`, `outline-offset: 2px`.

## Formulários

Padrão "underline-only input":

- `background: transparent`, `border: none`, `border-bottom: 0.5px solid --bark/30`, `radius: 0`
- `padding: 20px 0`, `height: ~59px`, `font: Martian Mono 14px`, `color: --bark`
- Focus: `border-bottom-color: --coast`
- Erro: `border-bottom-color: --clay`

---

# 5. Padrões de Páginas

## Home / Landing

Scroll narrativo com múltiplas seções `min-h-screen`:

1. Hero fullscreen — imagem `object-cover` 100vh, overlay, `grid-lines`, wordmark display 160px em `--mist`
2. Statement sections — alternating `--khaki`/`--bark` backgrounds, display 100px centered
3. "It's time to Build" — display 160px em `--coast` sobre `--mist`
4. Bento dual — 2-col grid features
5. Latest — eyebrow mono, cards de project + essay
6. Join the Movement — foto fundo, heading split (normal + `--coast`), formulário inline

**Heading split pattern:** `<span class="block">` linha 1 + `<span class="block text-coast">` linha 2 accent.

## Essays

- Hero: imagem 500px, overlay glass card `bg-mist/90 backdrop-blur` com title + meta + CTA
- Grid: 3-col cards com thumbnail, title Schema 24px, desc, meta mono, botão "Read Essay →"
- Filtros: text-only tabs, mono uppercase

## About

- Hero com vídeo/imagem
- Sidebar nav: lista mono 12px uppercase com `border-left: 2px solid --coast` no ativo

## Store

- Header dual-column: título display + descrição
- Toolbar: search input + sort select
- Grid: `grid-cols-3 gap-0`, cards encostados separados por grid-lines
- Card: imagem aspect-square, título Schema 18px, preço mono

## Projects

- Hero curto 50vh com imagem + título display
- Grid 3-col project cards

## Get Involved

- Coluna única centrada, max-width ~600px
- Campos verticais underline-only
- Submit fullwidth: bg-bark, color-mist, h-56px, mono uppercase 14px
