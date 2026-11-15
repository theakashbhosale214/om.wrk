import { useEffect, useRef } from "react";
import { animate, motion } from "motion/react";
import LogoMark from "./LogoMark";

/** First-visit curtain: mark + counter, then it lifts to reveal the hero. Plays once per session. */
export default function Intro({ onDone }) {
  const countRef = useRef(null);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 0.95,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      },
    });
    return () => controls.stop();
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-5 py-6 text-bone sm:px-8 md:px-12 md:py-8"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ delay: 1.05, duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onDone}
    >
      <div className="flex justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone/50">
        <span>Zoomify Media</span>
        <span>Content &amp; growth studio</span>
      </div>

      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <LogoMark className="h-20 w-auto text-bone md:h-24" />
        </motion.div>
        <div className="mt-6 overflow-hidden">
          <motion.p
            className="font-display text-[2rem] tracking-[-0.03em] md:text-[2.6rem]"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            Zoomify<em className="text-tomato">media</em>
          </motion.p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone/50">Focusing…</span>
        <span ref={countRef} className="font-display text-[3.5rem] leading-none tracking-[-0.04em] tabular-nums md:text-[5rem]">
          000
        </span>
      </div>
    </motion.div>
  );
}
