import Link from "next/link";

const nav = [
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/custom", label: "Get in touch" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/95 backdrop-blur-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="display text-2xl md:text-3xl" aria-label="Looping Yarns, home">
          Looping Yarns
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="underline-offset-4 hover:underline">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/custom" className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-accent-ink md:text-base">
          Order a custom piece
        </Link>
      </div>
      <nav aria-label="Main (mobile)" className="flex gap-5 overflow-x-auto px-4 pb-3 text-sm md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap underline-offset-4 hover:underline">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
