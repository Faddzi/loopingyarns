"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop cursor: a needle whose tip is the pointer, with a short yarn tail trailing from its eye.
 * Fine pointer only, and off with reduced motion, where the normal cursor stays.
 * Over text fields the native I-beam comes back so typing stays precise.
 */
export function YarnCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = canvas.current;
    if (!fine || reduce || !c) return;
    const ctx = c.getContext("2d")!;
    const root = document.documentElement;
    root.classList.add("needle-cursor");

    // Needle: tip at the pointer, body running down and to the right like a normal arrow cursor.
    const LEN = 38, ANGLE = Math.PI * 0.3; // ~54° below horizontal
    const dir = { x: Math.cos(ANGLE), y: Math.sin(ANGLE) };
    const eyeAt = LEN - 6;

    const N = 16, SEG = 7;
    const pts = Array.from({ length: N }, () => ({ x: -100, y: -100, px: -100, py: -100 }));
    let mx = -100, my = -100, raf = 0, idle = 0, visible = false, overText = false, overLink = false;

    const resize = () => { const d = Math.min(devicePixelRatio, 2); c.width = innerWidth * d; c.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY; idle = 0; visible = true;
      const t = e.target as Element | null;
      overText = !!t?.closest("input:not([type=radio]):not([type=checkbox]):not([type=file]):not([type=submit]), textarea, select, [contenteditable=true]");
      overLink = !overText && !!t?.closest("a, button, label, [role=button], summary");
    };
    const leave = () => { visible = false; };

    const frame = () => {
      const eye = { x: mx + dir.x * eyeAt, y: my + dir.y * eyeAt };
      pts[0].x = eye.x; pts[0].y = eye.y;
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
      if (visible && !overText) {
        const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#6b2e3a";
        // Thread first, so the needle sits on top of it.
        if (idle++ < 600) {
          ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < N - 1; i++) { const xc = (pts[i].x + pts[i + 1].x) / 2, yc = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc); }
          ctx.stroke();
        }
        drawNeedle(ctx, mx, my, ANGLE, LEN, overLink ? accent : null);
      }
      raf = requestAnimationFrame(frame);
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      root.classList.remove("needle-cursor");
    };
  }, []);
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}

/** A steel needle drawn from its tip (x, y) along angle a. Over links and buttons its body takes the accent colour. */
function drawNeedle(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, len: number, tint: string | null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  const w = 4;
  const body = ctx.createLinearGradient(0, -w, 0, w);
  body.addColorStop(0, tint ?? "#f4f4f6");
  body.addColorStop(0.45, tint ?? "#b9bcc4");
  body.addColorStop(1, tint ? "#00000055" : "#6e727c");
  // Outline keeps it visible on light and dark backgrounds.
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(9, -w / 2);
  ctx.lineTo(len - 2, -w / 2);
  ctx.quadraticCurveTo(len + 1.5, 0, len - 2, w / 2);
  ctx.lineTo(9, w / 2);
  ctx.closePath();
  ctx.fillStyle = body;
  ctx.strokeStyle = "#241a3a";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
  // The eye the yarn runs through.
  ctx.beginPath();
  ctx.ellipse(len - 6, 0, 3.2, 1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#241a3a";
  ctx.fill();
  ctx.restore();
}
