import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "../lib/smoothScroll";
import { reelSrc } from "../lib/reels";

const EASE = [0.16, 1, 0.3, 1];

function Arrow({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full-screen player for a hero reel, with sound. `index` null = closed. */
export default function ReelModal({ reels, index, onClose, onChange }) {
  const open = index !== null;
  const closeRef = useRef(null);
  const videoRef = useRef(null);
  const returnFocus = useRef(null);

  // lock scroll, keyboard controls, focus in/out
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    const lenis = getLenis();
    if (lenis) lenis.stop();
    else document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange(1);
      if (e.key === "ArrowLeft") onChange(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lenis) lenis.start();
      else document.body.style.overflow = "";
      returnFocus.current?.focus?.();
    };
  }, [open, onClose, onChange]);

  // start with sound; if the browser refuses, fall back to muted (controls stay available)
  useEffect(() => {
    const v = videoRef.current;
    if (!open || !v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [open, index]);

  const reel = open ? reels[index] : null;
  const src = reel ? reelSrc(reel.slug) : null;

  // Portal to <body> so the player sits above the navbar, outside the hero's stacking context.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="reel-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${reel.client}: ${reel.title}`}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-5 bg-ink/90 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-bone/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-bone hover:text-ink md:right-8 md:top-7"
          >
            Close
          </button>

          <div className="flex items-center gap-4 md:gap-8" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onChange(-1)}
              aria-label="Previous reel"
              className="hidden h-12 w-12 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink md:grid"
            >
              <Arrow dir="left" />
            </button>

            <motion.div
              key={reel.slug}
              className="relative overflow-hidden rounded-[1.4rem] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-bone/10"
              style={{ width: "min(calc(100vw - 2rem), calc(min(82svh, 860px) * 9 / 16))", aspectRatio: "9 / 16" }}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <video
                ref={videoRef}
                src={src.full}
                poster={src.poster}
                controls
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <button
              onClick={() => onChange(1)}
              aria-label="Next reel"
              className="hidden h-12 w-12 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink md:grid"
            >
              <Arrow dir="right" />
            </button>
          </div>

          <div
            className="flex w-full max-w-md items-center justify-between gap-4 text-bone"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onChange(-1)}
              aria-label="Previous reel"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-bone/20 md:hidden"
            >
              <Arrow dir="left" />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate font-display text-xl tracking-[-0.02em]">
                {reel.client} <em className="text-tomato">·</em> {reel.title}
              </p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone/55">
                {reel.tag} · {index + 1} / {reels.length}
              </p>
            </div>
            <button
              onClick={() => onChange(1)}
              aria-label="Next reel"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-bone/20 md:hidden"
            >
              <Arrow dir="right" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
