import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ensaios",
  description: "Ensaios sobre indústria, cultura e o futuro do Brasil.",
  path: "/ensaios",
});

export default function EnsaiosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
