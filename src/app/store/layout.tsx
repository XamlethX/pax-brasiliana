import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Loja",
  description:
    "A loja da Pax Brasiliana — peças para quem acredita em um Brasil que volta a construir.",
  path: "/store",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
