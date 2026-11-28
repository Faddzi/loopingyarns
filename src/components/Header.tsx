import Link from "next/link";
import { asset } from "@/lib/content";

const nav = [
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/custom", label: "Get in touch" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="group display flex items-center gap-3 whitespace-nowrap text-xl sm:text-2xl md:text-3xl" aria-label="Looping Yarns, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/media/logo-mark.png")} alt="" width={48} height={48}
               className="h-10 w-10 rounded-full border-[3px] border-ink shadow-[3px_3px_0_var(--ink)] transition-transform group-hover:-rotate-12 md:h-12 md:w-12" />
          Looping Yarns
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="underline-offset-4 hover:underline">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/custom" className="whitespace-nowrap rounded-pill bg-accent px-3 py-2 text-sm font-semibold text-accent-ink sm:px-4 md:text-base">
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
