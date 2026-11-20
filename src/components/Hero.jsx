import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { FaHeart, FaPlay, FaRegBookmark, FaRegComment, FaRegHeart, FaRegPaperPlane, FaVolumeMute } from "react-icons/fa";
import { content } from "../data/content";
import { formatIST, useNow } from "../lib/useNow";
import { reelSrc } from "../lib/reels";
import LogoMark from "./LogoMark";
import ReelModal from "./ReelModal";

/*
  REELS HERO
  ──────────
  A centred headline with the studio's real reels floating around it as phone-style
  cards. Cards play short muted loops; clicking one opens the full reel with sound.
  • Desktop (lg+): cards orbit the headline, tilt toward the cursor in 3D and drift
    apart at different speeds as you scroll.
  • Below lg: the three reels fan out under the buttons.
  Loops only play while the hero is on screen, and never for reduced-motion visitors
  (they see the poster frames instead).
  Card internals are sized in container-query units (cqw) so they scale with the card.
*/

const EASE = [0.16, 1, 0.3, 1];
const REELS = content.reels;

function Clock() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)} IST</span>;
}

/* ── A real reel, playing muted ─────────────────────────────────── */
function VideoCard({ reel, index, playing, onOpen }) {
  const videoRef = useRef(null);
  const barRef = useRef(null);
  const src = reelSrc(reel.slug);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  const onTime = (e) => {
    const v = e.currentTarget;
    if (barRef.current && v.duration) barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Watch ${reel.client}, ${reel.title}, with sound`}
      className="reel-card group block w-full cursor-pointer bg-ink text-left text-bone"
    >
      <video
        ref={videoRef}
        src={src.loop}
        poster={src.poster}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
        onTimeUpdate={onTime}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,transparent_24%,transparent_52%,rgba(0,0,0,0.8)_100%)]"
      />

      {/* top: playback bar, badge, muted icon */}
      <span aria-hidden="true" className="absolute inset-x-[6cqw] top-[5cqw] block h-[2px] overflow-hidden rounded-full bg-white/30">
        <span ref={barRef} className="block h-full origin-left bg-white transition-transform duration-300 ease-linear" style={{ transform: "scaleX(0)" }} />
      </span>
      <span
        aria-hidden="true"
        className="absolute left-[6cqw] top-[10cqw] flex items-center gap-[2cqw] font-mono text-[length:max(8px,3.6cqw)] uppercase tracking-[0.12em]"
      >
        <span className="h-[max(5px,2cqw)] w-[max(5px,2cqw)] rounded-full bg-tomato" /> Reel
      </span>
      <span
        aria-hidden="true"
        className="absolute right-[6cqw] top-[8cqw] grid h-[max(18px,9cqw)] w-[max(18px,9cqw)] place-items-center rounded-full bg-black/40 backdrop-blur-sm"
      >
        <FaVolumeMute className="h-[45%] w-[45%]" />
      </span>

      {/* bottom: client + play */}
      <span aria-hidden="true" className="absolute inset-x-[6cqw] bottom-[6cqw] block">
        <span className="block font-mono text-[length:max(8px,3.4cqw)] uppercase tracking-[0.14em] text-bone/75 @max-[10rem]:hidden">
          {reel.tag}
        </span>
        <span className="mt-[1.5cqw] block font-display text-[length:max(12px,8cqw)] leading-[1.02] tracking-[-0.02em]">
          {reel.client}
        </span>
        <span className="mt-[4cqw] inline-flex items-center gap-[2.5cqw] rounded-full bg-bone p-[1.8cqw] text-[length:max(9px,3.8cqw)] font-medium text-ink transition-colors duration-300 group-hover:bg-tomato group-hover:text-bone @min-[10rem]:pr-[4cqw]">
          <span className="grid h-[max(18px,7cqw)] w-[max(18px,7cqw)] place-items-center rounded-full bg-ink text-bone">
            <FaPlay className="ml-[8%] h-[38%] w-[38%]" />
          </span>
          <span className="@max-[10rem]:hidden">Watch with sound</span>
        </span>
      </span>
    </button>
  );
}

/* ── The one drawn card: a milestone post ───────────────────────── */
function StatFace() {
  const hearts = [
    { left: "62%", delay: "0s", hx: "-8px", size: "7cqw" },
    { left: "74%", delay: "0.9s", hx: "10px", size: "5.5cqw" },
    { left: "84%", delay: "1.8s", hx: "-4px", size: "8cqw" },
    { left: "70%", delay: "2.5s", hx: "14px", size: "5cqw" },
  ];
  return (
    <div className="reel-card bg-tomato">
      <div className="relative flex h-full flex-col p-[6cqw] text-bone">
        <div className="flex items-center gap-[3cqw]">
          <span className="grid h-[11cqw] w-[11cqw] shrink-0 place-items-center rounded-full bg-ink">
            <LogoMark className="h-[5.6cqw] w-auto text-bone" />
          </span>
          <span className="min-w-0 leading-none">
            <span className="block text-[4.6cqw] font-semibold">zoomifymedia</span>
            <span className="mt-[1cqw] block font-mono text-[3.4cqw] uppercase tracking-[0.12em] opacity-70">Milestone</span>
          </span>
        </div>
        <div className="relative flex-1">
          {hearts.map((h, i) => (
            <FaHeart
              key={i}
              aria-hidden="true"
              className="heart-rise text-bone"
              style={{ left: h.left, animationDelay: h.delay, "--hx": h.hx, width: h.size, height: h.size }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0">
            <p className="font-display text-[31cqw] leading-[0.82] tracking-[-0.05em]">
              200<span className="text-ink">+</span>
            </p>
            <p className="mt-[3cqw] font-mono text-[4.2cqw] uppercase tracking-[0.14em]">Brands grown with us</p>
          </div>
        </div>
        <div className="mt-[4cqw] flex items-center gap-[5cqw] text-[6.4cqw]">
          <FaRegHeart />
          <FaRegComment />
          <FaRegPaperPlane />
          <FaRegBookmark className="ml-auto" />
        </div>
      </div>
    </div>
  );
}

/* Card layout: a fan under the buttons on small screens, an orbit around the headline at lg. */
const CARDS = [
  {
    reel: 0,
    rotate: -7,
    depth: 1.1,
    shift: -240,
    className:
      "relative z-[2] w-[8.5rem] sm:w-[11rem] lg:absolute lg:left-[4%] lg:top-[17%] lg:w-[11.5rem] xl:left-[5%] xl:w-[13.5rem] 2xl:w-[15rem]",
  },
  {
    reel: null,
    rotate: 7,
    depth: 0.65,
    shift: -110,
    className: "hidden lg:absolute lg:bottom-[11%] lg:left-[14%] lg:block lg:w-[8.5rem] xl:left-[15%] xl:w-[9.5rem] 2xl:w-[10.5rem]",
  },
  {
    reel: 1,
    rotate: 5,
    depth: 0.9,
    shift: -280,
    className:
      "relative z-[3] -mx-6 mb-8 w-[8.5rem] sm:-mx-8 sm:w-[11rem] lg:absolute lg:right-[4%] lg:top-[14%] lg:m-0 lg:w-[11rem] xl:right-[5%] xl:w-[13rem] 2xl:w-[14.5rem]",
  },
  {
    reel: 2,
    rotate: -5,
    depth: 1.3,
    shift: -150,
    className:
      "relative z-[1] w-[8.5rem] sm:w-[11rem] lg:absolute lg:bottom-[9%] lg:right-[13%] lg:w-[9.5rem] xl:right-[15%] xl:w-[11rem] 2xl:w-[12rem]",
  },
];

function FloatingCard({ card, index, mx, my, progress, delay, reduce, playing, onOpen }) {
  const { rotate, depth, shift } = card;
  const x = useTransform(mx, (v) => v * 26 * depth);
  const y = useTransform([my, progress], ([m, p]) => m * 20 * depth + p * shift);
  const rotateY = useTransform(mx, (v) => v * 12 * depth);
  const rotateX = useTransform(my, (v) => -v * 9 * depth);
  const isVideo = card.reel !== null;

  return (
    <motion.div
      aria-hidden={isVideo ? undefined : true}
      className={`select-none ${isVideo ? "" : "pointer-events-none"} ${card.className}`}
      style={reduce ? { rotate } : { x, y, rotate, rotateX, rotateY, transformPerspective: 900 }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 110, scale: 0.82 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: delay + 0.2 + index * 0.11 }}
      >
        <div className="float" style={{ "--float-dur": `${5.6 + index * 0.8}s`, "--float-delay": `${-index * 1.4}s` }}>
          {isVideo ? (
            <VideoCard reel={REELS[card.reel]} index={card.reel} playing={playing} onOpen={onOpen} />
          ) : (
            <StatFace />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const [delay] = useState(
    () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro-delay")) || 0
  );
  const [inView, setInView] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  // Cursor position across the hero, -1 … 1 on each axis, smoothed.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.7 });
  const smy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.7 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);

  // Only spend battery on the loops while the hero is visible and the player is closed.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  const playing = inView && openIndex === null && !reduce;

  const openReel = useCallback((i) => setOpenIndex(i), []);
  const closeReel = useCallback(() => setOpenIndex(null), []);
  const stepReel = useCallback((d) => setOpenIndex((i) => (i === null ? i : (i + d + REELS.length) % REELS.length)), []);

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      tabIndex={-1}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bone px-5 pt-28 sm:px-8 md:px-12 md:pt-32"
    >
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-dots absolute inset-0 -z-10" />

      <div className="flex flex-1 flex-col items-center justify-center pb-10 text-center md:pb-14">
        <motion.div style={{ y: textY }} className="relative z-10 flex flex-col items-center">
          <div
            className="fade-up inline-flex items-center gap-3 rounded-full border border-ink/10 bg-paper/75 py-1.5 pl-3 pr-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/65 backdrop-blur-md"
            style={{ "--i": 0 }}
          >
            <span className="live-dot" />
            {content.hero.status}
            <span aria-hidden="true" className="hidden h-3 w-px bg-ink/15 sm:block" />
            <span className="hidden sm:inline">
              India · <Clock />
            </span>
          </div>

          <h1 className="mt-7 font-display text-[clamp(2.7rem,11vw,7.5rem)] font-[380] leading-[0.92] tracking-[-0.04em] md:mt-9 lg:text-[6.4vw] xl:text-[6.8vw] 2xl:text-[6.4vw]">
            <span className="rise-line" style={{ "--i": 0 }}>
              <span>Content that</span>
            </span>
            <span className="rise-line" style={{ "--i": 1 }}>
              <span>
                <em className="text-tomato">stops</em> the scroll.
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-7 max-w-md text-[15.5px] leading-relaxed text-ink/65 md:mt-8 md:max-w-lg md:text-base"
            style={{ "--i": 2 }}
          >
            {content.hero.subtitle}
          </p>

          <ul
            className="fade-up mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/50"
            style={{ "--i": 3 }}
          >
            {content.hero.tags.map((tag, i) => (
              <li key={tag} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-tomato" />}
                {tag}
              </li>
            ))}
          </ul>

          <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={{ "--i": 4 }}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-bone transition-colors duration-300 hover:bg-tomato"
            >
              Start a project
              <span className="grid h-10 w-10 place-items-center rounded-full bg-tomato transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-ink">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </a>
            <button
              type="button"
              onClick={() => openReel(0)}
              className="group inline-flex items-center gap-3 rounded-full border border-ink/15 bg-paper/60 py-2 pl-2 pr-5 text-[15px] font-medium backdrop-blur-sm transition-colors duration-300 hover:border-ink"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-bone ring-1 ring-ink/10 transition-transform duration-500 ease-expo group-hover:scale-110">
                <FaPlay className="ml-0.5 h-3 w-3 text-tomato" />
              </span>
              Watch our reels
            </button>
          </div>
        </motion.div>

        {/* reel cards: a fan below the buttons, an orbit around the headline at lg */}
        <div className="mt-14 flex items-end justify-center lg:mt-0">
          {CARDS.map((card, i) => (
            <FloatingCard
              key={i}
              card={card}
              index={i}
              mx={smx}
              my={smy}
              progress={scrollYProgress}
              delay={delay}
              reduce={reduce}
              playing={playing}
              onOpen={openReel}
            />
          ))}
        </div>

        <p
          className="fade-up mt-8 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/45 lg:hidden"
          style={{ "--i": 5 }}
        >
          Tap a reel to watch with sound
        </p>
      </div>

      <ReelModal reels={REELS} index={openIndex} onClose={closeReel} onChange={stepReel} />
    </section>
  );
}
