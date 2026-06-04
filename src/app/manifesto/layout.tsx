import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Manifesto",
  description:
    "O manifesto da Pax Brasiliana — princípios, reset cultural e o imperativo econômico de voltar a construir o Brasil.",
  path: "/manifesto",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
