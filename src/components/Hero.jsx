import { FaPlay } from "react-icons/fa";
import { content } from "../data/content";
import { featuredReels } from "../lib/reels";
import { usePlayer } from "../lib/player";
import { formatIST, useNow } from "../lib/useNow";
import ReelCard from "./ReelCard";

/*
  HERO
  ────
  Film-title headline, then a full-width wall of the studio's reels drifting past.
  Reels come from the admin panel (the "show in hero" ones); every tile plays its
  muted loop while on screen, and opens the full reel with sound on click.
*/

function Clock() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)} IST</span>;
}

/** Repeats the list so the strip is always wider than the screen, then doubles it for a seamless loop. */
function ReelWall({ reels }) {
  const { open } = usePlayer();
  if (!reels.length) return null;
  const items = [];
  while (items.length < Math.max(8, reels.length)) {
    reels.forEach((reel, i) => items.push({ reel, i }));
  }

  return (
    <div className="marquee-pause edge-fade relative overflow-hidden">
      <div className="marquee" style={{ "--marquee-dur": `${items.length * 7}s` }}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4">
            {items.map(({ reel, i }, k) => (
              <li key={`${copy}-${k}`} className="w-[clamp(9.5rem,16vw,16rem)] shrink-0">
                <ReelCard reel={reel} onOpen={() => open(reels, i)} tabIndex={copy === 1 || k >= reels.length ? -1 : undefined} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ reels }) {
  const { open } = usePlayer();
  const featured = featuredReels(reels);

  return (
    <section id="home" tabIndex={-1} className="relative overflow-hidden bg-black pb-16 pt-28 md:pb-24 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_85%_0%,rgba(255,92,53,0.16),transparent_70%),radial-gradient(40%_40%_at_0%_100%,rgba(255,255,255,0.05),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <div className="fade-up eyebrow flex flex-wrap items-center justify-between gap-3 text-smoke" style={{ "--i": 0 }}>
          <span className="flex items-center gap-2.5">
            <span className="rec-dot" />
            <span className="text-chalk">Rec</span> · {content.hero.eyebrow}
          </span>
          <span className="hidden sm:inline">
            India · <Clock />
          </span>
        </div>

        <h1 className="title-xl mt-8 text-[clamp(3.1rem,11.4vw,12.5rem)] md:mt-10">
          <span className="rise-line" style={{ "--i": 0 }}>
            <span>Content that</span>
          </span>
          <span className="rise-line" style={{ "--i": 1 }}>
            <span>
              <span className="text-ember">stops</span> the scroll.
            </span>
          </span>
        </h1>

        <div className="mt-8 grid items-end gap-7 md:mt-12 md:grid-cols-12">
          <p className="fade-up max-w-xl text-[17px] leading-relaxed text-smoke md:col-span-6 md:text-lg" style={{ "--i": 2 }}>
            {content.hero.subtitle}
          </p>
          <div className="fade-up flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end" style={{ "--i": 3 }}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-ember py-2 pl-6 pr-2 text-[15px] font-semibold text-black transition-colors duration-300 hover:bg-chalk"
            >
              Start a project
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-chalk transition-transform duration-500 ease-expo group-hover:rotate-45">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </a>
            <button
              type="button"
              onClick={() => open(featured, 0)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 py-2 pl-2 pr-6 text-[15px] font-semibold text-chalk transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-transform duration-500 ease-expo group-hover:scale-110">
                <FaPlay className="ml-0.5 h-3 w-3 text-ember" />
              </span>
              Play the reels
            </button>
          </div>
        </div>
      </div>

      <div className="fade-up relative mt-14 md:mt-20" style={{ "--i": 4 }}>
        <ReelWall reels={featured} />
      </div>
    </section>
  );
}
