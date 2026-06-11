import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { produtos } from "@/data/produtos";
import { products as storeProducts } from "@/data/store";
import { ensaios } from "@/data/ensaios";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/manifesto", priority: 0.8, changeFrequency: "monthly" },
    { path: "/projetos", priority: 0.8, changeFrequency: "weekly" },
    {
      path: "/projetos/o-que-o-brasil-pode-construir",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      path: "/projetos/cadeia-produtiva-brasileira",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/projetos/rastreador-b3",
      priority: 0.7,
      changeFrequency: "daily",
    },
    { path: "/ensaios", priority: 0.8, changeFrequency: "weekly" },
    { path: "/store", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contribute", priority: 0.6, changeFrequency: "yearly" },
    { path: "/get-involved", priority: 0.7, changeFrequency: "yearly" },
    { path: "/doar", priority: 0.7, changeFrequency: "yearly" },
    { path: "/newsletter", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const produtoEntries: MetadataRoute.Sitemap = produtos.map((p) => ({
    url: `${SITE_URL}/projetos/o-que-o-brasil-pode-construir/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const storeEntries: MetadataRoute.Sitemap = storeProducts.map((p) => ({
    url: `${SITE_URL}/store/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const ensaioEntries: MetadataRoute.Sitemap = ensaios.map((e) => ({
    url: `${SITE_URL}/ensaios/${e.slug}`,
    lastModified: new Date(e.isoDate),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...produtoEntries,
    ...storeEntries,
    ...ensaioEntries,
  ];
}
