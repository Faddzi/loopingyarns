"use client";

import Link from "next/link";
import { useRef } from "react";
import { categoryName, type Piece } from "@/lib/content";
import { PieceMedia } from "./PieceMedia";

/** Collection tile. On hover or focus it shows the second angle, or plays a muted reel preview if there is no second photo. */
export function PieceTile({ piece, priority = false }: { piece: Piece; priority?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const preview = piece.images.length < 2 && piece.reel && piece.reel !== "pending" ? piece.reel : null;
  const play = () => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!v.src) v.src = preview!;
    v.play().catch(() => {});
  };
  const stop = () => video.current?.pause();

  return (
    <Link href={`/collection/${piece.slug}`} className="group block" onMouseEnter={preview ? play : undefined} onMouseLeave={preview ? stop : undefined}
          onFocus={preview ? play : undefined} onBlur={preview ? stop : undefined}>
      <div className="relative">
        <PieceMedia piece={piece} priority={priority} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" />
        {preview && (
          <video ref={video} muted loop playsInline preload="none" aria-hidden="true"
                 className="absolute inset-0 h-full w-full rounded-lg object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        )}
      </div>
      <p className="mt-3 font-semibold">{piece.name}</p>
      <p className="text-sm text-muted">{categoryName(piece.category)}</p>
    </Link>
  );
}
