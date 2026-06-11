import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Doar",
  description:
    "Apoie a Pax Brasiliana. Faça uma doação única ou mensal. 100% do valor vai diretamente para a missão de reacender a capacidade do Brasil de construir.",
  path: "/doar",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
