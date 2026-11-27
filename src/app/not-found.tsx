import Link from "next/link";

/** 404: a dropped stitch. The row of stitches unravels once into a loose strand (static with reduced motion). */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <svg viewBox="0 0 300 120" className="mx-auto w-full max-w-md" aria-hidden="true" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round">
        <path className="unravel" pathLength={1} d="M10 60 c20-40 40-40 40 0 s20 40 40 0 s20-40 40 0 s20 40 30 10 C 190 40, 220 110, 290 100" />
      </svg>
      <h1 className="mt-8 text-5xl md:text-6xl">Page not found</h1>
      <p className="mt-4">This page doesn&apos;t exist. It may have moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-pill bg-accent px-5 py-3 font-semibold text-accent-ink">Go to home</Link>
        <Link href="/collection" className="rounded-pill border-2 border-ink px-5 py-3 font-semibold">See the collection</Link>
      </div>
    </div>
  );
}
