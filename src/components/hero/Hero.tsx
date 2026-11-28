"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Piece } from "@/lib/content";
import { PieceMedia } from "../PieceMedia";
import { swatches } from "./palette";
import { YarnPoster } from "./YarnPoster";
import { heroProgress, stage, STAGES } from "./progress";
import type { HeroLayout } from "./YarnScene";

const YarnScene = dynamic(() => import("./YarnScene"), { ssr: false });

/**
 * Home hero. With 3D on, the section is pinned for a short scroll while the yarn sequence plays.
 * With reduced motion or on low-power devices it is a normal static section with a drawn yarn ball.
 */
export function Hero({ piece }: { piece: Piece }) {
  const [colour, setColour] = useState<string>(swatches[0].yarn);
  const [live, setLive] = useState(false);
  const [layout, setLayout] = useState<HeroLayout | null>(null);
  const section = useRef<HTMLElement>(null);
  const reveal = useRef<HTMLAnchorElement>(null);

  // The 3D scene loads on the visitor's first interaction, so it never competes with the first paint.
  // Until then (and for good with reduced motion, low power or no WebGL) the drawn ball stands in.
  const [capable, setCapable] = useState(true);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData;
    const webgl = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
    if (reduce || lowPower || !webgl) { setCapable(false); return; }
    const events = ["pointerdown", "pointermove", "wheel", "touchstart", "keydown", "scroll"] as const;
    const start = () => { events.forEach((e) => removeEventListener(e, start)); setLive(true); };
    events.forEach((e) => addEventListener(e, start, { passive: true, once: true }));
    return () => events.forEach((e) => removeEventListener(e, start));
  }, []);

  useEffect(() => {
    if (!capable || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (self) => {
        heroProgress.value = self.progress;
        const r = stage(self.progress, ...STAGES.resolve);
        if (reveal.current) {
          reveal.current.style.opacity = String(r);
          reveal.current.style.transform = `translate(-50%, -50%) scale(${0.85 + 0.15 * r})`;
          reveal.current.style.pointerEvents = r > 0.5 ? "auto" : "none";
          reveal.current.tabIndex = r > 0.5 ? 0 : -1;
        }
      },
    });
    return () => { st.kill(); heroProgress.value = 0; };
  }, [capable]);

  const onLayout = useCallback((l: HeroLayout) => setLayout(l), []);

  const copy = (
    <div className="relative z-10 max-w-xl">
      <h1 className="text-[clamp(3.25rem,10vw,7.5rem)]">Looping Yarns
        <span className="block mt-3 font-sans text-lg font-semibold tracking-normal text-muted md:text-2xl">Handmade crochet &amp; beadwork from Mumbai</span>
      </h1>
      <p className="mt-5 max-w-md text-lg">Bags, caps, charms, clothes and custom pieces, made by hand one loop at a time. Shipped worldwide.</p>
      <Link href="/custom" className="mt-8 inline-flex rounded-pill bg-accent px-6 py-3.5 text-lg font-semibold text-accent-ink">
        Order a custom piece
      </Link>
    </div>
  );

  const swatchPicker = (
    <fieldset className="flex items-center gap-3">
      <legend className="sr-only">Yarn colour</legend>
      {swatches.map((s) => (
        <label key={s.name} className="cursor-pointer">
          <input type="radio" name="yarn" className="peer sr-only" checked={colour === s.yarn} onChange={() => setColour(s.yarn)} />
          <span className="block h-9 w-9 rounded-full border-2 border-transparent ring-2 ring-line peer-checked:border-bg peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-accent"
                style={{ background: s.yarn }} />
          <span className="sr-only">{s.name}</span>
        </label>
      ))}
    </fieldset>
  );

  if (!capable) {
    return (
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-8 md:grid-cols-[1fr_1.1fr] md:px-8 md:pt-16">
        {copy}
        <div>
          <div className="mx-auto aspect-square w-full max-w-[560px]"><YarnPoster colour={colour} /></div>
          <div className="mt-4 flex justify-center">{swatchPicker}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[260svh] motion-reduce:h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {live ? (
          <div className="absolute inset-0"><YarnScene colour={colour} onLayout={onLayout} /></div>
        ) : (
          // Same place and size as the 3D ball (see useStageLayout in YarnScene).
          <div aria-hidden="true" className="absolute left-1/2 top-[62%] aspect-square w-[min(69svh,69vw)] -translate-x-1/2 -translate-y-1/2 landscape:left-[74%] landscape:top-[51.4%]">
            <YarnPoster colour={colour} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-7xl flex-col justify-between px-4 pb-24 pt-24 md:justify-center md:px-8 md:pb-8">
          <div className="pointer-events-auto">{copy}</div>
          <div className="pointer-events-auto mt-6 md:absolute md:bottom-10 md:right-8">{swatchPicker}</div>
        </div>
        {layout && (
          <Link ref={reveal} href={`/collection/${piece.slug}`} tabIndex={-1}
                className="absolute block overflow-hidden rounded-full opacity-0 transition-none"
                style={{ left: layout.cx, top: layout.cy, width: layout.r * 1.7, height: layout.r * 1.7, transform: "translate(-50%, -50%) scale(0.85)", pointerEvents: "none" }}
                aria-label={`See the ${piece.name}`}>
            <PieceMedia piece={piece} sizes="40vw" ratio="h-full w-full" />
          </Link>
        )}
        <a href="#featured" className="sr-only focus:not-sr-only focus:absolute focus:bottom-4 focus:left-1/2 focus:-translate-x-1/2 focus:rounded-pill focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
          Skip to featured pieces
        </a>
      </div>
    </section>
  );
}
