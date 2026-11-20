/*
  Admin API client.
  - Session token lives in sessionStorage (cleared when the tab closes).
  - Uploads go straight from the browser to Cloudinary using parameters our server signs,
    in 20 MB chunks so big reels upload reliably and show real progress.
*/

const KEY = "zm-admin-session";

export class AuthError extends Error {}

export function getToken() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || "null");
    return s && s.expiresAt > Date.now() ? s.token : null;
  } catch {
    return null;
  }
}

function saveToken(session) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // storage blocked: the session just won't survive a reload
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = `Bearer ${getToken() || ""}`;

  let res;
  try {
    res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Can't reach the server. Check your connection.");
  }
  const isJson = res.headers.get("content-type")?.includes("json");
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!isJson) {
    throw new Error("The admin API isn't running here. Use the deployed site, or run `npx vercel dev` locally.");
  }
  if (res.status === 401 && auth) {
    clearToken();
    throw new AuthError(data.error || "Session expired. Please sign in again.");
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function login(password) {
  const session = await request("/api/admin/login", { method: "POST", body: { password }, auth: false });
  saveToken(session);
  return session.token;
}

export const listReels = () => request("/api/admin/reel");
export const updateReel = (reel) => request("/api/admin/reel", { method: "PATCH", body: reel });
export const deleteReel = (id) => request(`/api/admin/reel?id=${encodeURIComponent(id)}`, { method: "DELETE" });
export const signUpload = (meta) => request("/api/admin/sign", { method: "POST", body: meta });

const CHUNK = 20 * 1024 * 1024;

function postChunk(url, params, blob, filename, headers, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    for (const [k, v] of Object.entries(params)) form.append(k, v);
    form.append("file", blob, filename);

    xhr.open("POST", url);
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response
      }
      if (xhr.status >= 200 && xhr.status < 300 && !data.error) resolve(data);
      else reject(new Error(data.error?.message || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Upload failed: network error."));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(form);
  });
}

/** Uploads a video with signed params. onProgress(0..1). Pass an AbortSignal to cancel. */
export async function uploadVideo(file, signed, onProgress, signal) {
  const { uploadUrl, params } = signed;
  if (file.size <= CHUNK) {
    return postChunk(uploadUrl, params, file, file.name, {}, onProgress, signal);
  }
  const uploadId = (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9-]/g, "");
  let result = null;
  for (let start = 0; start < file.size; start += CHUNK) {
    const end = Math.min(start + CHUNK, file.size);
    result = await postChunk(
      uploadUrl,
      params,
      file.slice(start, end),
      file.name,
      { "X-Unique-Upload-Id": uploadId, "Content-Range": `bytes ${start}-${end - 1}/${file.size}` },
      (p) => onProgress((start + p * (end - start)) / file.size),
      signal
    );
  }
  return result;
}

export const formatBytes = (n) =>
  n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(1)} GB` : n >= 1024 ** 2 ? `${(n / 1024 ** 2).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
