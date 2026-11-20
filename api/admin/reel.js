import { allow, clean, query, readJson, send } from "../_lib/http.js";
import { requireAdmin } from "../_lib/auth.js";
import { deleteReel, listReels, missingEnv, updateReel } from "../_lib/cloudinary.js";

/**
 * Admin reel management (all require a valid admin token):
 *   GET    /api/admin/reel            → fresh list (no cache)
 *   PATCH  /api/admin/reel  { id, title, client, category, featured, order }
 *   DELETE /api/admin/reel?id=<public id>
 */
export default async function handler(req, res) {
  if (!allow(req, res, ["GET", "PATCH", "DELETE"])) return;
  if (!requireAdmin(req, res)) return;

  const missing = missingEnv();
  if (missing.length) return send(res, 200, { configured: false, missing, reels: [] }, { "Cache-Control": "no-store" });

  try {
    if (req.method === "GET") {
      return send(res, 200, { configured: true, reels: await listReels() }, { "Cache-Control": "no-store" });
    }

    if (req.method === "PATCH") {
      const body = await readJson(req);
      const id = clean(body.id, 300);
      const title = clean(body.title);
      if (!id) return send(res, 400, { error: "Missing reel id." });
      if (!title) return send(res, 400, { error: "Title can't be empty." });
      await updateReel(id, {
        title,
        client: clean(body.client, 60),
        category: clean(body.category, 40),
        featured: body.featured ? "true" : "false",
        order: Number(body.order) || Date.now(),
      });
      return send(res, 200, { ok: true });
    }

    // DELETE
    const id = clean(query(req).id, 300);
    if (!id) return send(res, 400, { error: "Missing reel id." });
    await deleteReel(id);
    return send(res, 200, { ok: true });
  } catch (err) {
    return send(res, 502, { error: err.message });
  }
}
