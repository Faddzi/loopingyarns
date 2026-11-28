"use client";

import { useEffect, useRef, useState } from "react";

/** Pixel-art Arwa, 20 x 30 cells. One character per cell; see PALETTE. */
export const ARWA = [
  "........kkkk........",
  ".......khhhhk.......",
  ".......khhhhk.......",
  ".....kkkhhhhkkk.....",
  "....khhhhhhhhhhk....",
  "...khhhhhhhhhhhhk...",
  "...khhsssssssshhk...",
  "...khsssssssssshk...",
  "...khskksssskkshk...",
  "...khskwsssskwshk...",
  "...khsbssssssbshk...",
  "...khssssmmsssshk...",
  "....khSssssssShk....",
  ".....kSSssssSSk.....",
  "......kkSSSSkk......",
  ".....kccSsSScck.....",
  "....kccttttttcck....",
  "...kCccttttttccCk...",
  "...kCccttttttccCk...",
  "...kCcctyyyytccCk...",
  "...kCcsyYYyyyscCk...",
  "...kCcsyyyyyyscCk..g",
  "...ksccyyyyyyccskgg.",
  "....kppppppppppkg...",
  "....kppppppppppk....",
  "....kppppkkppppk....",
  "....kppppkkppppk....",
  "....kppppkkppppk....",
  "...kkooookkooookk...",
  "...kkkkkk..kkkkkk...",
];

const PALETTE: Record<string, string> = {
  k: "#241a3a", // outline
  h: "#2b1d1a", // hair
  s: "#c98e6b", // skin
  S: "#a8714f", // skin shade
  w: "#ffffff",
  b: "#f490b4", // blush
  m: "#7a2f3f", // mouth
  c: "#b9a4f2", // cardigan
  C: "#9480d8", // cardigan shade
  t: "#f6c94c", // top
  y: "#7a2f3f", // yarn
  Y: "#a8495f", // yarn highlight
  g: "#c9ccd4", // hook
  p: "#22325c", // trousers
  o: "#241a3a", // shoes
};

/** Small pixel yarn ball, 5 x 5. */
const BALL = [".xxx.", "xxXxx", "xXxxx", "xxxXx", ".xxx."];

const LINES = [
  "One more row, I promise",
  "Has anyone seen my hook?",
  "Every bead goes on by hand",
  "Counting stitches… 41, 42…",
  "Yes, I can make it in claret",
  "This one’s going to be a gift",
];

function Pixels({ grid, palette, x = 0, y = 0 }: { grid: string[]; palette: Record<string, string>; x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {grid.flatMap((row, r) =>
        [...row].map((ch, c) => (palette[ch] ? <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={palette[ch]} /> : null)),
      )}
    </g>
  );
}

/**
 * About-page stand-in for a founder photo: a pixel-art Arwa in her studio, with a speech bubble
 * that changes line every few seconds. The card tilts towards the pointer for a 3D feel (off with reduced motion).
 */
export function PixelArwa({ compact = false }: { compact?: boolean }) {
  const [line, setLine] = useState(0);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % LINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    };
    const reset = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", reset); };
  }, []);

  const balls = ["#f6c94c", "#b9a4f2", "#f490b4", "#22325c", "#7a2f3f"];
  return (
    <figure className="[perspective:900px]" role="img" aria-label="Pixel-art illustration of Arwa in her crochet studio, holding a ball of yarn and a hook">
      <div ref={card} className="relative overflow-hidden rounded-lg border-4 border-ink bg-[#efe6ff] shadow-[8px_8px_0_var(--ink)] transition-transform duration-200 ease-out [transform-style:preserve-3d]"
           style={{ aspectRatio: compact ? "4 / 4" : "4 / 5" }}>
        <svg viewBox="0 0 48 60" className="absolute inset-0 h-full w-full" shapeRendering="crispEdges" aria-hidden="true">
          {/* Wall, floor and a shelf of yarn */}
          <rect width="48" height="60" fill="#efe6ff" />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 8 + 3} y="0" width="2" height="44" fill="#e4d8fb" />)}
          <rect y="44" width="48" height="16" fill="#f6c94c" />
          <rect y="44" width="48" height="1" fill="#241a3a" />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 4} y={48 + (i % 2) * 5} width="2" height="1" fill="#e0b23a" />)}
          <rect x="2" y="20" width="16" height="1.5" fill="#7a2f3f" />
          {balls.slice(0, 3).map((col, i) => <Pixels key={i} grid={BALL} palette={{ x: col, X: "#ffffff88" }} x={2 + i * 5.5} y={15} />)}
          <rect x="31" y="14" width="15" height="1.5" fill="#7a2f3f" />
          {balls.slice(3).map((col, i) => <Pixels key={i} grid={BALL} palette={{ x: col, X: "#ffffff66" }} x={32 + i * 6} y={9} />)}
          {/* Bead garland */}
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={2 + i * 2} y={4 + Math.round(Math.sin((i / 21) * Math.PI) * 3)} width="1.4" height="1.4" fill={balls[i % balls.length]} />
          ))}
          {/* A basket with a spare ball on the floor */}
          <rect x="36" y="46" width="9" height="6" fill="#a8714f" />
          <rect x="36" y="46" width="9" height="1" fill="#241a3a" />
          <Pixels grid={BALL} palette={{ x: "#f490b4", X: "#ffffff88" }} x={38} y={42} />
          {/* Shadow, then Arwa */}
          <rect x="16" y="54" width="18" height="2" fill="#241a3a33" />
          <Pixels grid={ARWA} palette={PALETTE} x={14} y={25} />
        </svg>
        <div className={`absolute left-1/2 top-[6%] w-[78%] -translate-x-1/2 border-4 border-ink bg-white px-3 py-2 shadow-[5px_5px_0_var(--accent)] [transform:translateZ(40px)] ${compact ? "text-sm" : ""}`}>
          <p className="font-display text-accent">Arwa</p>
          <p className="min-h-[1.6em] leading-snug" aria-live="off">{LINES[line]}</p>
          <span aria-hidden="true" className="absolute -bottom-[12px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-ink bg-white" />
        </div>
      </div>
    </figure>
  );
}
