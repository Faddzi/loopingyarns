import type { Metadata } from "next";
import { EnquiryForm } from "./EnquiryForm";
import { Placeholder } from "@/components/Placeholder";
import { InstagramButton, WhatsAppButton } from "@/components/ContactButtons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom orders",
  description: "Ask Looping Yarns for a custom crochet or beaded piece. Send reference photos, colours and your date.",
};

export default function Custom() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 md:grid-cols-[1fr_1.3fr] md:px-8">
      <div>
        <h1 className="text-5xl md:text-6xl"><Placeholder>Custom orders headline: client to supply</Placeholder></h1>
        <p className="mt-6 max-w-prose"><Placeholder>Intro: how custom orders work, client to supply</Placeholder></p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton message="Hi Looping Yarns, I'd like to ask about a custom piece." />
          <InstagramButton label={`Instagram @${site.instagramHandle}`} />
        </div>
        <p className="mt-6">
          {site.email ? <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a> : <Placeholder>Email to confirm</Placeholder>}
        </p>
      </div>
      <EnquiryForm />
    </div>
  );
}
