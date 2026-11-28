export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { pieces } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/collection/", "/about/", "/custom/"].map((p) => ({ url: `${site.url}${p}` }));
  return [...pages, ...pieces.map((p) => ({ url: `${site.url}/collection/${p.slug}/` }))];
}
