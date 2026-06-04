import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Participe",
  description:
    "Junte-se ao movimento. Construtores, criadores e pensadores que acreditam em um Brasil mais ambicioso.",
  path: "/get-involved",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
