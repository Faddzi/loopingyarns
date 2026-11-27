"use client";

import { useEffect, useRef } from "react";

/** A short yarn tail that follows the mouse. Desktop with a fine pointer only, and off with reduced motion. */
export function YarnCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = canvas.current;
    if (!fine || reduce || !c) return;
    const ctx = c.getContext("2d")!;
    const N = 14, SEG = 7;
    const pts = Array.from({ length: N }, () => ({ x: -100, y: -100, px: -100, py: -100 }));
    let mx = -100, my = -100, raf = 0, idle = 0;
    const resize = () => { const d = Math.min(devicePixelRatio, 2); c.width = innerWidth * d; c.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const move = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; mx = e.clientX; my = e.clientY; idle = 0; };
    const frame = () => {
      pts[0].x = mx; pts[0].y = my;
      for (let i = 1; i < N; i++) {
        const p = pts[i]; const vx = (p.x - p.px) * 0.9, vy = (p.y - p.py) * 0.9 + 0.35;
        p.px = p.x; p.py = p.y; p.x += vx; p.y += vy;
      }
      for (let k = 0; k < 3; k++) for (let i = 1; i < N; i++) {
        const a = pts[i - 1], b = pts[i]; const dx = b.x - a.x, dy = b.y - a.y; const d = Math.hypot(dx, dy) || 1; const diff = (d - SEG) / d;
        if (i > 1) { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; }
        b.x -= dx * diff * (i > 1 ? 0.5 : 1); b.y -= dy * diff * (i > 1 ? 0.5 : 1);
      }
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (idle++ < 240) {
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent");
        ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < N - 1; i++) { const xc = (pts[i].x + pts[i + 1].x) / 2, yc = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc); }
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    resize(); addEventListener("resize", resize); addEventListener("pointermove", move);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}
