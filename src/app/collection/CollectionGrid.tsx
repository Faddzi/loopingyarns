"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PieceTile } from "@/components/PieceTile";
import { categories, pieces } from "@/lib/content";

const filters = categories.filter((c) => c.slug !== "custom" && (c.pending || pieces.some((p) => p.category === c.slug)));

/** Category filter + grid. Filtering runs in the browser so the page itself stays static. */
export function CollectionGrid() {
  const category = useSearchParams().get("category");
  return <Grid category={category} />;
}
export function CollectionGridFallback() { return <Grid category={null} />; }

function Grid({ category }: { category: string | null }) {
  const active = filters.find((c) => c.slug === category);
  const shown = active ? pieces.filter((p) => p.category === active.slug) : pieces;
  return (
    <>
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
        <p className="mt-10">New {active?.name?.toLowerCase()} pieces are on the hook. Want one now? Order a custom piece and I&apos;ll make it for you.</p>
      )}
    </>
  );
}

function FilterLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} scroll={false} aria-current={current ? "page" : undefined}
          className={`rounded-pill border-2 px-4 py-2 font-semibold ${current ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}>
      {children}
    </Link>
  );
}
