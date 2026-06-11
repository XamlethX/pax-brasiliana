# Pax Brasiliana — Spec de Parity Visual (vs Build Australia)

Objetivo: alinhar o acabamento do site inteiro aos valores funcionais reais da BA,
extraídos do CSS deles (`ba-reference/about/about.BOjf2Dc4.css`). São tokens técnicos
(timings, pesos, espaçamentos), NÃO a expressão visual protegida.

## REGRAS DE EXECUÇÃO (ler antes)

- Rode em **Sonnet**, dentro do repo `pax-brasiliana`. Trabalho mecânico, não precisa Opus/Fable.
- **NUNCA** instalar/servir `RJAfiladorBold.otf` ou `RJSchemaVariable.ttf`. São proprietárias da BA.
  A pasta `ba-reference/` está no `.gitignore` — é só referência local, jamais vai pro site.
- Trabalhe **uma página por vez**. Depois de cada página: `npm run dev`, screenshot, compare, ajuste.
- Não toque em conteúdo (copy, links, dados). Só CSS / className / tokens.

## TOKENS-ALVO (já aplicados em globals.css — usar como fonte da verdade)

| Token | Valor BA | Status |
|---|---|---|
| Peso do corpo | `font-weight: 450` | ✅ aplicado em `body` e `.text-paragraphs` |
| Peso display | `700` na BA (com fonte substituta pode precisar 800–900 pra bater o volume visual) | revisar por olho |
| Easing padrão | `--ease-out: cubic-bezier(0, 0, 0.2, 1)` | ✅ token criado |
| Durações | `.2s` / `.3s` / `.5s` | padronizar |
| Tracking | `-.02 / -.04 / -.05 / -.06em` por nível | ✅ já batia |
| Line-height | tight `1.25`, relaxed `1.625`, display `80–90%` | ✅ já batia |
| Radius | `0` global, exceções `rounded-[6px]` em cards | ✅ já batia |
| Fonte heading | Barlow Semi Condensed (A/B com Oswald/Archivo em aberto) | testar |

## TAREFA: varrer o site inteiro

1. **Buscar todo `transition: ... ease` genérico** (CSS) e todo Tailwind `duration-*` sem
   `ease-*` explícito (TSX) e trocar pelo ease-out:
   - CSS inline: `var(--ease-out)`
   - Tailwind: adicionar classe `ease-out` (= `cubic-bezier(0,0,.2,1)`, idêntico à BA)
   - Grep inicial: `transition:[^;]*\bease\b` em `src/**/*.css` e `duration-` em `src/**/*.tsx`

2. **Confirmar que todo texto de corpo herda weight 450.** Procurar parágrafos que
   escapam de `body`/`.text-paragraphs` (ex: `<span>`, `<li>`, cards) e que pareçam finos demais.

3. **Padronizar durações** para `.2s` (micro: hover, cor), `.3s` (acordeão, transform),
   `.5s` (reveals maiores). Eliminar valores órfãos tipo `0.35s`, `0.25s` soltos.

4. **Páginas, em ordem de prioridade:**
   - [x] `/` (home — HeroSection, ManifestoSection, ProjectsPreview, JoinCTA)
   - [x] `/about` (já feito parcialmente — validar)
   - [x] `/projetos` + subpáginas
   - [x] `/ensaios` + `[slug]`
   - [x] `/store` + product
   - [x] `/get-involved`, `/contribute`, `/contact`, `/newsletter`
   - [x] componentes globais: `Navbar`, `Footer`, `JoinForm`, `PageHero`

5. **Por página:** rodar dev, screenshot, comparar com a BA equivalente (quando houver),
   listar deltas restantes, aplicar, repetir até bater.

## FORA DE ESCOPO (refino fino, deixar pro fim)

- Scroll reveals / parallax via `framer-motion` e IntersectionObserver (lógica JS).
- Decisão final de fonte heading (depende do A/B humano).
