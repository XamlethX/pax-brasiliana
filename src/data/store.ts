export interface StoreProduct {
  slug: string;
  title: string;
  price: number;
  description: string;
  sizes: string[];
  image: string;
}

export const products: StoreProduct[] = [
  {
    slug: "pax-brasiliana-tee",
    title: "Camiseta Pax Brasiliana",
    price: 150.0,
    description:
      "Camiseta 100% algodão pima brasileiro, fabricada em São Paulo. Corte moderno, confortável e durável. Estampa minimalista com o emblema Pax Brasiliana. Feita no Brasil, para quem constrói o Brasil.",
    sizes: ["P", "M", "G", "GG", "XGG"],
    image: "/images/product-tee.svg",
  },
  {
    slug: "early-supporters-flag",
    title: "Bandeira do Apoiador Inicial",
    price: 30000.0,
    description:
      "Bandeira exclusiva para apoiadores iniciais do movimento. Tecido premium, 2.7m x 1.37m, produzida em tiragem limitada. 100% do valor é destinado diretamente à missão da Pax Brasiliana. Inclui certificado de apoiador fundador.",
    sizes: ["Único"],
    image: "/images/flag.png",
  },
  {
    slug: "pax-brasiliana-cap",
    title: "Boné Pax Brasiliana",
    price: 180.0,
    description:
      "Boné estruturado com bordado frontal do emblema Pax Brasiliana. Fabricado no Brasil com algodão orgânico. Fecho ajustável em metal. Para usar enquanto constrói.",
    sizes: ["Único"],
    image: "/images/product-cap.svg",
  },
];

export const productsBySlug: Record<string, StoreProduct> = Object.fromEntries(
  products.map((p) => [p.slug, p])
);

export function getStoreProduct(slug: string): StoreProduct | undefined {
  return productsBySlug[slug];
}
