import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { FaPlay } from "react-icons/fa";
import { usePlayer } from "../lib/player";
import { useMediaQuery } from "../lib/useMediaQuery";

/**
 * A 9:16 reel tile: poster first, then a muted loop.
 *   mode="inview" — loop plays whenever the card is on screen (hero wall)
 *   mode="hover"  — loop plays on hover with a mouse; on touch screens, while on screen
 * The <video> is only mounted when it should play, so off-screen cards cost nothing.
 * Nothing plays for reduced-motion visitors or while the full player is open.
 */
export default function ReelCard({ reel, onOpen, mode = "inview", meta = "overlay", tabIndex, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const { isOpen } = usePlayer();
  const mouse = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const play = !reduce && !isOpen && visible && (mode === "inview" || !mouse || hover);
  const label = `Play ${reel.title}${reel.client ? ` for ${reel.client}` : ""}`;

  return (
    <div className={className}>
      <button
        ref={ref}
        type="button"
        tabIndex={tabIndex}
        onClick={onOpen}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setReady(false);
        }}
        aria-label={label}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.1rem] bg-graphite text-left ring-1 ring-white/8 transition-shadow duration-500 hover:ring-white/25"
      >
        <img
          src={reel.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.04]"
        />
        {play && (
          <video
            src={reel.loop}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-expo group-hover:scale-[1.04] ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_25%,transparent_55%,rgba(0,0,0,0.85)_100%)]" />

        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full bg-chalk text-black opacity-0 shadow-xl transition-all duration-500 ease-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
        >
          <FaPlay className="ml-0.5 h-4 w-4" />
        </span>

        {meta === "overlay" && (
          <span aria-hidden="true" className="absolute inset-x-3 bottom-3 block md:inset-x-4 md:bottom-4">
            {reel.category && <span className="eyebrow block !text-[9.5px] text-chalk/70">{reel.category}</span>}
            <span className="mt-1 block text-[14px] font-semibold leading-tight text-chalk md:text-[15px]">{reel.client || reel.title}</span>
          </span>
        )}
      </button>

      {meta === "below" && (
        <div className="mt-3 px-0.5">
          <p className="truncate text-[15px] font-semibold leading-tight">{reel.title}</p>
          <p className="eyebrow mt-1 truncate !text-[10px] text-smoke">{[reel.client, reel.category].filter(Boolean).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
