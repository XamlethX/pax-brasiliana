import type { Metadata } from "next";
import { produtos } from "@/data/produtos";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const produto = produtos.find((p) => p.slug === params.slug);
  if (!produto) {
    return pageMetadata({
      title: "Produto não encontrado",
      path: `/projetos/o-que-o-brasil-pode-construir/${params.slug}`,
    });
  }
  return pageMetadata({
    title: `${produto.nome} — ${produto.categoria}`,
    description: produto.resumo,
    path: `/projetos/o-que-o-brasil-pode-construir/${produto.slug}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
