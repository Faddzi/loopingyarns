"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Piece } from "@/lib/content";
import { PieceMedia } from "./PieceMedia";

/** Product gallery with a full-size lightbox: swipe, arrow keys, Escape, and a close button. */
export function Gallery({ piece }: { piece: Piece }) {
  const [open, setOpen] = useState<number | null>(null);
  const images = piece.images;

  if (images.length === 0) {
    return <PieceMedia piece={piece} sizes="(min-width: 768px) 50vw, 100vw" priority />;
  }

  return (
    <>
      <div className="grid gap-3">
        {images.map((img, i) => (
          <button key={img.src} type="button" onClick={() => setOpen(i)} className="relative aspect-[4/5] overflow-hidden rounded-lg" aria-label={`View ${img.alt} full size`}>
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" priority={i === 0} className="object-cover" />
          </button>
        ))}
      </div>
      {open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

function Lightbox({ images, index, onIndex, onClose }: { images: Piece["images"]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => onIndex((index + d + images.length) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; prev?.focus(); };
  }, [go, onClose]);

  const img = images[index];
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
         onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
         onTouchEnd={(e) => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); touchX.current = null; }}>
      <div className="relative h-[85vh] w-[92vw]">
        <Image src={img.src} alt={img.alt} fill sizes="92vw" className="object-contain" />
      </div>
      <button ref={closeBtn} type="button" onClick={onClose} className="absolute right-4 top-4 rounded-pill bg-white px-4 py-2 font-semibold text-black">Close</button>
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} className="absolute left-4 top-1/2 rounded-pill bg-white px-4 py-2 font-semibold text-black">Previous</button>
          <button type="button" onClick={() => go(1)} className="absolute right-4 top-1/2 rounded-pill bg-white px-4 py-2 font-semibold text-black">Next</button>
        </>
      )}
    </div>
  );
}
