# Pax Brasiliana

Um movimento para avivar a industria, criatividade e ambicao brasileira. **Brasil Surgis.**

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** com tokens customizados
- **Framer Motion** para scroll animations
- **Google Fonts** (Bebas Neue + Inter)
- Dark mode fixo, mobile-first

## Rodar localmente

```bash
# Instalar dependencias
npm install

# Servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build de producao

```bash
npm run build
npm start
```

## Estrutura

```
src/
  app/
    layout.tsx        # Layout raiz com fonts e metadata
    page.tsx          # Home page
    globals.css       # Estilos globais, grain, grid overlay
  components/
    Header.tsx        # Nav fixa com hide-on-scroll
    Hero.tsx          # Wordmark full-screen
    Diagnostico.tsx   # Secao 1 — diagnostico com stats
    Prova.tsx         # Secao 2 — casos de sucesso
    Visao.tsx         # Secao 3 — tres pilares com parallax
    Chamado.tsx       # Secao 4 — Brasil Surgis
    CTA.tsx           # Form de e-mail + estado
    Footer.tsx        # Links e social
    SectionReveal.tsx # Wrapper de animacao scroll
    StatBlock.tsx     # Bloco de estatistica animado
```

## Paleta

| Token     | Hex       | Uso                  |
|-----------|-----------|----------------------|
| preto     | `#0f0f0f` | Background           |
| creme     | `#e8d5a3` | Texto principal      |
| ferrugem  | `#c4873a` | Acentos e destaques  |
| floresta  | `#2d4a2d` | Secundario           |
