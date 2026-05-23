import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ensaios — Pax Brasiliana",
  description: "Ensaios sobre indústria, cultura e o futuro do Brasil.",
};

export default function EnsaiosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
