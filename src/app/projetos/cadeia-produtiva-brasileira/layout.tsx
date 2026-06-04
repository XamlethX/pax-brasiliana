import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cadeia produtiva brasileira",
  description:
    "Mapa da cadeia produtiva nacional: onde o Brasil produz, depende ou tem oportunidade de adensar sua indústria.",
  path: "/projetos/cadeia-produtiva-brasileira",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
