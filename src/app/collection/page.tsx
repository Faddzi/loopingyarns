import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionGrid, CollectionGridFallback } from "./CollectionGrid";

export const metadata: Metadata = {
  title: "Collection",
  description: "Handmade crochet bags, pouches, caps, charms, flowers and beadwork by Looping Yarns.",
};

export default function Collection() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-5xl md:text-7xl">Collection</h1>
      <Suspense fallback={<CollectionGridFallback />}>
        <CollectionGrid />
      </Suspense>
    </div>
  );
}
