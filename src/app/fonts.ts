import { Bagel_Fat_One, Figtree } from "next/font/google";

// Candy pop: chunky rounded display + friendly sans
export const bagel = Bagel_Fat_One({ subsets: ["latin"], weight: "400", variable: "--font-bagel", display: "swap" });
export const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const fontVariables = [bagel, figtree].map((f) => f.variable).join(" ");
