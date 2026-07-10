import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pax Mantle",
  description:
    "Converse com IAs de nuvem sem entregar seus dados pessoais — um modelo local detecta e substitui informações sensíveis antes de o prompt sair da sua máquina. Software livre.",
  path: "/projetos/pax-mantle",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
