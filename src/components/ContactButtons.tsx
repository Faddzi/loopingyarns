import { site, whatsappLink } from "@/lib/site";

export function WhatsAppButton({ message, label = "Message on WhatsApp", className = "" }: { message: string; label?: string; className?: string }) {
  return (
    <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer"
       className={`inline-flex items-center justify-center rounded-pill bg-accent px-5 py-3 font-semibold text-accent-ink ${className}`}>
      {label}
    </a>
  );
}

export function InstagramButton({ label = "Message on Instagram", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer"
       className={`inline-flex items-center justify-center rounded-pill border-2 border-ink px-5 py-3 font-semibold ${className}`}>
      {label}
    </a>
  );
}
