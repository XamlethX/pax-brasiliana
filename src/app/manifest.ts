import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "PAX",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F8F6E8",
    theme_color: "#463C2E",
    lang: "pt-BR",
    categories: ["education", "news", "politics"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/images/logo-symbol-dark.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
