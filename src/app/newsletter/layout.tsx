import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "Análises mensais sobre indústria, tecnologia e construção nacional. Sem ruído — apenas o que importa para quem constrói o Brasil.",
  path: "/newsletter",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
