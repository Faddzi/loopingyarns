import data from "@/content/pieces.json";

export type Tone = "claret" | "butter" | "lilac" | "navy" | "pink" | "cream";

export type Piece = {
  slug: string;
  name: string;
  category: string;
  featured: boolean;
  tone: Tone;
  /** Paths under /public, first image is the cover, second is the hover angle. */
  images: { src: string; alt: string; width: number; height: number }[];
  /** Path to an MP4 under /public, or "pending" while the client export is outstanding. */
  reel: string | null;
  price: string | null;
  colours: string[];
  description: string | null;
  /** Where the piece was found, for internal reference only. Not shown on the site. */
  source: string;
};

export type Category = { slug: string; name: string; pending?: boolean };

export const categories: Category[] = data.categories;
export const pieces = data.pieces as Piece[];

export const featuredPieces = pieces.filter((p) => p.featured).slice(0, 8);
export const reelPieces = pieces.filter((p) => p.reel);

export function getPiece(slug: string) {
  return pieces.find((p) => p.slug === slug);
}

export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

/**
 * Categories that have pieces, plus Custom (links to the custom order page) and any category the
 * client has confirmed but not yet supplied photos for (shown with a placeholder).
 */
export const usedCategories = categories.filter(
  (c) => c.slug === "custom" || c.pending || pieces.some((p) => p.category === c.slug),
);
