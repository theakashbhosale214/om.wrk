import { createHash } from "node:crypto";

/*
  Minimal Cloudinary client (no SDK): signed Upload API calls + Admin API listing.

  Reels are stored as video assets tagged CLOUDINARY_TAG, with their details kept in
  the asset's "context" metadata: title, client, category, slot, order.
  The website shows exactly SLOTS videos; `slot` (1–4) says which spot on the homepage
  a video fills. slot 0 = uploaded but not on the site.
  Cloudinary does all the video work: on upload it pre-generates (eager) the short
  muted loop and the 720p version, and posters are cut on the fly.
*/

export const config = () => ({
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
  folder: process.env.CLOUDINARY_FOLDER || "zoomify/reels",
  tag: process.env.CLOUDINARY_TAG || "zoomify-reel",
});

/** How many videos the website shows. Each one has a fixed spot (1…SLOTS). */
export const SLOTS = 4;

const REQUIRED = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
export const missingEnv = (extra = []) => [...REQUIRED, ...extra].filter((k) => !process.env[k]);

// Derived versions. These strings must match exactly between `eager` (on upload) and the
// delivery URLs, so the pre-generated files are served instead of being re-processed.
export const LOOP_T = "so_0,eo_10,ac_none,w_540,c_limit,q_auto:eco,vc_h264";
export const FULL_T = "w_720,c_limit,q_auto,vc_h264";
export const POSTER_T = "so_1,w_540,c_limit,q_auto";
export const EAGER = `${LOOP_T}/mp4|${FULL_T}/mp4`;

export function reelUrls(cloud, publicId, version) {
  const base = `https://res.cloudinary.com/${cloud}/video/upload`;
  const v = version ? `v${version}/` : "";
  return {
    loop: `${base}/${LOOP_T}/${v}${publicId}.mp4`,
    full: `${base}/${FULL_T}/${v}${publicId}.mp4`,
    poster: `${base}/${POSTER_T}/${v}${publicId}.jpg`,
  };
}

/** Cloudinary request signature: sorted `k=v` pairs joined by &, plus the API secret, SHA-1. */
export function sign(params, secret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort()
    .map((k) => `${k}=${Array.isArray(params[k]) ? params[k].join(",") : params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + secret).digest("hex");
}

/** Context metadata string: key=value pairs joined by |, with | = \ escaped in values. */
export function contextString(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${String(v).replace(/([|=\\])/g, "\\$1")}`)
    .join("|");
}

export function toReel(resource, cloud) {
  const c = resource.context?.custom || {};
  const created = Date.parse(resource.created_at) || 0;
  return {
    id: resource.public_id,
    title: c.title || "Untitled reel",
    client: c.client || "",
    category: c.category || "",
    featured: c.featured === "true",
    // null = uploaded before spots existed (placed automatically), 0 = not on the site
    slot: c.slot === undefined ? null : Number(c.slot) || 0,
    order: Number(c.order) || created,
    createdAt: resource.created_at,
    bytes: resource.bytes,
    ...reelUrls(cloud, resource.public_id, resource.version),
  };
}

/** Newest-first by `order` (new uploads get Date.now()). */
export const byOrder = (a, b) => b.order - a.order;

/**
 * Resolves which video fills which spot. Returns every reel with a final `slot`:
 * 1…SLOTS for the ones on the website (sorted by spot), then 0 for the rest.
 * - If two videos claim the same spot, the newest wins (that's how "replace" works:
 *   the new upload takes the spot, then the old one is deleted).
 * - Videos from before spots existed fill any empty spots, hero picks first.
 */
export function arrange(reels) {
  const taken = new Map();
  const rest = [];
  for (const r of [...reels].sort(byOrder)) {
    if (r.slot >= 1 && r.slot <= SLOTS && !taken.has(r.slot)) taken.set(r.slot, r);
    else rest.push(r);
  }
  const legacy = rest.filter((r) => r.slot === null).sort((a, b) => b.featured - a.featured || byOrder(a, b));
  for (let s = 1; s <= SLOTS && legacy.length; s++) if (!taken.has(s)) taken.set(s, legacy.shift());
  const placed = [...taken].sort(([a], [b]) => a - b).map(([slot, r]) => ({ ...r, slot }));
  const placedIds = new Set(placed.map((r) => r.id));
  return [...placed, ...rest.filter((r) => !placedIds.has(r.id)).map((r) => ({ ...r, slot: 0 }))];
}

export async function listReels() {
  const { cloud, key, secret, tag } = config();
  const url = `https://api.cloudinary.com/v1_1/${cloud}/resources/video/tags/${encodeURIComponent(tag)}?context=true&max_results=100`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
  });
  if (res.status === 404) return []; // tag not used yet
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error?.message || `Cloudinary list failed (${res.status})`);
  return arrange((data.resources || []).map((r) => toReel(r, cloud)));
}

async function uploadApi(action, params) {
  const { cloud, key, secret } = config();
  const signed = { ...params, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(signed)) if (v !== undefined && v !== "") body.append(k, String(v));
  body.append("api_key", key);
  body.append("signature", sign(signed, secret));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/video/${action}`, { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error?.message || `Cloudinary ${action} failed (${res.status})`);
  return data;
}

/** Replaces a reel's context metadata. */
export const updateReel = (publicId, ctx) =>
  uploadApi("explicit", { public_id: publicId, type: "upload", context: contextString(ctx) });

export const deleteReel = (publicId) => uploadApi("destroy", { public_id: publicId, invalidate: "true" });

/** Signed parameters for a browser-direct upload (the file never passes through our server). */
export function signUpload(ctx) {
  const { cloud, key, secret, folder, tag } = config();
  const params = {
    timestamp: Math.floor(Date.now() / 1000),
    folder,
    tags: tag,
    context: contextString(ctx),
    eager: EAGER,
    eager_async: "true",
  };
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloud}/video/upload`,
    cloudName: cloud,
    params: { ...params, api_key: key, signature: sign(params, secret) },
  };
}
