import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sobre",
  description:
    "Visão, objetivos e crenças fundadoras da Pax Brasiliana — um movimento para reacender a capacidade do Brasil de construir.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
