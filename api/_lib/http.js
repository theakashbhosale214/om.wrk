// Small helpers for Vercel Node functions. Files under api/_lib are not deployed as routes.

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

/** Parsed JSON body. Vercel pre-parses JSON into req.body; fall back to reading the stream. */
export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return req.body ? JSON.parse(req.body) : {};
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export function query(req) {
  if (req.query) return req.query;
  return Object.fromEntries(new URL(req.url, "http://local").searchParams);
}

export function allow(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  send(res, 405, { error: `Method ${req.method} not allowed` });
  return false;
}

/** Trimmed string, capped at `max` characters. */
export const clean = (value, max = 80) => String(value ?? "").trim().slice(0, max);
