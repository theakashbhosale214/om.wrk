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

## Structure

```
src/
  components/
    Hero.jsx          zoom-lens hero (two stacked layers; see the comment at the top)
    Navbar.jsx        floating nav + full-screen mobile menu
    Marquee.jsx       scrolling services band
    About.jsx         scroll-inked statement + stats
    Services.jsx      editorial service list
    Work.jsx          client logo wall
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
