import { motion, useReducedMotion, useTransform } from "motion/react";
import { useRef } from "react";
import { useScrollProgress } from "../lib/useScrollProgress";

const WORDS = ["Reels", "Ad films", "Shoots", "Social media", "Meta Ads", "Google Ads", "Branding"];

function Row({ progress, from, to, outline }) {
  const x = useTransform(progress, [0, 1], [from, to]);
  const items = [...WORDS, ...WORDS];
  return (
    <motion.div style={{ x }} className="flex w-max items-center gap-8 whitespace-nowrap md:gap-12">
      {items.map((w, i) => (
        <span key={i} className="flex items-center gap-8 md:gap-12">
          <span
            className={`title-xl text-[clamp(3.5rem,9vw,9rem)] ${outline && i % 2 === 0 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(242,240,235,0.35)]" : "text-chalk"}`}
          >
            {w}
          </span>
          <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-ember md:h-12 md:w-12" aria-hidden="true">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </motion.div>
  );
}

/** Two big rows of what we do, sliding in opposite directions as you scroll. */
export default function Ticker() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const progress = useScrollProgress({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden border-y border-white/8 bg-black py-10 md:py-14">
      <div className="flex flex-col gap-3 md:gap-5">
        <Row progress={progress} from="0%" to={reduce ? "0%" : "-30%"} />
        <Row progress={progress} from="-30%" to={reduce ? "-30%" : "0%"} outline />
      </div>
    </div>
  );
}
