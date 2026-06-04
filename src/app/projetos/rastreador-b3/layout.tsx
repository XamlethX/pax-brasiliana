import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Rastreador B3",
  description:
    "Acompanhe 50 empresas brasileiras listadas na B3 — visões em grade e tabela, com sparklines de desempenho.",
  path: "/projetos/rastreador-b3",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
