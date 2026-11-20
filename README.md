# Zoomify Media — website + reel admin

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

- **Upload:** drag in a video (MP4/MOV, vertical works best), add a title, client and category, choose whether it plays in the homepage hero. The file uploads straight from your browser to Cloudinary, which creates the 10-second muted loop, the 720p version and the poster automatically.
- **Edit** titles, clients and categories inline, **toggle "In hero"**, **reorder** with the arrows (top shows first) and **delete**.
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

- Reel details (title, client, category, featured, order) live in each video's Cloudinary **context** metadata. No database needed.
- The API secret and admin password only ever live in Vercel's environment variables.
- `vercel.json` routes `/admin` to the app and marks it `noindex`.

## Contact form (EmailJS)

Set the three `VITE_EMAILJS_*` variables. The form sends `name`, `email`, `phone`, `company`, `service` (comma-separated) and `message`. **Without EmailJS configured, or if a send fails, the form hands the message to WhatsApp instead**, so enquiries are never lost.

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
  admin/                  Admin.jsx, Uploader.jsx, ReelItem.jsx, api.js
  components/             Hero, Clients, Work, Services, Process, Studio, Faq, Contact, Footer,
                          Navbar, ReelCard, ReelPlayer (shared full-screen player), …
  lib/                    reels (useReels), player context, smooth scroll, helpers
  data/content.js
```

Keep original video masters out of git: GitHub rejects files over 100 MB, so `public/videos/*.mp4` is ignored. Better still, keep masters outside `public/` (Vite copies everything in `public/` into the build).
