"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { MAX_FILES, MAX_FILE_BYTES, validateEnquiry, type FieldErrors } from "@/lib/enquiry";

type State = "idle" | "sending" | "sent" | "error";

export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("references").filter((f): f is File => f instanceof File && f.size > 0);
    const found = validateEnquiry(Object.fromEntries([...data.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>, files);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: data });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-lg bg-surface p-8">
        <h2 className="text-3xl">Enquiry sent</h2>
        <p className="mt-3">
          Looping Yarns will reply {site.replyTime || "within 2 days"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-lg bg-surface p-6 md:p-8">
      <h2 className="text-3xl">Custom order form</h2>
      <Field name="name" label="Name" required error={errors.name} autoComplete="name" />
      <Field name="phone" label="Phone or WhatsApp" required error={errors.phone} type="tel" autoComplete="tel" />
      <Field name="email" label="Email" required error={errors.email} type="email" autoComplete="email" />
      <Field name="itemType" label="Item type (optional)" error={errors.itemType} />
      <Field name="colours" label="Colours (optional)" error={errors.colours} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="quantity" label="Quantity (optional)" error={errors.quantity} type="number" min={1} inputMode="numeric" />
        <Field name="neededBy" label="Needed by (optional)" error={errors.neededBy} type="date" />
      </div>
      <Field name="budget" label="Budget range (optional)" error={errors.budget} />
      <div className="grid gap-1.5">
        <label htmlFor="message" className="font-semibold">Message (optional)</label>
        <textarea id="message" name="message" rows={5} className="rounded-lg border-2 border-line bg-bg p-3" />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="references" className="font-semibold">Reference images (optional, up to {MAX_FILES}, {MAX_FILE_BYTES / 1024 / 1024} MB each)</label>
        <input id="references" name="references" type="file" className="w-full min-w-0 text-sm" accept="image/*" multiple aria-describedby={errors.references ? "references-error" : undefined} />
        {errors.references && <p id="references-error" className="text-sm font-semibold">{errors.references}</p>}
      </div>
      {/* Honeypot: hidden from people, often filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={state === "sending"} className="justify-self-start rounded-pill bg-accent px-6 py-3 font-semibold text-accent-ink disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      {state === "error" && (
        <div role="alert" className="rounded-lg border-2 border-ink p-4">
          <p className="font-semibold">The enquiry didn&apos;t send.</p>
          <p className="mt-1">Try again, or send the details on WhatsApp instead.</p>
          <a href={whatsappLink("Hi Looping Yarns, I'd like to ask about a custom piece.")} target="_blank" rel="noopener noreferrer"
             className="mt-3 inline-flex rounded-pill bg-accent px-5 py-2.5 font-semibold text-accent-ink">Message on WhatsApp</a>
        </div>
      )}
    </form>
  );
}

function Field({ name, label, error, required, ...rest }: { name: string; label: string; error?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="font-semibold">{label}</label>
      <input id={name} name={name} required={required} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}
             className="rounded-lg border-2 border-line bg-bg p-3 aria-[invalid=true]:border-ink" {...rest} />
      {error && <p id={`${name}-error`} className="text-sm font-semibold">{error}</p>}
    </div>
  );
}
