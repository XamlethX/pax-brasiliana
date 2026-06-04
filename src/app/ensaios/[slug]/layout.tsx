import type { Metadata } from "next";
import { getEnsaio } from "@/data/ensaios";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const essay = getEnsaio(params.slug);
  if (!essay) {
    return pageMetadata({
      title: "Ensaio não encontrado",
      path: `/ensaios/${params.slug}`,
    });
  }
  return {
    ...pageMetadata({
      title: essay.title,
      description: essay.desc,
      path: `/ensaios/${essay.slug}`,
      image: essay.image,
    }),
    authors: [{ name: essay.author }],
    openGraph: {
      title: essay.title,
      description: essay.desc,
      url: `/ensaios/${essay.slug}`,
      type: "article",
      publishedTime: essay.isoDate,
      authors: [essay.author],
      images: [{ url: essay.image, alt: essay.title }],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
