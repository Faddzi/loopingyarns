import type { Metadata } from "next";
import Link from "next/link";
import { InstagramButton } from "@/components/ContactButtons";
import { PixelArwa } from "@/components/PixelArwa";
import { ProcessSteps } from "@/components/ProcessSteps";
import { asset } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "The maker behind Looping Yarns, handmade crochet and beadwork.",
};

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
          <ul className="mt-8 grid grid-cols-2 gap-4">
            {[
              ["Since 2016", "Hooking away in Mumbai"],
              ["100% handmade", "Every stitch, by hand"],
              ["Made to order", "Your colours, your idea"],
              ["Ships worldwide", "From Mumbai to you"],
            ].map(([t, d], i) => (
              <li key={t} className={`rounded-lg border-4 border-ink p-4 shadow-[6px_6px_0_var(--ink)] ${i % 2 ? "bg-surface" : "bg-bg"}`}>
                <p className="display text-xl">{t}</p>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border-4 border-ink bg-surface p-6 shadow-[6px_6px_0_var(--ink)]">
            <p className="display text-2xl">Got an idea in mind?</p>
            <p className="mt-2 text-muted">Tell me what you&apos;re dreaming of and I&apos;ll crochet it for you.</p>
            <Link href="/custom" className="mt-4 inline-block rounded-pill border-4 border-ink bg-accent px-6 py-3 font-semibold text-accent-ink shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5">Order a custom piece</Link>
            <InstagramButton label="Say hi on Instagram" className="ml-3 mt-4" />
            <p className="display mt-4 text-lg">— Arwa ♡</p>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-4xl md:text-5xl">How a piece is made</h2>
        <video src={asset("/media/yarn-process.mp4")} muted loop autoPlay playsInline preload="metadata" aria-label="Yarn balls ready to be crocheted"
               className="float-right ml-6 mt-6 hidden w-48 rounded-lg border-4 border-ink shadow-[6px_6px_0_var(--ink)] md:block" />
        <p className="mt-6 max-w-prose">Yarn, a hook, a handful of beads and a lot of patience. Each piece starts as a single chain and is built row by row until it&apos;s ready to wear, carry or gift.</p>
        <ProcessSteps />
      </section>
    </div>
  );
}
