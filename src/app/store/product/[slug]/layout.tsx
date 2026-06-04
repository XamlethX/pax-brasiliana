import type { Metadata } from "next";
import { getStoreProduct } from "@/data/store";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getStoreProduct(params.slug);
  if (!product) {
    return pageMetadata({
      title: "Produto não encontrado",
      path: `/store/product/${params.slug}`,
    });
  }
  return pageMetadata({
    title: product.title,
    description: product.description,
    path: `/store/product/${product.slug}`,
    image: product.image,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
