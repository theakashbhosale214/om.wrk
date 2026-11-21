import { allow, send } from "./_lib/http.js";
import { listReels, missingEnv } from "./_lib/cloudinary.js";

/**
 * GET /api/reels — the public reel list the website reads.
 * Cached at Vercel's edge for a minute, so visitors never hit Cloudinary's rate limits.
 * If Cloudinary isn't configured yet, returns { configured: false } and the site
 * falls back to the reels bundled in public/videos/web.
 */
export default async function handler(req, res) {
  if (!allow(req, res, ["GET"])) return;

  if (missingEnv().length) {
    return send(res, 200, { configured: false, reels: [] }, { "Cache-Control": "public, s-maxage=60" });
  }

  try {
    // only the videos that have a spot on the homepage, in spot order
    const reels = (await listReels()).filter((r) => r.slot > 0).map(({ id, title, client, category, slot, loop, full, poster }) => ({
      id,
      title,
      client,
      category,
      slot,
      loop,
      full,
      poster,
    }));
    send(res, 200, { configured: true, reels }, { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" });
  } catch (err) {
    send(res, 502, { error: err.message });
  }
}
