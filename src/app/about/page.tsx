import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";
import { StitchMoment } from "./StitchMoment";
import { PixelArwa } from "@/components/PixelArwa";

export const metadata: Metadata = {
  title: "About",
  description: "The maker behind Looping Yarns, handmade crochet and beadwork.",
};

// Process steps are shown only where real clips or photos exist. None are in the content yet.
const processSteps: { title: string; media: string | null }[] = [];

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <PixelArwa />
        <div>
          <h1 className="text-5xl md:text-7xl">About</h1>
          {/* Draft copy written for review. Client to approve before launch. */}
          <p className="mt-6 text-xl font-semibold">Hi, I&apos;m Arwa.</p>
          <div className="mt-4 max-w-prose space-y-4">
            <p>I picked up a crochet hook in Mumbai in 2016 to make one bag for myself. Then a friend wanted one, and then her sister did. Looping Yarns grew one loop at a time from there.</p>
            <p>Everything here is made by hand, stitch by stitch, at my table: bags and pouches, caps, charms, flowers, little plushies, and beadwork when a piece needs a bit of shine.</p>
            <p>Most of what I make is custom. You bring the idea, the colours or a photo you love, and we work it out together until it feels like yours.</p>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-4xl md:text-5xl">How a piece is made</h2>
        <p className="mt-6 max-w-prose">Yarn, a hook, a handful of beads and a lot of patience. Each piece starts as a single chain and is built row by row until it&apos;s ready to wear, carry or gift.</p>
        {processSteps.length === 0 ? (
          <p className="mt-4"><Placeholder>Process clips or photos pending from client</Placeholder></p>
        ) : null}
        <StitchMoment />
      </section>
    </div>
  );
}
