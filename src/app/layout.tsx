import type { Metadata, Viewport } from "next";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pax Brasiliana — Imaginar e construir o futuro brasileiro.",
    template: "%s — Pax Brasiliana",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Pax Brasiliana",
    "reindustrialização",
    "indústria brasileira",
    "futuro do Brasil",
    "tecnologia",
    "infraestrutura",
    "energia",
    "manufatura",
    "soberania industrial",
    "construir o Brasil",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: "Pax Brasiliana",
    description: "É hora de construir o Brasil.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pax Brasiliana",
    description: "É hora de construir o Brasil.",
    site: "@paxbrasiliana",
    creator: "@paxbrasiliana",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#463C2E",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "PAX",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-wordmark.png`,
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://x.com/paxbrasiliana",
    "https://instagram.com/paxbrasiliana",
    "https://linkedin.com/company/paxbrasiliana",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
        <ConsentBanner />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
