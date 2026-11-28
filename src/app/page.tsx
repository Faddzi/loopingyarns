import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { PieceTile } from "@/components/PieceTile";
import { ReelsStrip } from "@/components/ReelsStrip";
import { PixelArwa } from "@/components/PixelArwa";
import { InstagramButton } from "@/components/ContactButtons";
import { featuredPieces, reelPieces, usedCategories } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero piece={featuredPieces[0]} />

      <section id="featured" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <h2 className="text-4xl md:text-5xl">Featured pieces</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {featuredPieces.map((p) => <PieceTile key={p.slug} piece={p} />)}
        </div>
      </section>

      <section className="py-12">
        <h2 className="mx-auto max-w-7xl px-4 text-4xl md:px-8 md:text-5xl">Reels</h2>
        <div className="mt-8"><ReelsStrip pieces={reelPieces} /></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <h2 className="text-4xl md:text-5xl">Categories</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {usedCategories.map((c) => (
            <li key={c.slug}>
              <Link href={c.slug === "custom" ? "/custom" : `/collection?category=${c.slug}`}
                    className="inline-block rounded-pill border-2 border-ink px-5 py-2.5 text-lg font-semibold hover:bg-ink hover:text-bg">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-8">
        <div className="mx-auto w-full max-w-md"><PixelArwa compact /></div>
        <div>
          <h2 className="text-4xl md:text-5xl">About</h2>
          <p className="mt-4 max-w-prose">Every piece is crocheted by hand by Arwa in Mumbai, one loop at a time, since 2016.</p>
          <Link href="/about" className="mt-6 inline-block font-semibold underline underline-offset-4">Read about Looping Yarns</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-lg bg-surface px-6 py-12 md:px-12">
          <h2 className="text-4xl md:text-5xl">Order or ask for a custom piece</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <InstagramButton label="Order on Instagram" />
            <Link href="/custom" className="inline-flex items-center rounded-pill px-5 py-3 font-semibold underline underline-offset-4">Custom order form</Link>
          </div>
        </div>
      </section>
    </>
  );
}
