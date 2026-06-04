import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description:
    "Como a Pax Brasiliana coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
  path: "/privacy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
