import { site, whatsappLink } from "@/lib/site";
import { Placeholder } from "./Placeholder";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4 md:px-8">
        <p className="display text-2xl">Looping Yarns</p>
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          Instagram @{site.instagramHandle}
        </a>
        <a href={whatsappLink("Hi Looping Yarns!")} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          WhatsApp {site.whatsappNumber ? null : <Placeholder>number to confirm</Placeholder>}
        </a>
        <div className="flex flex-col gap-1">
          {site.email ? <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">{site.email}</a> : <Placeholder>email to confirm</Placeholder>}
          {site.location ? <span>{site.location}</span> : <Placeholder>location to confirm</Placeholder>}
        </div>
      </div>
    </footer>
  );
}
