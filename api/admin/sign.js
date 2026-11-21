import { allow, clean, readJson, send } from "../_lib/http.js";
import { requireAdmin } from "../_lib/auth.js";
import { SLOTS, missingEnv, signUpload } from "../_lib/cloudinary.js";

/**
 * POST /api/admin/sign { title, client, category, slot }
 * The new video takes spot `slot`; if another video was there, it's bumped off the site
 * (the admin deletes it right after a successful upload).
 * Returns signed parameters so the admin's browser can upload the video straight to
 * Cloudinary (big files never pass through Vercel, which caps request bodies at 4.5 MB).
 */
export default async function handler(req, res) {
  if (!allow(req, res, ["POST"])) return;
  if (!requireAdmin(req, res)) return;

  const missing = missingEnv();
  if (missing.length) return send(res, 503, { error: `Cloudinary isn't configured. Missing: ${missing.join(", ")}` });

  let body = {};
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "Invalid request." });
  }

  const title = clean(body.title);
  if (!title) return send(res, 400, { error: "Give the reel a title." });
  const slot = Number(body.slot);
  if (!Number.isInteger(slot) || slot < 1 || slot > SLOTS) return send(res, 400, { error: `Choose a spot from 1 to ${SLOTS}.` });

  const signed = signUpload({
    title,
    client: clean(body.client, 60),
    category: clean(body.category, 40),
    slot: String(slot),
    order: Date.now(),
  });
  send(res, 200, signed, { "Cache-Control": "no-store" });
}
