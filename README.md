# om.wrk — website + reel admin

React 19 + Vite + Tailwind CSS v4, animated with [Motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering).
Reels are managed from an admin panel at **`/admin`**, stored and compressed by **Cloudinary**, and served through two small **Vercel** functions.

## Run it

```bash
npm install
npm run dev        # the website (uses the 3 bundled reels; /api isn't available here)
npx vercel dev     # website + /api + /admin, using the variables in .env.local
npm run build
npm run lint
```

Vite 8 needs **Node 20.19+ or 22.12+**.

## One-time setup (≈10 minutes)

1. **Cloudinary.** Create a free account at [cloudinary.com](https://cloudinary.com/users/register_free). From the dashboard, copy the **Cloud name**, **API key** and **API secret**.
2. **Vercel.** Import this GitHub repo in Vercel (framework preset: Vite). In *Project → Settings → Environment Variables*, add:

   | Variable | Value |
   | --- | --- |
   | `ADMIN_PASSWORD` | a long password for the admin panel |
   | `CLOUDINARY_CLOUD_NAME` | from Cloudinary |
   | `CLOUDINARY_API_KEY` | from Cloudinary |
   | `CLOUDINARY_API_SECRET` | from Cloudinary (never put this in client code) |
   | `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | for the contact form (optional; see below) |

3. **Redeploy**, open `https://<your-site>/admin`, sign in, upload your first reel.

`.env.example` lists the same variables for local development (copy to `.env.local`).

## Using the admin (`/admin`)

The website shows **4 videos**, each in a fixed **spot** on the homepage. The admin shows a small map of the homepage with the four numbered phones, next to one card per spot.

| Spot | Where it plays |
| --- | --- |
| 1 · Main video | big phone left of the headline; also plays first on "Watch the reels" |
| 2 | big phone right of the headline |
| 3 | small phone, bottom right |
| 4 | small phone, bottom left |

On phones, the four take turns in a fan of three. The Work section lists the same four, in spot order.

- **Add:** drop a video (MP4/MOV, vertical) on an empty spot, give it a title (client optional), upload. It goes straight from your browser to Cloudinary, which creates the 10-second muted loop, the 720p version and the poster automatically.
- **Replace video** uploads a new one into the same spot, then deletes the old one.
- **Move to…** swaps two spots. **Remove** deletes the video. Titles and clients edit in place.
- Videos uploaded before spots existed fill the empty spots automatically; any left over are listed under "Not on the website", where you can put one in a spot or delete it.
- The website picks up changes within about a minute (the public list is cached at the edge).
- **Size limit:** Cloudinary's free plan accepts videos up to **100 MB**. Compress bigger masters first (e.g. HandBrake, "Fast 1080p30") or upgrade the plan.

Until Cloudinary is connected and has at least one reel, the site shows the three bundled reels in `public/videos/web/`.

## How it fits together

```
Browser ──GET /api/reels──────────────▶ Vercel fn ──Admin API──▶ Cloudinary (list by tag)
Admin   ──POST /api/admin/login───────▶ Vercel fn  (checks ADMIN_PASSWORD, returns a 12h signed token)
Admin   ──POST /api/admin/sign────────▶ Vercel fn  (signs upload params)
Admin   ──upload file (chunked)───────────────────────────────▶ Cloudinary (eager loop + 720p)
Admin   ──PATCH/DELETE /api/admin/reel▶ Vercel fn ──signed Upload API──▶ Cloudinary
```

- Reel details (title, client, category, slot, order) live in each video's Cloudinary **context** metadata. No database needed. `slot` is the homepage spot (1–4, 0 = not on the site); if two videos claim one spot the newest wins.
- The API secret and admin password only ever live in Vercel's environment variables.
- `vercel.json` routes `/admin` to the app and marks it `noindex`.

## Contact form (EmailJS)

The contact form is a fill-in-the-blanks sentence ("Hi om.wrk, I'm ___ from ___…"). Set the three `VITE_EMAILJS_*` variables and it sends `name`, `email`, `phone`, `company`, `service` (comma-separated), `budget`, `timeline` and `message` (the message also repeats the budget and start date, so a template that only prints `{{message}}` still gets everything). **Without EmailJS configured, or if a send fails, the form hands the enquiry to WhatsApp instead, already typed out**, so leads are never lost. Budget and start-date choices live in `content.contact` in `src/data/content.js`.

## Editing the site

| What | Where |
| --- | --- |
| Copy: hero, services, process, studio, FAQ, contact details, client logos | `src/data/content.js` |
| Colours, fonts | the `@theme` block at the top of `src/index.css` |
| Fallback reels (before Cloudinary) | `public/videos/web/` + `content.fallbackReels` |

## Structure

```
api/                      Vercel functions (Node)
  reels.js                public reel list (edge-cached)
  admin/login.js · sign.js · reel.js
  _lib/                   auth (signed tokens), Cloudinary client, http helpers
src/
  Root.jsx                routes /admin → admin panel (lazy-loaded), everything else → site
  App.jsx                 the website
  admin/                  Admin.jsx, SlotCard.jsx (upload/replace/move per spot), SitePreview.jsx, slots.js, api.js
  components/             Hero, Clients, Work, Services, Process, Studio, Faq, Contact, Footer,
                          Navbar, ReelCard, ReelPlayer (shared full-screen player), …
  lib/                    reels (useReels), player context, smooth scroll, helpers
  data/content.js
```

Keep original video masters out of git: GitHub rejects files over 100 MB, so `public/videos/*.mp4` is ignored. Better still, keep masters outside `public/` (Vite copies everything in `public/` into the build).
