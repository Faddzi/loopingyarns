"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/lib/content";

/**
 * Horizontal drag-to-scroll strip of reels. Each reel loads and plays muted only while in view.
 * Tap the sound button to unmute. Reels are placeholders until the client export arrives.
 */
export function ReelsStrip({ pieces }: { pieces: Piece[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  useDragScroll(scroller);
  return (
    <div ref={scroller} className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 active:cursor-grabbing md:px-8"
         role="region" aria-label="Reels" tabIndex={0}>
      {pieces.map((p) => <Reel key={p.slug} piece={p} />)}
    </div>
  );
}

function Reel({ piece }: { piece: Piece }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const hasFile = piece.reel && piece.reel !== "pending";

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        if (!reduce) v.play().catch(() => {});
      } else {
        v.pause();
      }
    }, { threshold: 0.6 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`relative aspect-[9/16] w-[62vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-lg tone-${piece.tone}`}>
      {hasFile ? (
        <>
          <video ref={video} data-src={piece.reel!} muted={muted} loop playsInline preload="none"
                 poster={piece.images[0]?.src} className="h-full w-full object-cover" aria-label={`${piece.name} reel`} />
          <button type="button" onClick={() => setMuted((m) => !m)}
                  className="absolute right-3 top-3 rounded-pill bg-bg/85 px-3 py-1 text-sm font-semibold">
            {muted ? "Sound on" : "Sound off"}
          </button>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-ink">
          <span className="placeholder bg-bg/70">[Reel pending: {piece.name}]</span>
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 p-3">
        <Link href={`/collection/${piece.slug}`} className="rounded-pill bg-bg/85 px-3 py-1 text-sm font-semibold">
          {piece.name}
        </Link>
      </figcaption>
    </figure>
  );
}

/** Mouse drag with momentum. Touch uses native scrolling. */
function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0, lastX = 0, velocity = 0, raf = 0, moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = lastX = e.clientX; startLeft = el.scrollLeft; velocity = 0;
      cancelAnimationFrame(raf);
      el.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      velocity = e.clientX - lastX; lastX = e.clientX;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      const glide = () => {
        velocity *= 0.92;
        el.scrollLeft -= velocity;
        if (Math.abs(velocity) > 0.5) raf = requestAnimationFrame(glide);
        else el.style.scrollSnapType = "";
      };
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(glide);
      else el.style.scrollSnapType = "";
    };
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
