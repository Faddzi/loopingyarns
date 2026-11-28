import type { Metadata } from "next";
import { EnquiryForm } from "./EnquiryForm";
import { BeadBuilder } from "./BeadBuilder";
import { InstagramButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Custom orders",
  description: "Ask Looping Yarns for a custom crochet or beaded piece. Send reference photos, colours and your date.",
};

export default function Custom() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:px-8">
      <div className="min-w-0">
        <h1 className="text-5xl md:text-6xl">Made just for you</h1>
        <p className="mt-6 max-w-prose">Tell me what you have in mind: a bag in your favourite colours, a bouquet that never wilts, a charm with your initial, a gift for someone special. Share a photo or a rough idea, and I&apos;ll come back with options, a price and a timeline. Once you say yes, I start hooking, and send you progress photos along the way. Every piece is made by hand in Mumbai and ships worldwide.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <InstagramButton />
        </div>
      </div>
      <div className="grid min-w-0 gap-8">
        <EnquiryForm />
        <BeadBuilder />
      </div>
    </div>
  );
}
