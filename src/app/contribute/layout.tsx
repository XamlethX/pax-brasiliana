import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contribua",
  description:
    "Some-se à construção do futuro brasileiro. Conte suas habilidades, sua disponibilidade e seu interesse em liderar.",
  path: "/contribute",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
