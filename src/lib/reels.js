import { useEffect, useState } from "react";
import { content } from "../data/content";

/** File paths for a bundled reel's three web files in public/videos/web/. */
export const reelSrc = (slug) => ({
  loop: `/videos/web/${slug}-loop.mp4`,
  full: `/videos/web/${slug}.mp4`,
  poster: `/videos/web/${slug}.webp`,
});

/** The website shows at most this many videos, each in a fixed spot (see the admin panel). */
export const MAX_REELS = 4;

export const FALLBACK_REELS = content.fallbackReels.map((r, i) => ({ id: r.slug, slot: i + 1, ...r, ...reelSrc(r.slug) }));

/**
 * The reel library. Starts with the bundled fallback reels, then swaps in the
 * admin-managed reels from /api/reels (Cloudinary) once they load. If the API isn't
 * there (local `npm run dev`) or has no reels yet, the fallback stays.
 */
export function useReels() {
  const [state, setState] = useState({ reels: FALLBACK_REELS, source: "fallback", loading: true });

  useEffect(() => {
    let alive = true;
    fetch("/api/reels", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : null))
      .then((data) => {
        if (!alive) return;
        if (data?.configured && data.reels?.length) setState({ reels: bySpot(data.reels), source: "cloudinary", loading: false });
        else setState((s) => ({ ...s, loading: false }));
      })
      .catch(() => alive && setState((s) => ({ ...s, loading: false })));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

/** Spot 1 first; spot 1 = the big left phone in the hero (see ORBIT in Hero.jsx). */
export const bySpot = (reels) =>
  reels
    .filter((r) => r.slot > 0)
    .sort((a, b) => a.slot - b.slot)
    .slice(0, MAX_REELS);

/** Accessible name for a reel button. */
export const reelLabel = (reel) => `Play ${reel.title}${reel.client ? ` for ${reel.client}` : ""} with sound`;
