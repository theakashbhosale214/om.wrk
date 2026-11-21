import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { usePlayer } from "../lib/player";
import { useMediaQuery } from "../lib/useMediaQuery";
import { reelLabel } from "../lib/reels";
import { InstaUI, Phone, PlayHint, ReelMedia } from "./ReelScreen";

/**
 * A reel in the grid, dressed as an Instagram reel (optionally inside a phone).
 * The muted loop plays on hover with a mouse, or while on screen on touch devices.
 * The <video> is only mounted while it should play, so off-screen cards cost nothing.
 */
export default function ReelCard({ reel, onOpen, phone = false, tabIndex, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const { isOpen } = usePlayer();
  const mouse = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const active = !reduce && !isOpen && visible && (!mouse || hover);
  const screen = (
    <>
      <ReelMedia reel={reel} active={active} />
      <InstaUI reel={reel} chrome={phone ? "phone" : "tile"} />
      <PlayHint />
    </>
  );

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabIndex}
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={reelLabel(reel)}
      className={`group block w-full text-left transition-transform duration-700 ease-expo hover:-translate-y-1.5 ${className}`}
    >
      {phone ? (
        <Phone>{screen}</Phone>
      ) : (
        <span className="reel-box">
          <span className="tile-screen transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_30px_80px_-30px_rgba(255,92,53,0.45)]">{screen}</span>
        </span>
      )}
    </button>
  );
}
