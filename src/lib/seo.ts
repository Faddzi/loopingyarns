import type { Metadata } from "next";

/** Canonical URL and og:url for a page path (with trailing slash, matching the static export). */
export const pageMeta = (path: string): Pick<Metadata, "alternates" | "openGraph"> => ({
  alternates: { canonical: path },
  openGraph: { siteName: "Looping Yarns", type: "website", url: path },
});
