/** Shared validation for the custom order form, used in the browser and in the route handler. */
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export type FieldErrors = Partial<Record<string, string>>;

export function validateEnquiry(fields: Record<string, string | undefined>, files: { size: number; type: string }[]): FieldErrors {
  const e: FieldErrors = {};
  const v = (k: string) => (fields[k] ?? "").trim();
  if (!v("name")) e.name = "Enter your name.";
  else if (v("name").length > 120) e.name = "Use 120 characters or fewer.";
  if (!v("phone")) e.phone = "Enter a phone or WhatsApp number.";
  else if (!/^[+\d][\d\s()-]{6,20}$/.test(v("phone"))) e.phone = "Enter a phone number with digits only, for example +91 98765 43210.";
  if (!v("email")) e.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) e.email = "Enter an email like name@example.com.";
  if (v("quantity") && !(Number(v("quantity")) >= 1)) e.quantity = "Enter 1 or more.";
  if (v("message").length > 4000) e.message = "Use 4,000 characters or fewer.";
  for (const k of ["itemType", "colours", "budget"]) if (v(k).length > 200) e[k] = "Use 200 characters or fewer.";
  if (files.length > MAX_FILES) e.references = `Attach up to ${MAX_FILES} images.`;
  else if (files.some((f) => f.size > MAX_FILE_BYTES)) e.references = `Each image must be ${MAX_FILE_BYTES / 1024 / 1024} MB or smaller.`;
  else if (files.some((f) => !f.type.startsWith("image/"))) e.references = "Attach image files only.";
  return e;
}
