export interface StoreProductShipping {
  /** Peso da embalagem em kg. */
  weightKg: number;
  /** Largura da embalagem em cm. */
  widthCm: number;
  /** Altura da embalagem em cm. */
  heightCm: number;
  /** Comprimento da embalagem em cm. */
  lengthCm: number;
}

export interface StoreProduct {
  slug: string;
  title: string;
  price: number;
  description: string;
  sizes: string[];
  image: string;
  /** Usado pra cotação de frete (Melhor Envio). Estimativa — ajustar com medidas reais da embalagem. */
  shipping: StoreProductShipping;
}

export const products: StoreProduct[] = [
  {
    slug: "pax-brasiliana-cap",
    title: "Boné Pax Brasiliana",
    price: 120.0,
    description:
      "Boné estruturado com bordado frontal do emblema Pax Brasiliana. Fabricado no Brasil com algodão orgânico. Fecho ajustável em metal. Para usar enquanto constrói.",
    sizes: ["Único"],
    image: "/images/product-cap.jpg",
    // Estimativa: boné em caixa pequena.
    shipping: { weightKg: 0.3, widthCm: 20, heightCm: 12, lengthCm: 20 },
  },
  {
    slug: "early-supporters-flag",
    title: "Bandeira do Apoiador Inicial",
    price: 1000.0,
    description:
      "Bandeira exclusiva para apoiadores iniciais do movimento. Tecido premium, 2.7m x 1.37m, produzida em tiragem limitada. 100% do valor é destinado diretamente à missão da Pax Brasiliana. Inclui certificado de apoiador fundador.",
    sizes: ["Único"],
    image: "/images/flag.jpg",
    // Estimativa: bandeira dobrada em embalagem retangular.
    shipping: { weightKg: 0.6, widthCm: 30, heightCm: 10, lengthCm: 40 },
  },
];

export const productsBySlug: Record<string, StoreProduct> = Object.fromEntries(
  products.map((p) => [p.slug, p])
);

export function getStoreProduct(slug: string): StoreProduct | undefined {
  return productsBySlug[slug];
}
