import { Bagel_Fat_One, Figtree, Gloock, Hanken_Grotesk, Bricolage_Grotesque, Schibsted_Grotesk } from "next/font/google";

// Candy pop: chunky rounded display + friendly sans
export const bagel = Bagel_Fat_One({ subsets: ["latin"], weight: "400", variable: "--font-bagel", display: "swap" });
export const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
// Soft studio: elegant serif display + clean sans
export const gloock = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-gloock", display: "swap", preload: false });
export const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap", preload: false });
// Night bead: modern grotesk pair
export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", preload: false });
export const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap", preload: false });

export const fontVariables = [bagel, figtree, gloock, hanken, bricolage, schibsted].map((f) => f.variable).join(" ");
