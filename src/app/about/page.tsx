import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";
import { StitchMoment } from "./StitchMoment";

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
        <div className="flex aspect-[4/5] items-end rounded-lg bg-surface p-4">
          <Placeholder>Founder photo</Placeholder>
        </div>
        <div>
          <h1 className="text-5xl md:text-7xl">About</h1>
          <p className="mt-6"><Placeholder>Founder name</Placeholder></p>
          <p className="mt-4 max-w-prose"><Placeholder>Founder story, approved copy only</Placeholder></p>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-4xl md:text-5xl">How a piece is made</h2>
        {processSteps.length === 0 ? (
          <p className="mt-6"><Placeholder>Process clips or photos: yarn, hook, beads, finished piece. Pending from client</Placeholder></p>
        ) : null}
        <StitchMoment />
      </section>
    </div>
  );
}
