"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Placeholder } from "../Placeholder";
import { swatches } from "./palette";
import { YarnPoster } from "./YarnPoster";

const YarnScene = dynamic(() => import("./YarnScene"), { ssr: false });

export function Hero() {
  const [colour, setColour] = useState<string>(swatches[0].yarn);
  const [live, setLive] = useState(false);

  // Load the 3D scene after first paint, and only where it will run well.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData;
    if (reduce || lowPower) return;
    const start = () => setLive(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start); else setTimeout(start, 300);
  }, []);

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-8 md:grid-cols-[1fr_1.1fr] md:px-8 md:pt-16">
      <div>
        <h1 className="text-[clamp(3.25rem,10vw,7.5rem)]">Looping Yarns</h1>
        <p className="mt-5 max-w-md text-lg">
          <Placeholder>Hero line: client to supply</Placeholder>
        </p>
        <Link href="/custom" className="mt-8 inline-flex rounded-pill bg-accent px-6 py-3.5 text-lg font-semibold text-accent-ink">
          Order a custom piece
        </Link>
      </div>
      <div>
        <div className="relative aspect-square w-full">
          <div className={`absolute inset-0 transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`}>
            <YarnPoster colour={colour} />
          </div>
          {live && <div className="absolute inset-0"><YarnScene colour={colour} /></div>}
        </div>
        <fieldset className="mt-4 flex items-center justify-center gap-3">
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
      </div>
    </section>
  );
}
