import { useMemo, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion, useTransform } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";
import { usePlayer } from "../lib/player";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useScrollProgress } from "../lib/useScrollProgress";
import SectionHeader from "./SectionHeader";
import ReelCard from "./ReelCard";

const ALL = "All";
const PAGE = 12;
const EASE = [0.16, 1, 0.3, 1];
/* How far each column drifts while the section scrolls past (px). Alternating = depth. */
const DRIFT = [40, -70, 60, -90];

function Column({ items, index, progress, reduce, children }) {
  const amp = reduce ? 0 : DRIFT[index % DRIFT.length];
  const y = useTransform(progress, [0, 1], [amp, -amp]);
  return (
    <motion.ul style={{ y }} className={`flex min-w-0 flex-1 flex-col gap-3 md:gap-5 ${index % 2 ? "pt-16 md:pt-24" : ""}`}>
      {items.map(children)}
    </motion.ul>
  );
}

function NextTile() {
  return (
    <a
      href="#contact"
      className="group relative flex aspect-[9/14] flex-col justify-between overflow-hidden rounded-[1.4rem] bg-[linear-gradient(160deg,#ff6a40_0%,#ff5c35_45%,#c2361a_100%)] p-5 text-black md:p-6"
    >
      <span aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-transform duration-700 ease-expo group-hover:scale-150" />
      <span className="eyebrow relative !text-[10px] text-black/70">Your brand?</span>
      <span className="relative">
        <span className="title-lg block text-[clamp(2rem,3.2vw,3.25rem)]">
          You&apos;re <span className="serif">next.</span>
        </span>
        <span className="mt-4 flex items-center justify-between gap-3 text-[14px] font-semibold">
          Start a project
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-chalk transition-transform duration-500 ease-expo group-hover:rotate-45">
            <FiArrowUpRight className="h-4 w-4" />
          </span>
        </span>
      </span>
    </a>
  );
}

/** Every reel from the admin library, in drifting columns, filterable by category. */
export default function Work({ reels }) {
  const ref = useRef(null);
  const { open } = usePlayer();
  const reduce = useReducedMotion();
  const xxl = useMediaQuery("(min-width: 1536px)");
  const lg = useMediaQuery("(min-width: 1024px)");
  const sm = useMediaQuery("(min-width: 640px)");
  const [filter, setFilter] = useState(ALL);
  const [limit, setLimit] = useState(PAGE);
  const progress = useScrollProgress({ target: ref, offset: ["start end", "end start"] });

  const categories = useMemo(() => [...new Set(reels.map((r) => r.category).filter(Boolean))], [reels]);
  const list = filter === ALL ? reels : reels.filter((r) => r.category === filter);
  const shown = list.slice(0, limit);

  // Deal the reels (plus the CTA tile) into columns, left to right.
  const items = [...shown.map((reel) => ({ reel })), { cta: true }];
  const cols = Math.min(xxl ? 5 : lg ? 4 : sm ? 3 : 2, Math.max(items.length, 2));
  const columns = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));

  return (
    <section id="work" ref={ref} tabIndex={-1} className="relative overflow-hidden bg-black px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_15%_10%,rgba(255,92,53,0.10),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1600px]">
        <SectionHeader index="01" label="Work" title="Reels that *did the job.*">
          <p className="max-w-sm text-[16px] leading-relaxed text-smoke">
            Scripted, shot and edited by us for brands across interiors, real estate, food, events and more. Tap any reel to watch it with sound.
          </p>
        </SectionHeader>

        {categories.length > 1 && (
          <LayoutGroup>
            <div role="group" aria-label="Filter reels by category" className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 md:mt-16">
              {[ALL, ...categories].map((c) => {
                const count = c === ALL ? reels.length : reels.filter((r) => r.category === c).length;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={c === filter}
                    onClick={() => {
                      setFilter(c);
                      setLimit(PAGE);
                    }}
                    className="relative shrink-0 rounded-full px-4 py-2.5 text-[14px] transition-colors duration-300"
                  >
                    {c === filter ? (
                      <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-chalk" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
                    ) : (
                      <span className="absolute inset-0 rounded-full border border-white/12" />
                    )}
                    <span className={`relative ${c === filter ? "text-black" : "text-chalk/75"}`}>
                      {c} <span className={c === filter ? "text-black/50" : "text-dim"}>{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        )}

        <motion.div
          key={`${filter}-${cols}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`flex items-start gap-3 md:gap-5 ${categories.length > 1 ? "mt-10" : "mt-14 md:mt-20"}`}
        >
          {columns.map((colItems, ci) => (
            <Column key={ci} items={colItems} index={ci} progress={progress} reduce={reduce}>
              {(item) =>
                item.cta ? (
                  <li key="cta">
                    <NextTile />
                  </li>
                ) : (
                  <li key={item.reel.id}>
                    <ReelCard reel={item.reel} onOpen={() => open(list, list.indexOf(item.reel))} />
                  </li>
                )
              }
            </Column>
          ))}
        </motion.div>

        {list.length > limit && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="glass rounded-full px-6 py-3 text-[14px] font-semibold transition-colors hover:border-white/30"
            >
              Show more reels ({list.length - limit})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
