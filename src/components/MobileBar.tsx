import { site, whatsappLink } from "@/lib/site";

/** Sticky WhatsApp / Instagram bar on small screens (PRD: Global). */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-bg md:hidden">
      <a href={whatsappLink("Hi Looping Yarns!")} target="_blank" rel="noopener noreferrer" className="py-4 text-center font-semibold">
        WhatsApp
      </a>
      <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="border-l border-line py-4 text-center font-semibold">
        Instagram
      </a>
    </div>
  );
}
