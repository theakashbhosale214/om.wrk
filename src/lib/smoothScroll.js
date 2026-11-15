import Lenis from "lenis";

let lenis = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Starts Lenis smooth scrolling. Returns a cleanup function. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  let frame = requestAnimationFrame(function raf(time) {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  });

  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

/** Scrolls to "#id" (or the top for "#home"/"#"). Returns false if no target exists. */
export function scrollToHash(hash) {
  const isTop = hash === "#" || hash === "#home";
  const target = isTop ? null : document.querySelector(hash);
  if (!isTop && !target) return false;

  if (lenis) {
    lenis.scrollTo(isTop ? 0 : target, { duration: 1.5, force: true });
  } else if (isTop) {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  // Move keyboard focus with the scroll so screen-reader and tab users land in the section.
  if (target) target.focus({ preventScroll: true });
  return true;
}

/** Makes every in-page `<a href="#…">` use the smooth scroller. */
export function bindAnchorLinks() {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || a.hasAttribute("data-menu-link")) return;
    const hash = a.getAttribute("href");
    if (scrollToHash(hash)) {
      e.preventDefault();
      const url = hash === "#home" || hash === "#" ? location.pathname + location.search : hash;
      history.replaceState(null, "", url);
    }
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
