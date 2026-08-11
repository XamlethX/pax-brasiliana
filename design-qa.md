# Design QA — CTA do GitHub do Pax Mantle

- Fonte visual: `/var/folders/xj/vby43c3n0fl_rgyvg0b17jhw0000gn/T/TemporaryItems/NSIRD_screencaptureui_CQTXtd/Captura de Tela 2026-08-11 às 20.38.40.png`
- Implementação desktop: `docs/design-qa/pax-mantle-github-cta-desktop.png`
- Implementação móvel: `docs/design-qa/pax-mantle-github-cta-mobile.png`
- Rota: `/projetos/pax-mantle`
- Estado: padrão e confirmação de cópia

## Normalização

- Referência: 1366 × 304 px, densidade fornecida pela captura original.
- Implementação desktop: viewport CSS de 1366 × 768, captura de 1366 × 768 px, densidade 1×.
- Implementação móvel: viewport CSS de 390 × 844, captura de 390 × 844 px, densidade 1×.
- Componente desktop medido em 464 × 68 CSS px. A diferença de proporção em relação à barra isolada da referência é intencional: o CTA respeita a coluna e o grid existentes da landing page.

## Comparação visual

### Vista completa

- Tipografia: monoespaçada, peso e contraste correspondem à linguagem da referência e aos tokens existentes da Pax.
- Espaçamento: altura, respiro interno, divisor da ação e raio generoso preservam o ritmo da referência sem alterar a estrutura da página.
- Cores: superfície quase preta, texto creme suavizado e borda discreta reproduzem a referência usando a paleta do site.
- Imagens e ícones: não há imagem raster no componente; os ícones de copiar e confirmação vêm do Phosphor Icons, biblioteca MIT, e permanecem nítidos em qualquer densidade.
- Conteúdo: o comando é real (`gh repo clone XamlethX/pax-mantle`) e a ação está em português.

### Região focada

Não foi necessária uma captura adicional: o componente aparece com 464 × 68 px na captura desktop, com texto, divisor, ícone e raio legíveis. A referência e a implementação foram abertas juntas na mesma comparação visual.

## Interações verificadas

- A metade esquerda abre o repositório correto em nova aba.
- A ação de copiar muda de “Copiar” para “Copiado” e troca o ícone por uma confirmação.
- A ação permanece visível em 390 px; o comando é truncado de forma segura e o ícone de copiar permanece acessível.
- Nenhum erro foi registrado no console.

## Histórico da comparação

1. Primeira captura: o comando truncava antes do nome completo do repositório (P2).
2. Correção: remoção do ícone de saída redundante, ajuste da largura das colunas e redução sutil da tipografia interna.
3. Captura final: comando completo no desktop, composição alinhada à referência e comportamento móvel preservado.

## Findings

Nenhum P0, P1 ou P2 permanece. A adaptação da largura é esperada por causa do grid responsivo da página.

## Follow-up polish

Nenhum ajuste adicional é necessário para esta iteração.

final result: passed
