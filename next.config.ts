import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 builds a static copy for GitHub Pages (see .github/workflows/pages.yml).
 * Pages can't run server code, so the form's route handler (route.api.ts) is left out of that build,
 * and the form falls back to its WhatsApp error state there. A normal build (Vercel or any Node host) keeps it.
 */
const isExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = isExport
  ? {
      output: "export",
      basePath,
      images: { unoptimized: true },
      trailingSlash: true,
      pageExtensions: ["tsx", "ts"],
    }
  : {
      pageExtensions: ["api.ts", "tsx", "ts"],
    };

export default nextConfig;
