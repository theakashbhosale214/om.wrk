import { useEffect, useState } from "react";
import { content } from "../data/content";

/** File paths for a bundled reel's three web files in public/videos/web/. */
export const reelSrc = (slug) => ({
  loop: `/videos/web/${slug}-loop.mp4`,
  full: `/videos/web/${slug}.mp4`,
  poster: `/videos/web/${slug}.webp`,
});

export const FALLBACK_REELS = content.fallbackReels.map((r) => ({ id: r.slug, ...r, ...reelSrc(r.slug) }));

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
        if (data?.configured && data.reels?.length) setState({ reels: data.reels, source: "cloudinary", loading: false });
        else setState((s) => ({ ...s, loading: false }));
      })
      .catch(() => alive && setState((s) => ({ ...s, loading: false })));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

/**
 * Reels for the hero wall: the ones flagged "show in hero" first. If fewer than five
 * are flagged, the rest are added after them so the wall never just repeats two clips.
 */
export const featuredReels = (reels, min = 5) => {
  const featured = reels.filter((r) => r.featured);
  if (featured.length >= min) return featured;
  return [...featured, ...reels.filter((r) => !r.featured)];
};

/** Accessible name for a reel button. */
export const reelLabel = (reel) => `Play ${reel.title}${reel.client ? ` for ${reel.client}` : ""} with sound`;
