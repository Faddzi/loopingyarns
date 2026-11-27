/**
 * Contact details. Values left empty are shown as visible placeholders.
 * Set them in .env.local once the client confirms them (PRD section 8, questions 6 and 7).
 */
export const site = {
  name: "Looping Yarns",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagramHandle: "looping.yarns",
  instagramUrl: "https://www.instagram.com/looping.yarns/",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // digits only, with country code, e.g. 91XXXXXXXXXX
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  location: "", // Instagram bio says Mumbai, India. Waiting on client confirmation.
  replyTime: "", // e.g. "within 2 days". Waiting on client.
};

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  const number = site.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${text}`;
}

export function orderMessage(pieceName: string) {
  return `Hi Looping Yarns, I'd like to order the ${pieceName}.`;
}
