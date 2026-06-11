import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doação confirmada",
  description: "Confirmação de doação à Pax Brasiliana.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
