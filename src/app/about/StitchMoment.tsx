"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const StitchScene = dynamic(() => import("@/components/StitchScene"), { ssr: false });

/** The About page's one quiet 3D moment, with a drawn chain as the fallback. */
export function StitchMoment() {
  const box = useRef<HTMLDivElement>(null);
  const progress = useRef({ value: 0 });
  const [live, setLive] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 2;
    if (reduce || lowPower || !box.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || !box.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({ trigger: box.current, start: "top 85%", end: "bottom 35%", scrub: true, onUpdate: (s) => (progress.current.value = s.progress) });
    return () => st.kill();
  }, [live]);

  return (
    <div ref={box} className="relative mt-8 aspect-[2/1] w-full max-w-3xl">
      {live ? <StitchScene progress={progress.current} colour="#b9a4f2" /> : (
        <svg viewBox="0 0 400 200" className="h-full w-full" aria-hidden="true" fill="none" stroke="var(--accent)" strokeWidth="8">
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={70 + i * 65} cy="100" rx="42" ry="60" transform={`rotate(-12 ${70 + i * 65} 100)`} />)}
        </svg>
      )}
    </div>
  );
}
