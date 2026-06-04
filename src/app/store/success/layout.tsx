import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  description: "Confirmação de pedido da loja Pax Brasiliana.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
