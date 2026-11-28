import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { InstagramButton } from "@/components/ContactButtons";
import { CollectionGrid, CollectionGridFallback } from "./CollectionGrid";

export const metadata: Metadata = {
  ...pageMeta("/collection/"),
  title: "Handmade crochet collection",
  description: "Shop handmade crochet bags, pouches, caps, charms, clothes and bouquets by Looping Yarns, Mumbai. Ships worldwide.",
};

export default function Collection() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-5xl md:text-7xl">Collection{" "}<span className="block mt-3 font-sans text-lg font-semibold tracking-normal text-muted md:text-2xl">Handmade crochet bags, caps, charms &amp; clothes</span></h1>
      <Suspense fallback={<CollectionGridFallback />}>
        <CollectionGrid />
      </Suspense>
      <div className="mt-16 rounded-lg border-4 border-ink bg-surface p-6 shadow-[6px_6px_0_var(--ink)]">
        <p className="display text-2xl">Seen something you love?</p>
        <p className="mt-2 text-muted">Send me a DM with the piece name and I&apos;ll get back to you.</p>
        <InstagramButton className="mt-4" />
      </div>
    </div>
  );
}
