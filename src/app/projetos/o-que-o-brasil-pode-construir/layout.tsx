import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "O que o Brasil pode construir",
  description:
    "Base de dados interativa de produtos estratégicos: o que o Brasil produz, monta parcialmente ou ainda importa — e a oportunidade de construir cada cadeia.",
  path: "/projetos/o-que-o-brasil-pode-construir",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
