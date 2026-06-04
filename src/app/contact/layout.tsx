import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description:
    "Fale com a Pax Brasiliana. Dúvidas, parcerias e imprensa.",
  path: "/contact",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
