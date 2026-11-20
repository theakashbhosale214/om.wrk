import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { usePlayer } from "../lib/player";
import SectionHeader from "./SectionHeader";
import ReelCard from "./ReelCard";

const ALL = "All";
const PAGE = 8;
const EASE = [0.16, 1, 0.3, 1];

/** Every reel from the admin library, filterable by category. */
export default function Work({ reels }) {
  const { open } = usePlayer();
  const [filter, setFilter] = useState(ALL);
  const [limit, setLimit] = useState(PAGE);

  const categories = useMemo(() => [...new Set(reels.map((r) => r.category).filter(Boolean))], [reels]);
  const list = filter === ALL ? reels : reels.filter((r) => r.category === filter);
  const shown = list.slice(0, limit);

  return (
    <section id="work" tabIndex={-1} className="relative bg-black px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader
          index="01"
          label="Work"
          title="Reels that *did the job.*"
          intro="Scripted, shot and edited by us for brands across interiors, real estate, food, events and more. Tap any reel to watch it with sound."
        />

        {categories.length > 1 && (
          <LayoutGroup>
            <div role="group" aria-label="Filter reels by category" className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 md:mt-16">
              {[ALL, ...categories].map((c) => (
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
                  <span className={`relative ${c === filter ? "text-black" : "text-chalk/75"}`}>{c}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        )}

        <motion.ul layout className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 ${categories.length > 1 ? "mt-8" : "mt-12 md:mt-16"}`}>
          <AnimatePresence mode="popLayout">
            {shown.map((reel) => (
              <motion.li
                key={reel.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <ReelCard reel={reel} mode="hover" meta="below" onOpen={() => open(list, list.indexOf(reel))} />
              </motion.li>
            ))}
            <motion.li key="cta" layout transition={{ duration: 0.55, ease: EASE }}>
              <a
                href="#contact"
                className="group relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-[1.1rem] border border-dashed border-white/20 p-5 transition-colors duration-500 hover:border-ember hover:bg-ember/5"
              >
                <span className="eyebrow text-smoke">Your brand?</span>
                <span>
                  <span className="title-lg block text-[clamp(1.9rem,3.4vw,3rem)]">
                    You could
                    <br />
                    be <span className="text-ember">next.</span>
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-ember">
                    Start a project <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </a>
            </motion.li>
          </AnimatePresence>
        </motion.ul>

        {list.length > limit && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="rounded-full border border-white/15 px-6 py-3 text-[14px] font-semibold transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Show more reels ({list.length - limit})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
