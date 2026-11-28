# Looping Yarns website

Next.js (App Router), React, TypeScript and Tailwind CSS. 3D with React Three Fiber, drei and Rapier.

```bash
npm install
cp .env.example .env.local   # fill in what the client has confirmed
npm run dev
```

## Preview on GitHub Pages

Every push to `main` builds a static copy and deploys it to https://faddzi.github.io/loopingyarns/ (`.github/workflows/pages.yml`).
In the repo settings, Pages must use **GitHub Actions** as its source.
Pages can't run server code, so the custom order form there always shows its Instagram DM fallback. For launch, host on Vercel or another Node host so the form can send email.

## Visual direction

Candy pop: saturated yarn colours with a claret accent from the logo, set in Bagel Fat One (display) and Figtree (body). Tokens are in `src/app/globals.css`.

## Content

Pieces live in `src/content/pieces.json`. To add a piece, add an object there and put its photos and reel in `public/media/<slug>/`.
The first image is the cover; the second is shown on hover. Leave `price`, `colours` and `description` as `null` or empty unless the client supplies them; the product page hides anything missing.

Names currently come from Instagram captions and still need client approval. No photos or reels are in the repo yet: every media slot shows a visible placeholder until the client's original export arrives.

## Placeholders still in the build

Draft copy (hero line, About, process, Custom orders intro, reply time "within 2 days") was invented on request and needs client approval. Email was dropped.

Photos, reels and the logo come from the client's Instagram export (Drive, 2026-11-28), compressed into `public/media` (reels 540px H.264, no audio). Piece names for new pieces were taken from the post graphics.

Each remaining placeholder shows on the page as `[dashed text in brackets]`.

- Beadwork photos (none in the Instagram export yet)
- Prices, colours and descriptions per piece
- Brand colours (claret and cream from the logo are proposed, not confirmed)

All ordering goes through Instagram DMs (ig.me/m/looping.yarns). WhatsApp and email were dropped on request.

## How the hero works

`src/components/hero/`. The section is pinned for about 1.6 screens of scroll, and GSAP ScrollTrigger feeds `heroProgress` (0 to 1) to the scene:
the strand unravels and loops around the ball, beads thread onto it, it closes into the round badge from the logo, and the first featured piece appears inside it.
Timings are in `progress.ts`. The drawn ball (`YarnPoster`) shows first; the WebGL scene loads on the first scroll, touch, key or mouse move, which keeps Lighthouse mobile at 97.
With reduced motion, low memory, Save-Data or no WebGL the hero stays static and unpinned.

## QA status

- Build, type check and lint pass.
- No horizontal overflow on any page at 375, 768, 1280 and 1536 px.
- Lighthouse mobile (local build, placeholders in place of photos): Home 97 / 100 / 100 / 100, Collection 98 / 100 / 100 / 100 (performance / accessibility / best practices / SEO). Re-run once real photos and reels are in.
- Form: inline errors, honeypot, Instagram DM fallback when sending fails. The success state needs a Resend key to test end to end.

## Before launch

- Client content for every placeholder above.
- Export photos as AVIF/WebP-ready originals into `public/media/<slug>/` (next/image converts them). Compress reels to H.264 MP4 under 2 MB with a poster image.
- Add `offers` with price and currency to the Product structured data if prices are shown.
- Set the environment variables from `.env.example` on the host, and a real `NEXT_PUBLIC_SITE_URL`.
