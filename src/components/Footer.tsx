import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3 md:px-8">
        <p className="display text-2xl">Looping Yarns</p>
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          Instagram @{site.instagramHandle}
        </a>
        <span>Mumbai · Ships worldwide</span>
      </div>
    </footer>
  );
}
