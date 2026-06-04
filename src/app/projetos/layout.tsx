import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projetos",
  description:
    "Projetos da Pax Brasiliana: o que o Brasil pode construir, a cadeia produtiva nacional e o rastreador da B3.",
  path: "/projetos",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
