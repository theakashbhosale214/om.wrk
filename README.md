# Zoomify Media — website

React 19 + Vite + Tailwind CSS v4, animated with [Motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering) smooth scrolling.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run lint
```

Vite 8 needs **Node 20.19+ or 22.12+**.

## Editing the site

| What | Where |
| --- | --- |
| All copy (headlines, services, client list, stats, contact details) | `src/data/content.js` |
| Colours, fonts, easing | the `@theme` block at the top of `src/index.css` |
| Client logos | `src/assets/clients/` (trimmed WebP files), listed in `content.js` |

In `content.js`, wrapping words in `*asterisks*` sets them in the italic serif accent, for example `"content that *converts.*"`.

### Palette

| Token | Hex | Used for |
| --- | --- | --- |
| `bone` | `#f3f0e7` | page background |
| `ink` | `#141a16` | text, buttons |
| `forest` | `#17211b` | dark sections, footer |
| `sage` / `sage-soft` | `#a9b8a0` / `#d8dfd0` | accents, the Work section |
| `tomato` | `#e8472c` | the signal colour: lens, highlights, CTAs |

Fonts: **Fraunces** (display serif), **Geist** (body) and **Geist Mono** (labels), from Google Fonts.

## Contact form (EmailJS)

Create `.env.local` in the project root:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The form sends the fields `name`, `email`, `phone`, `company`, `service` and `message`. Clicking a service row in the Services section pre-selects that service in the form.

## Hero reels (videos)

The hero shows real reels as floating phone cards. Each reel needs three files in `public/videos/web/`, and an entry in `content.reels` (`src/data/content.js`):

| File | What it is | Typical size |
| --- | --- | --- |
| `<slug>-loop.mp4` | 12-second muted loop shown on the card | ~0.5 MB |
| `<slug>.mp4` | full reel, 720p with sound, for the player | ~5 MB |
| `<slug>.webp` | poster frame (shown instantly, and to reduced-motion visitors) | ~20 KB |

Make them from a master with [ffmpeg](https://ffmpeg.org) (change `-ss` to pick where the loop starts):

```bash
ffmpeg -ss 0 -t 12 -i master.mp4 -an -vf "scale=540:-2,fps=24,format=yuv420p" -c:v libx264 -preset slow -crf 30 -movflags +faststart <slug>-loop.mp4
ffmpeg -i master.mp4 -vf "scale=720:-2,fps=25,format=yuv420p" -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 96k -movflags +faststart <slug>.mp4
ffmpeg -ss 0.4 -i master.mp4 -frames:v 1 -vf "scale=540:-2" -c:v libwebp -quality 72 <slug>.webp
```

Keep the original masters out of git: they're far over GitHub's 100 MB file limit. `public/videos/*.mp4` is ignored for that reason. Better still, keep masters outside `public/` entirely, because Vite copies everything in `public/` into the build.

## Structure

```
src/
  components/
    Hero.jsx          reels hero: headline + floating video cards (see the comment at the top)
    ReelModal.jsx     full-screen reel player with sound, prev/next, keyboard controls
    Clients.jsx       slim "trusted by" logo band
    Navbar.jsx        floating nav + full-screen mobile menu
    About.jsx         scroll-inked statement + stats
    Services.jsx      editorial service list
    Approach.jsx      why-us list + four-step process
    CallToAction.jsx  tomato CTA with a magnetic button
    Contact.jsx       contact details + EmailJS form
    Footer.jsx
    Intro.jsx         first-visit curtain (once per session)
    Motion.jsx        shared animation helpers (Reveal, SplitText, ScrollWords, Magnetic)
  lib/                smooth scroll, shared clock, text helpers
  data/content.js
```

Every animation respects the visitor's **reduced motion** setting.
