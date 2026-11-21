import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { FaHeart, FaPlay } from "react-icons/fa";
import { FiArrowUpRight, FiTrendingUp } from "react-icons/fi";
import { content } from "../data/content";
import { featuredReels, reelLabel } from "../lib/reels";
import { usePlayer } from "../lib/player";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useScrollProgress } from "../lib/useScrollProgress";
import { formatIST, useNow } from "../lib/useNow";
import { InstaUI, Phone, PlayHint, ReelMedia } from "./ReelScreen";
import LogoMark from "./LogoMark";

/*
  HERO — "the reel stage"
  ───────────────────────
  A centred headline with the studio's real reels floating around it in phones,
  each dressed as an Instagram reel, with the notifications good content brings
  (likes, DMs, live campaigns, reach) popping up on them.
  • Desktop: phones orbit the headline, tilt toward the cursor in 3D and drift
    apart at different speeds as you scroll.
  • Mobile: three phones fan out under the buttons.
  When there are more reels than phones, the phones take turns swapping to the
  next reel, so the whole library gets shown. Tap a phone to watch with sound.
*/

const EASE = [0.16, 1, 0.3, 1];
const SWAP_MS = 3800;

/* Where each phone sits on desktop, most important first (fewer reels → fewer phones). */
const ORBIT = [
  { pos: "left-[3.5%] top-[15%]", w: "min(15vw, 31vh)", rotate: -7, depth: 1.1, shift: -220, z: 3, chip: "like" },
  { pos: "right-[3.5%] top-[12%]", w: "min(14.5vw, 30vh)", rotate: 6, depth: 0.9, shift: -280, z: 3, chip: "dm" },
  { pos: "right-[15.5%] bottom-[4%]", w: "min(10.5vw, 22vh)", rotate: -5, depth: 1.3, shift: -130, z: 2, chip: "ads", back: true },
  { pos: "left-[15%] bottom-[5%]", w: "min(9.5vw, 20vh)", rotate: 6, depth: 0.6, shift: -80, z: 1, chip: "reach", back: true },
];

/* The mobile fan: left, centre, right. */
const FAN = [
  { x: "-64%", rotate: -10, scale: 0.8, z: 1 },
  { x: "0%", rotate: 0, scale: 1, z: 3, chip: "like" },
  { x: "64%", rotate: 10, scale: 0.8, z: 1 },
];

function Clock() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)} IST</span>;
}

/* ── Notifications ───────────────────────────────────────────────── */
function Banner({ children, className = "" }) {
  return (
    <span className={`glass flex items-center gap-3 rounded-[1.1rem] bg-black/55 p-2.5 pr-4 text-left shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] ${className}`}>
      {children}
    </span>
  );
}

const CHIPS = {
  like: () => (
    <Banner>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ff5c35,#ff2d75)] text-white">
        <FaHeart className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-[10.5px] text-chalk/55">Instagram · now</span>
        <span className="block text-[13px] text-chalk">
          Liked by <b className="font-semibold">your next customer</b>
        </span>
      </span>
    </Banner>
  ),
  dm: () => (
    <Banner className="items-start">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[conic-gradient(from_200deg,#ff5c35,#ffb36b,#ff2d75,#ff5c35)] p-[2px]">
        <span className="grid h-full w-full place-items-center rounded-full bg-graphite text-[12px] font-semibold">R</span>
      </span>
      <span className="min-w-0 leading-tight">
        <span className="flex items-center gap-2 text-[10.5px] text-chalk/55">
          New message <span className="h-1.5 w-1.5 rounded-full bg-ember" />
        </span>
        <span className="mt-0.5 block text-[13px] text-chalk">Saw your reel! Is the 2BHK still available?</span>
      </span>
    </Banner>
  ),
  ads: () => (
    <Banner className="!rounded-full !py-2 !pl-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-ok/70" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-ok" />
      </span>
      <span className="whitespace-nowrap text-[12.5px] text-chalk">
        Campaign live <span className="text-chalk/50">· Meta Ads</span>
      </span>
    </Banner>
  ),
  reach: () => (
    <Banner className="!items-end">
      <span className="leading-tight">
        <span className="block text-[10.5px] text-chalk/55">Reach this week</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-ok">
          <FiTrendingUp className="h-3.5 w-3.5" /> Trending up
        </span>
      </span>
      <svg viewBox="0 0 64 28" className="h-7 w-16" aria-hidden="true">
        <defs>
          <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4ade80" stopOpacity="0.45" />
            <stop offset="1" stopColor="#4ade80" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 24 L10 21 L20 22 L30 15 L40 16 L50 8 L64 3 L64 28 L0 28 Z" fill="url(#spark)" />
        <path d="M0 24 L10 21 L20 22 L30 15 L40 16 L50 8 L64 3" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Banner>
  ),
};

function Chip({ type, delay, className }) {
  const C = CHIPS[type];
  if (!C) return null;
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 block ${className}`}
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    >
      <span className="bob block" style={{ "--bob-dur": "5.5s", "--bob-delay": `${-delay}s` }}>
        <C />
      </span>
    </motion.span>
  );
}

/* ── One phone ───────────────────────────────────────────────────── */
function StagePhone({ reel, active, onOpen, glow, back, hint }) {
  return (
    <button type="button" onClick={onOpen} aria-label={reelLabel(reel)} className="group block w-full cursor-pointer text-left">
      <Phone glow={glow}>
        <AnimatePresence initial={false}>
          <motion.span
            key={reel.id}
            className="absolute inset-0 block"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ReelMedia reel={reel} active={active} />
            <InstaUI reel={reel} />
          </motion.span>
        </AnimatePresence>
        {back && <span aria-hidden="true" className="absolute inset-0 z-20 block bg-black/30 transition-opacity duration-500 group-hover:opacity-0" />}
        <PlayHint label={hint} />
      </Phone>
    </button>
  );
}

/**
 * Which reel each phone shows. With more reels than phones, every SWAP_MS one phone
 * (in turn) moves on to the next unseen reel, so the phones always show different reels.
 */
function useRotation(count, total, running) {
  const [state, setState] = useState(() => ({ shown: Array.from({ length: count }, (_, i) => i % Math.max(total, 1)), next: count, turn: 0 }));
  useEffect(() => {
    if (!running || total <= count) return;
    const id = setInterval(() => {
      setState((s) => {
        const shown = [...s.shown];
        shown[s.turn % count] = s.next % total;
        return { shown, next: s.next + 1, turn: s.turn + 1 };
      });
    }, SWAP_MS);
    return () => clearInterval(id);
  }, [running, total, count]);
  return state.shown;
}

/* Desktop: phones orbiting the headline. */
function Orbit({ reels, playing, onOpen, mx, my, progress, reduce }) {
  const count = Math.min(Math.max(reels.length, 2), ORBIT.length);
  const [hold, setHold] = useState(false); // don't swap a reel out from under the cursor
  const shown = useRotation(count, reels.length, playing && !hold);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {ORBIT.slice(0, count).map((slot, i) => (
        <OrbitPhone
          key={i}
          slot={slot}
          index={i}
          reel={reels[shown[i]]}
          playing={playing}
          onOpen={() => onOpen(shown[i])}
          onHold={setHold}
          mx={mx}
          my={my}
          progress={progress}
          reduce={reduce}
        />
      ))}
      {/* fewer than four reels: the last notification floats on its own */}
      {count < ORBIT.length && <Chip type="reach" delay={2.4} className="bottom-[16%] left-[7%]" />}
    </div>
  );
}

function OrbitPhone({ slot, index, reel, playing, onOpen, onHold, mx, my, progress, reduce }) {
  const { rotate, depth, shift } = slot;
  const x = useTransform(mx, (v) => v * 24 * depth);
  const y = useTransform([my, progress], ([m, p]) => m * 18 * depth + p * shift);
  const rotateY = useTransform(mx, (v) => v * 12 * depth);
  const rotateX = useTransform(my, (v) => -v * 9 * depth);

  return (
    <motion.div
      className={`pointer-events-auto absolute ${slot.pos}`}
      style={{ width: slot.w, zIndex: slot.z, ...(reduce ? { rotate } : { x, y, rotate, rotateX, rotateY, transformPerspective: 1000 }) }}
      onPointerEnter={() => onHold(true)}
      onPointerLeave={() => onHold(false)}
      onFocus={() => onHold(true)}
      onBlur={() => onHold(false)}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 140, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.35 + index * 0.12 }}
      >
        <div className="bob" style={{ "--bob-dur": `${6 + index * 0.9}s`, "--bob-delay": `${-index * 1.3}s` }}>
          <StagePhone reel={reel} active={playing} onOpen={onOpen} glow={index < 2} back={slot.back} hint={slot.back ? "Watch" : undefined} />
        </div>
        <Chip type={slot.chip} delay={1.5 + index * 0.35} className={slot.back ? "-left-[22%] top-[9%]" : "-left-[9%] -right-[9%] top-[8.5%]"} />
      </motion.div>
    </motion.div>
  );
}

/* Mobile: a fan of three phones. */
function Fan({ reels, playing, onOpen, reduce }) {
  const count = Math.min(Math.max(reels.length, 1), FAN.length);
  const shown = useRotation(count, reels.length, playing);
  // centre phone first, then left, then right
  const slots = count === 1 ? [FAN[1]] : count === 2 ? [FAN[1], FAN[2]] : [FAN[1], FAN[0], FAN[2]];

  return (
    <div className="relative mx-auto w-[min(54vw,15.5rem)]">
      {slots.map((slot, i) => (
        <motion.div
          key={i}
          className={`${i === 0 ? "relative" : "absolute inset-x-0 top-[6%]"}`}
          style={{ zIndex: slot.z }}
          initial={reduce ? false : { opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0, x: slot.x, rotate: slot.rotate, scale: slot.scale }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.5 + i * 0.12 }}
        >
          <StagePhone reel={reels[shown[i]]} active={playing} onOpen={() => onOpen(shown[i])} glow={i === 0} back={i > 0} hint={i > 0 ? "Watch" : undefined} />
          {slot.chip && <Chip type={slot.chip} delay={1.6} className="-left-[16%] -right-[16%] top-[8%]" />}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────── */
export default function Hero({ reels }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { open, isOpen } = usePlayer();
  const [inView, setInView] = useState(true);
  const list = featuredReels(reels);
  const listKey = list.map((r) => r.id).join("|");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 16, mass: 0.7 });
  const smy = useSpring(my, { stiffness: 50, damping: 16, mass: 0.7 });

  const progress = useScrollProgress({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(progress, [0, 1], [0, reduce ? 0 : 160]);
  const textOpacity = useTransform(progress, [0, 0.65], [1, reduce ? 1 : 0]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.02 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const playing = inView && !isOpen && !reduce;
  const openAt = (i) => open(list, i);

  const onPointerMove = (e) => {
    if (reduce || !finePointer) return;
    const r = ref.current.getBoundingClientRect();
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
      ref={ref}
      tabIndex={-1}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden bg-black pb-16 pt-28 lg:flex lg:min-h-[max(100svh,780px)] lg:flex-col lg:pb-0 lg:pt-0"
    >
      {/* light + stage */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_48%_at_50%_0%,rgba(255,92,53,0.26),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(38%_42%_at_88%_92%,rgba(109,92,255,0.16),transparent_70%),radial-gradient(34%_40%_at_8%_80%,rgba(255,92,53,0.1),transparent_70%)]" />
        <div className="stage-floor absolute inset-x-[-20%] bottom-0 h-[46%] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* desktop orbit */}
      {desktop && list.length > 0 && (
        <Orbit key={listKey} reels={list} playing={playing} onOpen={openAt} mx={smx} my={smy} progress={progress} reduce={reduce} />
      )}

      {/* copy */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center px-5 text-center sm:px-8 lg:max-w-none lg:flex-1 lg:justify-center lg:px-[19vw] lg:pt-20"
      >
        <div className="fade-up glass inline-flex items-center gap-3 rounded-full py-1.5 pl-3 pr-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-chalk/70" style={{ "--i": 0 }}>
          <span className="rec-dot" />
          <span className="text-chalk">Now booking</span>
          <span aria-hidden="true" className="h-3 w-px bg-white/15" />
          <span className="hidden sm:inline">{content.hero.eyebrow}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />
          <span>
            India · <Clock />
          </span>
        </div>

        <h1 className="title-xl mt-8 text-[clamp(2.9rem,12.6vw,7rem)] lg:mt-9 lg:text-[clamp(4.4rem,7.3vw,9rem)]">
          <span className="rise-line" style={{ "--i": 0 }}>
            <span>Content that</span>
          </span>
          <span className="rise-line" style={{ "--i": 1 }}>
            <span>
              <span className="serif text-glow pr-[0.06em]">stops</span> the scroll.
            </span>
          </span>
        </h1>

        <p className="fade-up mt-7 max-w-[34rem] text-[16.5px] leading-relaxed text-smoke md:text-[18px]" style={{ "--i": 2 }}>
          {content.hero.subtitle}
        </p>

        <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ "--i": 3 }}>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-ember py-2 pl-6 pr-2 text-[15px] font-semibold text-black shadow-[0_14px_40px_-10px_rgba(255,92,53,0.65)] transition-colors duration-300 hover:bg-chalk"
          >
            Start a project
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-chalk transition-transform duration-500 ease-expo group-hover:rotate-45">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </a>
          <button
            type="button"
            onClick={() => openAt(0)}
            className="glass group inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-[15px] font-semibold text-chalk transition-colors duration-300 hover:border-white/30"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-chalk text-black transition-transform duration-500 ease-expo group-hover:scale-110">
              <FaPlay className="ml-0.5 h-3 w-3" />
            </span>
            Watch the reels
          </button>
        </div>

        <TrustRow className="mt-10 hidden lg:flex" />
      </motion.div>

      {/* mobile fan */}
      {!desktop && list.length > 0 && (
        <div className="relative z-10 mt-14 px-5">
          <Fan key={listKey} reels={list} playing={playing} onOpen={openAt} reduce={reduce} />
          <TrustRow className="mt-12 flex justify-center" />
        </div>
      )}
    </section>
  );
}

function TrustRow({ className = "" }) {
  const logos = content.clients.filter((c) => !c.dark).slice(0, 5);
  return (
    <div className={`fade-up items-center gap-4 ${className}`} style={{ "--i": 4 }}>
      <div className="flex -space-x-2.5">
        {logos.map((c) => (
          <span key={c.name} className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-black">
            <img src={c.logo} alt="" loading="lazy" className="h-7 w-7 object-contain" />
          </span>
        ))}
        <span className="grid h-10 w-10 place-items-center rounded-full bg-graphite text-[11px] font-semibold text-chalk ring-2 ring-black">
          <LogoMark className="h-4 w-auto text-chalk" />
        </span>
      </div>
      <p className="text-left text-[13.5px] leading-tight text-smoke">
        <span className="block font-semibold text-chalk">200+ brands</span>
        grown with om.wrk
      </p>
    </div>
  );
}
