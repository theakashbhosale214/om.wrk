import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { FaPlay, FaRegBookmark, FaRegComment, FaRegHeart, FaHeart, FaRegPaperPlane } from "react-icons/fa";
import { content } from "../data/content";
import { formatIST, useNow } from "../lib/useNow";
import LogoMark from "./LogoMark";

/*
  FLOATING REELS HERO
  ───────────────────
  A centred headline with phone-style "reel" cards floating around it.
  Each card is drawn in code (no footage needed) and sized with container-query
  units (cqw), so everything inside scales with the card's width.
  • Desktop (lg+): four cards orbit the headline, tilt toward the cursor in 3D
    and drift apart at different speeds as you scroll.
  • Below lg: three cards fan out under the buttons.
*/

const EASE = [0.16, 1, 0.3, 1];
const LIGHT_LOGOS = content.clients.filter((c) => !c.dark);

function Clock() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)} IST</span>;
}

/* ── Card chrome: story bars, account row, action icons ─────────── */
function CardChrome({ dark = false, label, live = 1, children }) {
  return (
    <div className={`relative flex h-full flex-col p-[6cqw] ${dark ? "text-bone" : "text-ink"}`}>
      <div className="flex gap-[1.6cqw]">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`story-bar ${i < live ? "done" : i === live ? "live" : ""}`}>
            <i />
          </span>
        ))}
      </div>

      <div className="mt-[4.5cqw] flex items-center gap-[3cqw]">
        <span className="grid h-[11cqw] w-[11cqw] shrink-0 place-items-center rounded-full bg-ink">
          <LogoMark className="h-[5.6cqw] w-auto text-bone" />
        </span>
        <span className="min-w-0 leading-none">
          <span className="block text-[4.6cqw] font-semibold">zoomifymedia</span>
          <span className="mt-[1cqw] block font-mono text-[3.4cqw] uppercase tracking-[0.12em] opacity-60">
            {label}
          </span>
        </span>
        <span className="ml-auto text-[5cqw] leading-none tracking-widest opacity-60">···</span>
      </div>

      <div className="relative mt-[4cqw] flex-1">{children}</div>

      <div className="mt-[4cqw] flex items-center gap-[5cqw] text-[6.4cqw]">
        <FaRegHeart />
        <FaRegComment />
        <FaRegPaperPlane />
        <FaRegBookmark className="ml-auto" />
      </div>
    </div>
  );
}

/* ── Card faces ─────────────────────────────────────────────────── */
function ReelFace() {
  return (
    <div className="reel-card bg-ink">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(85%_55%_at_50%_42%,rgb(232_71_44/0.55),transparent_72%)]"
      />
      <CardChrome dark label="Reel · 0:15" live={1}>
        <div className="absolute inset-x-0 top-[8cqw] grid place-items-center">
          <div className="relative grid h-[40cqw] w-[40cqw] place-items-center text-tomato">
            <span className="ring-pulse" />
            <span className="ring-pulse" style={{ animationDelay: "1.4s" }} />
            <span className="grid h-[22cqw] w-[22cqw] place-items-center rounded-full bg-bone text-ink shadow-lg">
              <FaPlay className="ml-[1.2cqw] h-[7cqw] w-[7cqw]" />
            </span>
          </div>
        </div>
        <p className="absolute inset-x-0 bottom-0 font-display text-[9cqw] leading-[1.02] tracking-[-0.02em]">
          Reels that hook in the <em className="text-tomato">first second.</em>
        </p>
      </CardChrome>
    </div>
  );
}

function StatFace() {
  const hearts = [
    { left: "62%", delay: "0s", hx: "-8px", size: "7cqw" },
    { left: "74%", delay: "0.9s", hx: "10px", size: "5.5cqw" },
    { left: "84%", delay: "1.8s", hx: "-4px", size: "8cqw" },
    { left: "70%", delay: "2.5s", hx: "14px", size: "5cqw" },
  ];
  return (
    <div className="reel-card bg-tomato">
      <CardChrome dark label="Milestone" live={2}>
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
      </CardChrome>
    </div>
  );
}

function GrowthFace() {
  const gid = useId().replace(/:/g, "");
  return (
    <div className="reel-card bg-paper">
      <CardChrome label="Performance ads" live={0}>
        <div className="absolute inset-x-0 top-[2cqw]">
          <p className="font-mono text-[4cqw] uppercase tracking-[0.14em] opacity-55">Campaign</p>
          <p className="mt-[1.5cqw] font-display text-[11.5cqw] leading-[0.95] tracking-[-0.03em]">
            Trending <em className="text-tomato">up.</em>
          </p>
        </div>
        <svg viewBox="0 0 200 150" className="absolute inset-x-0 bottom-0 w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-sage)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 80, 120].map((y) => (
            <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 4" />
          ))}
          <path
            d="M0 128 C 28 124, 40 108, 64 110 S 104 84, 126 86 S 168 40, 200 22 L200 150 L0 150Z"
            fill={`url(#area-${gid})`}
          />
          <path
            className="draw-line"
            d="M0 128 C 28 124, 40 108, 64 110 S 104 84, 126 86 S 168 40, 200 22"
            fill="none"
            stroke="var(--color-tomato)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="200" cy="22" r="5" fill="var(--color-tomato)" className="draw-dot" />
        </svg>
      </CardChrome>
    </div>
  );
}

function ClientFace() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % LIGHT_LOGOS.length), 2400);
    return () => clearInterval(t);
  }, [reduce]);

  const client = LIGHT_LOGOS[i];
  return (
    <div className="reel-card bg-sage-soft">
      <CardChrome label="Client spotlight" live={1}>
        <div className="absolute inset-x-0 top-0 bottom-[24cqw] grid place-items-center overflow-hidden rounded-[6cqw] bg-paper">
          <AnimatePresence mode="wait">
            <motion.img
              key={client.name}
              src={client.logo}
              alt=""
              className="h-[62%] w-[72%] object-contain mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <p className="font-mono text-[4cqw] uppercase tracking-[0.14em] opacity-55">Made for</p>
          <p className="truncate font-display text-[8.6cqw] leading-tight tracking-[-0.02em]">{client.name}</p>
        </div>
      </CardChrome>
    </div>
  );
}

/* Card layout. Classes switch from a fan under the buttons to an orbit at lg. */
const CARDS = [
  {
    Face: ReelFace,
    rotate: -9,
    depth: 1.1,
    shift: -240,
    className:
      "relative z-[2] w-[7.6rem] sm:w-[10rem] lg:absolute lg:left-[4%] lg:top-[18%] lg:w-[10.5rem] xl:left-[5%] xl:w-[12.5rem] 2xl:w-[14rem]",
  },
  {
    Face: ClientFace,
    rotate: 7,
    depth: 0.65,
    shift: -110,
    className:
      "hidden lg:absolute lg:bottom-[13%] lg:left-[13%] lg:block lg:w-[9rem] xl:left-[15%] xl:w-[10.5rem] 2xl:w-[11.5rem]",
  },
  {
    Face: StatFace,
    rotate: 6,
    depth: 0.9,
    shift: -280,
    className:
      "relative z-[3] -mx-5 mb-8 w-[7.6rem] sm:-mx-6 sm:w-[10rem] lg:absolute lg:right-[4%] lg:top-[15%] lg:m-0 lg:w-[10rem] xl:right-[5%] xl:w-[12rem] 2xl:w-[13.5rem]",
  },
  {
    Face: GrowthFace,
    rotate: -6,
    depth: 1.3,
    shift: -150,
    className:
      "relative z-[1] w-[7.6rem] sm:w-[10rem] lg:absolute lg:bottom-[12%] lg:right-[12%] lg:w-[9.5rem] xl:right-[14%] xl:w-[11rem] 2xl:w-[12rem]",
  },
];

function FloatingCard({ card, index, mx, my, progress, delay, reduce }) {
  const { Face, rotate, depth, shift } = card;
  const x = useTransform(mx, (v) => v * 28 * depth);
  const y = useTransform([my, progress], ([m, p]) => m * 22 * depth + p * shift);
  const rotateY = useTransform(mx, (v) => v * 14 * depth);
  const rotateX = useTransform(my, (v) => -v * 11 * depth);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none select-none ${card.className}`}
      style={reduce ? { rotate } : { x, y, rotate, rotateX, rotateY, transformPerspective: 900 }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 110, scale: 0.82 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: delay + 0.2 + index * 0.11 }}
      >
        <div className="float" style={{ "--float-dur": `${5.6 + index * 0.8}s`, "--float-delay": `${-index * 1.4}s` }}>
          <Face />
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

  // Cursor position across the hero, -1 … 1 on each axis, smoothed.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.7 });
  const smy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.7 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);

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

      <div className="flex flex-1 flex-col items-center justify-center pb-12 text-center md:pb-16">
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

          <h1 className="mt-7 font-display text-[clamp(2.7rem,11vw,7.5rem)] font-[380] leading-[0.92] tracking-[-0.04em] md:mt-9 lg:text-[6.6vw] xl:text-[7vw] 2xl:text-[6.6vw]">
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

          <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3" style={{ "--i": 4 }}>
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
            <a
              href="#work"
              className="relative py-2 text-[15px] font-medium after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-right after:bg-current after:transition-transform after:duration-500 after:ease-expo hover:after:origin-left hover:after:scale-x-0"
            >
              See our work
            </a>
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
            />
          ))}
        </div>
      </div>

      {/* trusted-by strip */}
      <div
        className="fade-up relative z-10 -mx-5 border-t border-ink/10 sm:-mx-8 md:-mx-12"
        style={{ "--i": 6 }}
      >
        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-8 md:px-12">
          <p className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/55">
            Trusted by 200+ brands
          </p>
          <div className="logo-strip relative min-w-0 flex-1 overflow-hidden">
            <div className="marquee" style={{ "--marquee-dur": "48s" }}>
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={copy === 1}>
                  {LIGHT_LOGOS.map((c) => (
                    <li key={c.name} className="shrink-0">
                      <img
                        src={c.logo}
                        alt={copy === 0 ? c.name : ""}
                        loading="lazy"
                        decoding="async"
                        className="h-9 w-auto max-w-[8rem] object-contain md:h-11"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
