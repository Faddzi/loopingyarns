# Looping Yarns website

Next.js (App Router), React, TypeScript and Tailwind CSS. 3D with React Three Fiber, drei and Rapier.

```bash
npm install
cp .env.example .env.local   # fill in what the client has confirmed
npm run dev
```

## Reviewing the three visual concepts

Add `?look=candy`, `?look=studio` or `?look=night` to any URL, or use the switcher in the bottom-left corner.
The switcher is for client review only. Remove `LookSwitcher` once a concept is chosen, and drop the fonts of the other two from `src/app/fonts.ts`.

| Concept | Palette | Type |
| --- | --- | --- |
| Candy pop | Saturated yarn colours, claret accent from the logo | Bagel Fat One, Figtree |
| Soft studio | Off-white with pastel accents, muted claret | Gloock, Hanken Grotesk |
| Night bead | Deep plum background, butter-yellow accent | Bricolage Grotesque, Schibsted Grotesk |

## Content

Pieces live in `src/content/pieces.json`. To add a piece, add an object there and put its photos and reel in `public/media/<slug>/`.
The first image is the cover; the second is shown on hover. Leave `price`, `colours` and `description` as `null` or empty unless the client supplies them; the product page hides anything missing.

Names currently come from Instagram captions and still need client approval. No photos or reels are in the repo yet: every media slot shows a visible placeholder until the client's original export arrives.

## Placeholders still in the build

Each shows on the page as `[dashed text in brackets]`.

- Hero line (Home)
- Founder name, photo and story (Home teaser, About)
- Process clips or photos (About)
- Custom Orders headline and intro
- WhatsApp number and email (`.env.local`)
- Reply time in the form success message and location in the footer (`src/lib/site.ts`)
- All product photos and reels, including beadwork
- Logo, favicon and social preview image
- Brand colours (claret and cream from the logo are proposed, not confirmed)

Functional pre-filled WhatsApp messages (for example "Hi Looping Yarns, I'd like to order the Heart Bag.") are in `src/lib/site.ts` and should be approved with the rest of the copy.

## Still to build (milestone 3 onwards)

- The scroll-linked sequence in the hero: strand unravels, threads beads, stitches the name, resolves into a product photo or reel (GSAP ScrollTrigger + Lenis)
- Fuzzy fibre material for the yarn (shell texturing) and per-concept lighting
- Bead builder on the Custom page (beadwork is confirmed)
- Yarn cursor (desktop only)
- The About page 3D moment
- Unravelling animation on the 404 page
- Image pipeline: AVIF/WebP with blur placeholders, reels under 2 MB with posters
