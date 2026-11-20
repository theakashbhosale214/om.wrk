import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "../lib/smoothScroll";
import { PlayerContext } from "../lib/player";

const EASE = [0.16, 1, 0.3, 1];

function Arrow({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={dir === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Player({ list, index, onClose, onStep }) {
  const closeRef = useRef(null);
  const videoRef = useRef(null);
  const reel = list[index];

  useEffect(() => {
    const returnTo = document.activeElement;
    const lenis = getLenis();
    if (lenis) lenis.stop();
    else document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lenis) lenis.start();
      else document.body.style.overflow = "";
      returnTo?.focus?.();
    };
  }, [onClose, onStep]);

  // Start with sound (the click allows it); fall back to muted if the browser refuses.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [index]);

  const many = list.length > 1;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${reel.client ? `${reel.client}: ` : ""}${reel.title}`}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-5 bg-black/92 px-4 py-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="eyebrow absolute right-4 top-4 rounded-full border border-white/15 px-4 py-2.5 text-chalk transition-colors hover:bg-chalk hover:text-black md:right-8 md:top-7"
      >
        Close ✕
      </button>

      <div className="flex items-center gap-4 md:gap-8" onClick={(e) => e.stopPropagation()}>
        {many && (
          <button onClick={() => onStep(-1)} aria-label="Previous reel" className="hidden h-12 w-12 place-items-center rounded-full border border-white/15 text-chalk transition-colors hover:bg-chalk hover:text-black md:grid">
            <Arrow dir="left" />
          </button>
        )}
        <motion.div
          key={reel.id}
          className="relative overflow-hidden rounded-[1.4rem] bg-coal shadow-[0_40px_140px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          style={{ width: "min(calc(100vw - 2rem), calc(min(80svh, 860px) * 9 / 16))", aspectRatio: "9 / 16" }}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <video ref={videoRef} src={reel.full} poster={reel.poster} controls playsInline preload="auto" className="h-full w-full object-cover" />
        </motion.div>
        {many && (
          <button onClick={() => onStep(1)} aria-label="Next reel" className="hidden h-12 w-12 place-items-center rounded-full border border-white/15 text-chalk transition-colors hover:bg-chalk hover:text-black md:grid">
            <Arrow dir="right" />
          </button>
        )}
      </div>

      <div className="flex w-full max-w-md items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        {many ? (
          <button onClick={() => onStep(-1)} aria-label="Previous reel" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 md:hidden">
            <Arrow dir="left" />
          </button>
        ) : (
          <span className="w-10 md:hidden" />
        )}
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-lg font-semibold tracking-[-0.01em]">{reel.title}</p>
          <p className="eyebrow mt-1 truncate text-smoke">
            {[reel.client, reel.category].filter(Boolean).join(" · ")}
            {many && ` · ${index + 1} / ${list.length}`}
          </p>
        </div>
        {many ? (
          <button onClick={() => onStep(1)} aria-label="Next reel" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 md:hidden">
            <Arrow dir="right" />
          </button>
        ) : (
          <span className="w-10 md:hidden" />
        )}
      </div>
    </motion.div>
  );
}

/** Provides `open(list, index)` to the page and renders the player above everything. */
export default function PlayerProvider({ children }) {
  const [state, setState] = useState(null); // { list, index }

  const open = useCallback((list, index = 0) => list?.length && setState({ list, index }), []);
  const close = useCallback(() => setState(null), []);
  const step = useCallback(
    (d) => setState((s) => (s ? { ...s, index: (s.index + d + s.list.length) % s.list.length } : s)),
    []
  );
  const value = useMemo(() => ({ open, isOpen: state !== null }), [open, state]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {createPortal(
        <AnimatePresence>{state && <Player key="player" list={state.list} index={state.index} onClose={close} onStep={step} />}</AnimatePresence>,
        document.body
      )}
    </PlayerContext.Provider>
  );
}
