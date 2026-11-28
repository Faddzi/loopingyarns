import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Lightbox";
import { InstagramButton } from "@/components/ContactButtons";
import { categoryName, getPiece, pieces } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const piece = getPiece((await params).slug);
  if (!piece) return {};
  return { title: piece.name, description: `${piece.name}, handmade crochet by Looping Yarns. Order on Instagram.` };
}

export default async function PiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const piece = getPiece((await params).slug);
  if (!piece) notFound();

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 md:px-8">
      <Gallery piece={piece} />
      <div className="md:sticky md:top-28 md:self-start">
        <Link href={`/collection?category=${piece.category}`} className="text-muted underline-offset-4 hover:underline">{categoryName(piece.category)}</Link>
        <h1 className="mt-2 text-5xl md:text-6xl">{piece.name}</h1>
        {piece.price && <p className="mt-4 text-2xl font-semibold">{piece.price}</p>}
        {piece.colours.length > 0 && <p className="mt-4">Colours: {piece.colours.join(", ")}</p>}
        {piece.description && <p className="mt-4 max-w-prose">{piece.description}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <InstagramButton label="Order on Instagram" />
        </div>
      </div>
      {piece.price && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Product", name: piece.name,
          image: piece.images.map((i) => new URL(i.src, site.url).toString()),
          brand: { "@type": "Brand", name: site.name },
        }) }} />
      )}
    </div>
  );
}
