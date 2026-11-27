/** Scroll progress through the hero sequence, 0 to 1. Written by ScrollTrigger, read every frame by the 3D scene. */
export const heroProgress = { value: 0 };

/** Maps p within [a, b] to 0..1, clamped, with smoothstep easing. */
export function stage(p: number, a: number, b: number) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Sequence timing, shared by the 3D scene and the HTML overlay. */
export const STAGES = {
  unravel: [0.08, 0.45] as const,   // strand leaves the ball, ball shrinks
  thread: [0.3, 0.62] as const,     // beads slide onto the strand
  stitch: [0.58, 0.8] as const,     // strand loops into the round badge from the logo
  resolve: [0.78, 0.95] as const,   // a real piece appears inside the loop
};
