import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { send } from "./http.js";

/*
  Admin auth: one shared password (ADMIN_PASSWORD env var).
  Logging in returns a signed, expiring token, so the password itself is never
  stored in the browser. Changing ADMIN_PASSWORD signs everyone out.
*/

const TOKEN_HOURS = 12;

const secret = () => `${process.env.ADMIN_PASSWORD || ""}::${process.env.CLOUDINARY_API_SECRET || ""}::zoomify-admin`;
const hmac = (data) => createHmac("sha256", secret()).update(data).digest("base64url");

/** Constant-time string comparison (hashes first so lengths always match). */
export function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(password, expected);
}

export function makeToken(now = Date.now()) {
  const expiresAt = now + TOKEN_HOURS * 3600 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString("base64url");
  return { token: `${payload}.${hmac(payload)}`, expiresAt };
}

export function verifyToken(token, now = Date.now()) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig || !safeEqual(sig, hmac(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

/** Returns true if the request carries a valid admin token; otherwise sends 401 and returns false. */
export function requireAdmin(req, res) {
  const header = req.headers?.authorization || req.headers?.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (verifyToken(token)) return true;
  send(res, 401, { error: "Not signed in, or your session has expired." });
  return false;
}
