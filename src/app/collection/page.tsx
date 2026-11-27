import type { Metadata } from "next";
import Link from "next/link";
import { PieceTile } from "@/components/PieceTile";
import { Placeholder } from "@/components/Placeholder";
import { categories, pieces } from "@/lib/content";

export const metadata: Metadata = {
  title: "Collection",
  description: "Handmade crochet bags, pouches, caps, charms, flowers and beadwork by Looping Yarns.",
};

export default async function Collection({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const active = categories.find((c) => c.slug === category && c.slug !== "custom");
  const filters = categories.filter((c) => c.slug !== "custom" && (c.pending || pieces.some((p) => p.category === c.slug)));
  const shown = active ? pieces.filter((p) => p.category === active.slug) : pieces;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-5xl md:text-7xl">Collection</h1>
      <nav aria-label="Filter by category" className="mt-8 flex flex-wrap gap-2">
        <FilterLink href="/collection" current={!active}>All</FilterLink>
        {filters.map((c) => (
          <FilterLink key={c.slug} href={`/collection?category=${c.slug}`} current={active?.slug === c.slug}>{c.name}</FilterLink>
        ))}
      </nav>
      {shown.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((p, i) => <PieceTile key={p.slug} piece={p} priority={i < 4} />)}
        </div>
      ) : (
        <p className="mt-10"><Placeholder>{active?.name} pieces: photos pending from client</Placeholder></p>
      )}
    </div>
  );
}

function FilterLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined}
          className={`rounded-pill border-2 px-4 py-2 font-semibold ${current ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}>
      {children}
    </Link>
  );
}
