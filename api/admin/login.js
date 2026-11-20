import { allow, readJson, send } from "../_lib/http.js";
import { checkPassword, makeToken } from "../_lib/auth.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** POST /api/admin/login { password } → { token, expiresAt } */
export default async function handler(req, res) {
  if (!allow(req, res, ["POST"])) return;

  if (!process.env.ADMIN_PASSWORD) {
    return send(res, 503, { error: "Admin isn't set up yet: add ADMIN_PASSWORD to the site's environment variables." });
  }

  let body = {};
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "Invalid request." });
  }

  if (!checkPassword(body.password || "")) {
    await wait(700); // slow down password guessing
    return send(res, 401, { error: "Wrong password." });
  }

  send(res, 200, makeToken(), { "Cache-Control": "no-store" });
}
