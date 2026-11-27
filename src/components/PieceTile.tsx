import Link from "next/link";
import { categoryName, type Piece } from "@/lib/content";
import { PieceMedia } from "./PieceMedia";

export function PieceTile({ piece, priority = false }: { piece: Piece; priority?: boolean }) {
  return (
    <Link href={`/collection/${piece.slug}`} className="group block">
      <PieceMedia piece={piece} priority={priority} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" />
      <p className="mt-3 font-semibold">{piece.name}</p>
      <p className="text-sm text-muted">{categoryName(piece.category)}</p>
    </Link>
  );
}
