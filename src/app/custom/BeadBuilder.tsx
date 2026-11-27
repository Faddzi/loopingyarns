"use client";

import { useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";

/**
 * Bead builder: drag beads from the tray onto the strand (or press one to add it), then send the design on WhatsApp.
 * Bead colours and shapes are proposals until the client confirms which beads they stock.
 */
const BEADS = [
  { id: "claret-round", name: "Claret round", colour: "#7a2f3f", shape: "round" },
  { id: "lilac-round", name: "Lilac round", colour: "#b9a4f2", shape: "round" },
  { id: "butter-round", name: "Butter round", colour: "#f2c14e", shape: "round" },
  { id: "pink-round", name: "Pink round", colour: "#f490b4", shape: "round" },
  { id: "cream-disc", name: "Cream disc", colour: "#f4ece0", shape: "disc" },
  { id: "navy-disc", name: "Navy disc", colour: "#22325c", shape: "disc" },
] as const;
type Bead = (typeof BEADS)[number];
const MAX = 18;

export function BeadBuilder() {
  const [strand, setStrand] = useState<Bead[]>([]);
  const [dragging, setDragging] = useState<{ bead: Bead; x: number; y: number } | null>(null);
  const [over, setOver] = useState(false);
  const target = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  const add = (b: Bead) => setStrand((s) => {
    if (s.length >= MAX) { setStatus(`The strand holds up to ${MAX} beads.`); return s; }
    setStatus(`Added ${b.name}. ${s.length + 1} beads on the strand.`);
    return [...s, b];
  });
  const removeAt = (i: number) => setStrand((s) => { setStatus(`Removed ${s[i].name}.`); return s.filter((_, j) => j !== i); });

  function inside(x: number, y: number) {
    const r = target.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top - 30 && y <= r.bottom + 30;
  }

  function startDrag(e: React.PointerEvent, bead: Bead) {
    const startX = e.clientX, startY = e.clientY;
    let moved = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
      moved = true;
      setDragging({ bead, x: ev.clientX, y: ev.clientY });
      setOver(inside(ev.clientX, ev.clientY));
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!moved || inside(ev.clientX, ev.clientY)) add(bead); // a tap adds too
      setDragging(null); setOver(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const counts = strand.reduce<Record<string, number>>((m, b) => ((m[b.name] = (m[b.name] ?? 0) + 1), m), {});
  const summary = `Hi Looping Yarns, I designed a beaded piece on your site.\nBeads in order: ${strand.map((b) => b.name).join(", ")}.\nTotal: ${Object.entries(counts).map(([n, c]) => `${c} ${n}`).join(", ")}.`;

  return (
    <section className="rounded-lg bg-surface p-6 md:p-8">
      <h2 className="text-3xl">Bead builder</h2>
      <p className="mt-2 text-muted">Drag beads onto the strand, or press a bead to add it. Press a bead on the strand to remove it.</p>

      <div role="group" aria-label="Bead tray" className="mt-6 flex flex-wrap gap-3">
        {BEADS.map((b) => (
          <button key={b.id} type="button" onPointerDown={(e) => startDrag(e, b)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); add(b); } }}
                  className="flex touch-none select-none items-center gap-2 rounded-pill border-2 border-line bg-bg px-3 py-2 text-sm font-semibold"
                  aria-label={`Add ${b.name}`}>
            <BeadShape bead={b} /> {b.name}
          </button>
        ))}
      </div>

      <div ref={target} className={`relative mt-8 flex min-h-20 items-center rounded-lg border-2 border-dashed px-4 ${over ? "border-ink" : "border-line"}`}>
        <div aria-hidden="true" className="absolute inset-x-2 top-1/2 h-[3px] -translate-y-1/2 rounded bg-ink/60" />
        <ol aria-label="Your strand" className="relative flex flex-wrap items-center gap-0.5 py-3">
          {strand.map((b, i) => (
            <li key={i}>
              <button type="button" onClick={() => removeAt(i)} aria-label={`Remove ${b.name}, bead ${i + 1}`} className="block rounded-full">
                <BeadShape bead={b} size={30} />
              </button>
            </li>
          ))}
        </ol>
        {strand.length === 0 && <p className="relative mx-auto bg-surface px-2 text-sm text-muted">Empty strand</p>}
      </div>
      <p aria-live="polite" className="sr-only">{status}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={strand.length ? whatsappLink(summary) : undefined} aria-disabled={!strand.length} target="_blank" rel="noopener noreferrer"
           className={`inline-flex rounded-pill bg-accent px-5 py-3 font-semibold text-accent-ink ${strand.length ? "" : "pointer-events-none opacity-50"}`}>
          Send this design on WhatsApp
        </a>
        {strand.length > 0 && (
          <button type="button" onClick={() => { setStrand([]); setStatus("Strand cleared."); }} className="rounded-pill border-2 border-ink px-5 py-3 font-semibold">
            Clear strand
          </button>
        )}
      </div>

      {dragging && (
        <div aria-hidden="true" className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2" style={{ left: dragging.x, top: dragging.y }}>
          <BeadShape bead={dragging.bead} size={36} />
        </div>
      )}
    </section>
  );
}

function BeadShape({ bead, size = 22 }: { bead: Bead; size?: number }) {
  const disc = bead.shape === "disc";
  return (
    <svg width={disc ? size * 0.6 : size} height={size} viewBox={disc ? "0 0 12 20" : "0 0 20 20"} aria-hidden="true">
      <defs>
        <radialGradient id={`g-${bead.id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="35%" stopColor={bead.colour} />
          <stop offset="100%" stopColor={bead.colour} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      {disc ? <rect x="1" y="1" width="10" height="18" rx="4" fill={`url(#g-${bead.id})`} stroke="#0003" />
            : <circle cx="10" cy="10" r="9" fill={`url(#g-${bead.id})`} stroke="#0003" />}
    </svg>
  );
}
