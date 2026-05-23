import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pax Brasiliana — Imaginar e construir o futuro brasileiro.",
  description:
    "Movimento cultural-industrial voltado a imaginar, construir e acelerar o futuro brasileiro. Por um Brasil criativo, industrial, tecnológico e culturalmente ambicioso.",
  openGraph: {
    title: "Pax Brasiliana",
    description: "É hora de construir o Brasil.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
