import type { Metadata } from "next";

/**
 * Canonical site origin. Override per-environment with NEXT_PUBLIC_SITE_URL.
 * Used by metadataBase, sitemap, robots, JSON-LD and OG/canonical URLs.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://paxbrasiliana.com"
).replace(/\/$/, "");

export const SITE_NAME = "Pax Brasiliana";

export const SITE_DESCRIPTION =
  "Movimento cultural-industrial voltado a imaginar, construir e acelerar o futuro brasileiro. Por um Brasil criativo, industrial, tecnológico e culturalmente ambicioso.";

/**
 * Build per-page metadata with sensible defaults inherited from the root.
 * Pass a `path` (e.g. "/about") to get a canonical URL + page-specific OG.
 */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImages = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
