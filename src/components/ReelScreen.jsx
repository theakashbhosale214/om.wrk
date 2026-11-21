import { useRef } from "react";
import { FiCamera, FiChevronDown, FiHeart, FiMessageCircle, FiMoreHorizontal, FiMusic, FiSend, FiVolumeX } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import LogoMark from "./LogoMark";

/*
  The studio's reels, dressed the way people actually see them: an Instagram-style
  reel screen (handle, caption, action rail, audio line, progress bar), optionally
  inside a phone. All sizes are in cqw, so the UI scales with the phone/tile width.
*/

/** Poster first; the muted loop is mounted only while `active`, and fades in once it plays. */
export function ReelMedia({ reel, active }) {
  const barRef = useRef(null);
  const last = useRef(0);

  const onTime = (e) => {
    const v = e.currentTarget;
    const bar = barRef.current;
    if (!bar || !v.duration) return;
    const p = v.currentTime / v.duration;
    bar.style.transition = p < last.current ? "none" : "transform 0.3s linear";
    bar.style.transform = `scaleX(${p})`;
    last.current = p;
  };

  return (
    <>
      <img src={reel.poster} alt="" loading="lazy" decoding="async" draggable="false" className="absolute inset-0 h-full w-full object-cover" />
      {active && (
        <video
          src={reel.loop}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={(e) => (e.currentTarget.style.opacity = "1")}
          onTimeUpdate={onTime}
          style={{ opacity: 0 }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      )}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 block h-[max(2px,0.7cqw)] bg-white/25">
        <span ref={barRef} className="block h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
      </span>
    </>
  );
}

function StatusBar() {
  return (
    <span aria-hidden="true" className="absolute inset-x-[7cqw] top-[3.4cqw] z-10 flex items-center justify-between text-[length:max(7px,3.9cqw)] font-semibold text-white">
      <span>9:41</span>
      <span className="flex items-center gap-[1.2cqw]">
        {/* signal */}
        <span className="flex items-end gap-[0.5cqw]">
          {[1.4, 2, 2.6, 3.2].map((h) => (
            <span key={h} className="block w-[0.8cqw] rounded-[0.3cqw] bg-white" style={{ height: `${h}cqw` }} />
          ))}
        </span>
        {/* battery */}
        <span className="relative block h-[3.2cqw] w-[6.4cqw] rounded-[1cqw] border-[0.35cqw] border-white/70 p-[0.4cqw]">
          <span className="block h-full w-[78%] rounded-[0.5cqw] bg-white" />
        </span>
      </span>
    </span>
  );
}

/**
 * The Instagram-reel overlay.
 *   chrome="phone": status bar + "Reels" header (inside a phone)
 *   chrome="tile":  just the reel UI (cards in a grid)
 */
export function InstaUI({ reel, chrome = "phone" }) {
  const phone = chrome === "phone";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 block select-none text-white">
      <span className="absolute inset-0 block bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,transparent_22%,transparent_50%,rgba(0,0,0,0.78)_100%)]" />

      {phone && <StatusBar />}

      {/* header */}
      <span className={`absolute inset-x-[5cqw] flex items-center justify-between ${phone ? "top-[13cqw]" : "top-[5cqw]"}`}>
        <span className="flex items-center gap-[1cqw] text-[length:max(9px,6cqw)] font-bold tracking-[-0.02em]">
          Reels <FiChevronDown className="h-[4.4cqw] w-[4.4cqw]" />
        </span>
        <span className="flex items-center gap-[3cqw]">
          <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-full bg-black/35 backdrop-blur-sm">
            <FiVolumeX className="h-[4.2cqw] w-[4.2cqw]" />
          </span>
          {phone && <FiCamera className="h-[5.6cqw] w-[5.6cqw]" />}
        </span>
      </span>

      {/* action rail */}
      <span className="absolute bottom-[22cqw] right-[3.6cqw] flex flex-col items-center gap-[5.2cqw]">
        <FiHeart className="h-[7cqw] w-[7cqw]" />
        <FiMessageCircle className="h-[7cqw] w-[7cqw] -scale-x-100" />
        <FiSend className="h-[6.6cqw] w-[6.6cqw]" />
        <FiMoreHorizontal className="h-[6.4cqw] w-[6.4cqw]" />
        <span className="grid h-[8.4cqw] w-[8.4cqw] place-items-center rounded-[2cqw] border-[0.5cqw] border-white bg-coal">
          <LogoMark className="h-[4.6cqw] w-auto text-chalk" />
        </span>
      </span>

      {/* who / caption / audio */}
      <span className="absolute bottom-[6cqw] left-[4.6cqw] right-[17cqw] block">
        <span className="flex items-center gap-[2.2cqw]">
          <span className="grid h-[8.6cqw] w-[8.6cqw] shrink-0 place-items-center rounded-full bg-[conic-gradient(from_200deg,#ff5c35,#ffb36b,#ff2d75,#ff5c35)] p-[0.5cqw]">
            <span className="grid h-full w-full place-items-center rounded-full bg-coal">
              <LogoMark className="h-[4.2cqw] w-auto text-chalk" />
            </span>
          </span>
          <span className="truncate text-[length:max(8px,4.2cqw)] font-semibold">zoomifymedia</span>
          <span className="shrink-0 rounded-[1.6cqw] border-[0.35cqw] border-white/80 px-[2cqw] py-[0.6cqw] text-[length:max(7px,3.5cqw)] font-semibold">
            Follow
          </span>
        </span>
        <span className="mt-[2.4cqw] line-clamp-2 text-[length:max(8px,3.9cqw)] leading-[1.3] text-white/90">
          {reel.client && <span className="font-semibold">{reel.client} · </span>}
          {reel.title}
        </span>
        <span className="mt-[2.2cqw] flex items-center gap-[1.6cqw] text-[length:max(7px,3.4cqw)] text-white/85">
          <FiMusic className="h-[3.4cqw] w-[3.4cqw] shrink-0" />
          <span className="truncate">Original audio · om.wrk</span>
        </span>
      </span>
    </span>
  );
}

/** Phone body with side buttons and a dynamic island. */
export function Phone({ children, className = "", glow = false }) {
  return (
    <span className={`reel-box ${className}`}>
      <span className={`phone ${glow ? "shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_40px_120px_-30px_rgba(255,92,53,0.55)]" : ""}`}>
        <span className="phone-screen">
          {children}
          <span aria-hidden="true" className="phone-island" />
        </span>
      </span>
    </span>
  );
}

/** Round play button that appears on hover/focus. */
export function PlayHint({ label = "Watch with sound" }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 scale-90 items-center gap-[2.4cqw] whitespace-nowrap rounded-full bg-white/95 p-[2cqw] pr-[4.4cqw] text-[length:max(9px,4cqw)] font-semibold text-black opacity-0 shadow-2xl transition-all duration-500 ease-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
    >
      <span className="grid h-[9cqw] w-[9cqw] place-items-center rounded-full bg-ember text-black">
        <FaPlay className="ml-[0.6cqw] h-[3.4cqw] w-[3.4cqw]" />
      </span>
      {label}
    </span>
  );
}
