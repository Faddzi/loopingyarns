import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { LookSwitcher, lookInitScript } from "@/components/LookSwitcher";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { YarnCursor } from "@/components/YarnCursor";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Looping Yarns | Handmade crochet", template: "%s | Looping Yarns" },
  description: "Handmade crochet and beadwork by Looping Yarns. Bags, pouches, caps, charms and custom pieces.",
  openGraph: { siteName: "Looping Yarns", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-look="candy" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: lookInitScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <LookSwitcher />
        <SmoothScroll />
        <YarnCursor />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url, sameAs: [site.instagramUrl],
        }) }} />
      </body>
    </html>
  );
}
