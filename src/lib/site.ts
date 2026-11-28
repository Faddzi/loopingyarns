/**
 * Contact details. Values left empty are shown as visible placeholders.
 * Set them in .env.local once the client confirms them (PRD section 8, questions 6 and 7).
 */
export const site = {
  name: "Looping Yarns",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagramHandle: "looping.yarns",
  instagramUrl: "https://www.instagram.com/looping.yarns/",
  instagramDm: "https://ig.me/m/looping.yarns",
  replyTime: "", // e.g. "within 2 days". Waiting on client.
};

