import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateEnquiry } from "@/lib/enquiry";

/**
 * Receives the custom order form and emails it through Resend.
 * Attachments are held in memory only for the send and are never written to disk, so nothing is kept on the server.
 * Needs RESEND_API_KEY, ENQUIRY_TO (the brand's inbox) and ENQUIRY_FROM (a verified sender).
 */
export async function POST(req: Request) {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 30 * 1024 * 1024) return NextResponse.json({ error: "Too large" }, { status: 413 });

  const data = await req.formData();
  if (String(data.get("website") ?? "")) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const fields: Record<string, string> = {};
  for (const [k, v] of data.entries()) if (typeof v === "string") fields[k] = v;
  const files = data.getAll("references").filter((f): f is File => f instanceof File && f.size > 0);
  const errors = validateEnquiry(fields, files);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) {
    return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Name", fields.name], ["Phone", fields.phone], ["Email", fields.email],
    ["Item type", fields.itemType], ["Colours", fields.colours], ["Quantity", fields.quantity],
    ["Needed by", fields.neededBy], ["Budget", fields.budget], ["Message", fields.message],
  ];
  const text = rows.filter(([, v]) => v?.trim()).map(([k, v]) => `${k}: ${v.trim()}`).join("\n");

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: ENQUIRY_FROM,
    to: ENQUIRY_TO,
    replyTo: fields.email.trim(),
    subject: `Custom order enquiry from ${fields.name.trim()}`,
    text,
    attachments: await Promise.all(files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()) }))),
  });
  if (error) return NextResponse.json({ error: "Send failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
