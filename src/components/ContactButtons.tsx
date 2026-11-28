import { site } from "@/lib/site";

/** The one Instagram DM call to action used on each page. */
export function InstagramButton({ label = "Message us on Instagram", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={site.instagramDm} target="_blank" rel="noopener noreferrer"
       className={`inline-flex items-center justify-center rounded-pill border-4 border-ink bg-accent px-6 py-3 font-semibold text-accent-ink shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5 ${className}`}>
      {label}
    </a>
  );
}
