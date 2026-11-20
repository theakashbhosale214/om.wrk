/** File paths for a reel's three web files in public/videos/web/. */
export const reelSrc = (slug) => ({
  loop: `/videos/web/${slug}-loop.mp4`,
  full: `/videos/web/${slug}.mp4`,
  poster: `/videos/web/${slug}.webp`,
});
