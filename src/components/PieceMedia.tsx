import Image from "next/image";
import type { Piece } from "@/lib/content";

/**
 * Cover image for a piece, with a second angle swapped in on hover/focus when supplied.
 * Until the client's export arrives, shows a tinted block with a visible placeholder.
 */
export function PieceMedia({ piece, sizes, priority = false, ratio = "aspect-[4/5]" }: { piece: Piece; sizes: string; priority?: boolean; ratio?: string }) {
  const [cover, second] = piece.images;
  return (
    <div className={`relative overflow-hidden rounded-lg ${ratio} tone-${piece.tone}`}>
      {cover ? (
        <>
          <Image src={cover.src} alt={cover.alt} fill sizes={sizes} priority={priority} className="object-cover" />
          {second && (
            <Image src={second.src} alt={second.alt} fill sizes={sizes}
                   className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-end p-3 text-ink">
          <span className="placeholder bg-bg/70">[Photo pending: {piece.name}]</span>
        </div>
      )}
    </div>
  );
}
