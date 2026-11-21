import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { FiArrowUpRight, FiCheck, FiClock } from "react-icons/fi";
import { content } from "../data/content";
import { SELECT_SERVICE_EVENT } from "../lib/events";
import SectionHeader from "./SectionHeader";
import LogoMark from "./LogoMark";
import { Reveal } from "./Motion";

/*
  SERVICES — a bento grid. Each card carries a small live visual of the work:
  an edit timeline, a camera viewfinder, a content calendar, an ads chart and a
  brand sheet. Visuals are pure CSS/SVG, using poster frames from the reel library.
*/

const poster = (reels, i) => reels.length && reels[i % reels.length].poster;

/* 01 · Content creation — an edit timeline with a moving playhead. */
function EditorVisual({ reels }) {
  const clips = [28, 18, 24, 30];
  const bars = Array.from({ length: 64 }, (_, i) => 18 + Math.abs(Math.sin(i * 1.7) * 62 + Math.cos(i * 0.6) * 20));
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-4">
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="relative aspect-[9/16] h-full overflow-hidden rounded-lg bg-graphite">
          {poster(reels, 0) && <img src={poster(reels, 0)} alt="" loading="lazy" className="kenburns h-full w-full object-cover" />}
          <span className="absolute inset-x-2 top-[38%] rounded bg-black/70 px-1.5 py-1 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-chalk">
            Wait till you see <span className="text-ember">the kitchen</span>
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 font-mono text-[10px] text-smoke">
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
            <p className="text-ember">SCENE 01 · HOOK</p>
            <p className="mt-1 text-chalk/80">Walk in. Lights up. Reveal in 1.5s.</p>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
            <p className="text-chalk/60">SCENE 02 · STORY</p>
            <p className="mt-1 text-chalk/50">Storage, finishes, the before/after.</p>
          </div>
        </div>
      </div>
      {/* timeline */}
      <div className="relative rounded-lg border border-white/8 bg-black/50 p-2">
        <div className="mb-1.5 flex justify-between font-mono text-[8.5px] text-dim">
          {["00:00", "00:03", "00:06", "00:09", "00:12", "00:15"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="flex gap-0.5">
          {clips.map((w, i) => (
            <span key={i} className="h-7 overflow-hidden rounded-[3px] bg-graphite ring-1 ring-white/10" style={{ width: `${w}%` }}>
              {poster(reels, i) && <img src={poster(reels, i)} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" />}
            </span>
          ))}
        </div>
        <div className="mt-0.5 flex gap-0.5 text-[8px] font-bold uppercase tracking-wider">
          <span className="w-[22%] rounded-[3px] bg-ember px-1.5 py-1 text-black">Hook</span>
          <span className="w-[46%] rounded-[3px] bg-white/15 px-1.5 py-1 text-chalk/80">Story</span>
          <span className="w-[32%] rounded-[3px] bg-ember-soft/80 px-1.5 py-1 text-black">CTA</span>
        </div>
        <div className="mt-1 flex h-5 items-center justify-between">
          {bars.map((h, i) => (
            <span key={i} className="w-[2px] shrink-0 rounded-full bg-violet/70" style={{ height: `${Math.min(h, 100)}%` }} />
          ))}
        </div>
        <span aria-hidden="true" className="playhead absolute bottom-1 top-5 w-px bg-ember shadow-[0_0_10px_rgba(255,92,53,0.9)]">
          <span className="absolute -left-[4px] -top-1 h-2 w-[9px] rounded-sm bg-ember" />
        </span>
      </div>
    </div>
  );
}

/* 02 · Video production — viewfinder HUD with a running timecode. */
function Timecode() {
  const ref = useRef(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const f = Math.floor(((t - start) / 1000) * 25);
      const pad = (n) => String(n).padStart(2, "0");
      if (ref.current) ref.current.textContent = `00:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return (
    <span ref={ref} className="tabular-nums">
      00:00:00:00
    </span>
  );
}

function ViewfinderVisual({ reels }) {
  return (
    <div className="absolute inset-0">
      {poster(reels, 1) && <img src={poster(reels, 1)} alt="" loading="lazy" className="kenburns absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-4 font-mono text-[10px] uppercase tracking-wider text-chalk">
        {/* corner brackets */}
        {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-chalk/80 ${c}`} />
        ))}
        <div className="absolute left-3 right-3 top-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="blink h-2 w-2 rounded-full bg-[#ff3b30]" /> Rec
          </span>
          <Timecode />
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-5 rounded-[2px] border border-chalk/80 p-[1px]">
              <span className="block h-full w-3/4 bg-chalk" />
            </span>
          </span>
        </div>
        {/* focus box */}
        <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 border border-ember/90">
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember" />
        </span>
        {/* audio meters */}
        <div className="absolute bottom-9 left-3 flex h-10 items-end gap-1">
          {[0, 1].map((i) => (
            <span key={i} className="meter w-1.5 origin-bottom rounded-full bg-gradient-to-t from-ok via-ok to-[#facc15]" style={{ height: "100%", animationDelay: `${-i * 0.35}s` }} />
          ))}
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-chalk/85">
          <span>4K · 25P</span>
          <span>ISO 400</span>
          <span>ƒ/2.8</span>
          <span className="hidden sm:inline">1/50</span>
        </div>
      </div>
    </div>
  );
}

/* 03 · Social media management — the week's content calendar. */
function CalendarVisual({ reels }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const plan = [
    { type: "Reel", img: 0, done: true },
    null,
    { type: "Post", done: true, tint: "bg-ember/80" },
    { type: "Reel", img: 1, done: true },
    { type: "Story", tint: "bg-violet/70" },
    { type: "Reel", img: 2 },
    null,
  ];
  return (
    <div className="absolute inset-0 flex flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">This week</p>
        <p className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider text-smoke">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Posted
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#facc15]" /> Scheduled
          </span>
        </p>
      </div>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const p = plan[i];
          return (
            <div key={d} className="flex min-h-0 flex-col">
              <span className={`text-center font-mono text-[9px] uppercase ${i === 4 ? "text-ember" : "text-dim"}`}>{d}</span>
              <div className={`relative mt-1.5 flex-1 overflow-hidden rounded-md ${p ? "" : "border border-dashed border-white/10"} ${i === 4 ? "ring-1 ring-ember" : ""}`}>
                {p && (
                  <>
                    {p.img !== undefined && poster(reels, p.img) ? (
                      <img src={poster(reels, p.img)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <span className={`absolute inset-0 ${p.tint}`} />
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 pb-1 pt-3 text-[8px] font-semibold">{p.type}</span>
                    <span className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${p.done ? "bg-ok" : "bg-[#facc15]"}`} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2 text-[11.5px]">
        <FiClock className="h-3.5 w-3.5 text-ember" />
        <span className="text-chalk/85">Next up · Reel, today 6:30 PM</span>
      </div>
    </div>
  );
}

/* 04 · Performance marketing — campaign chart that draws itself. */
function ChartVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const line = "M0 118 C 30 112, 45 104, 70 100 S 110 92, 130 80 S 170 70, 190 56 S 230 40, 260 22";
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col p-4">
      <div className="flex flex-wrap gap-1.5">
        {["Meta Ads", "Google Ads"].map((n) => (
          <span key={n} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" /> {n} · Live
          </span>
        ))}
      </div>
      <div className="relative mt-3 min-h-0 flex-1">
        <svg viewBox="0 0 260 130" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="leads-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ff5c35" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ff5c35" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[26, 52, 78, 104].map((y) => (
            <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 4" />
          ))}
          <motion.path
            d={`${line} L260 130 L0 130 Z`}
            fill="url(#leads-fill)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#ff5c35"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <motion.span
          className="absolute right-0 top-[4%] flex items-center gap-1.5 rounded-lg bg-chalk px-2.5 py-1.5 text-[11px] font-semibold text-black shadow-xl"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <span className="h-2 w-2 rounded-full bg-ember" /> Leads ↑
        </motion.span>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-dim">
        <span>Week 1</span>
        <span>Week 4</span>
        <span>Week 8</span>
      </div>
    </div>
  );
}

/* 05 · Branding & design — a brand sheet. */
function BrandVisual() {
  const swatches = [
    { c: "#ff5c35", n: "Ember" },
    { c: "#f2f0eb", n: "Chalk" },
    { c: "#19191c", n: "Coal" },
    { c: "#6d5cff", n: "Violet" },
  ];
  return (
    <div className="absolute inset-0 grid grid-cols-[1.1fr_1fr] gap-3 p-4">
      <div className="relative grid place-items-center overflow-hidden rounded-lg border border-white/8 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]">
        <span className="absolute h-[78%] aspect-square rounded-full border border-dashed border-white/15" />
        <span className="absolute h-[48%] aspect-square rounded-full border border-white/10" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-ember/40" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-ember/40" />
        <LogoMark className="relative h-[46%] w-auto text-chalk transition-transform duration-700 ease-expo group-hover:scale-110" />
      </div>
      <div className="flex min-h-0 flex-col gap-2">
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {swatches.map((s) => (
            <span key={s.n} className="flex flex-col justify-end rounded-md p-1.5 ring-1 ring-white/10" style={{ background: s.c }}>
              <span className={`font-mono text-[8.5px] uppercase ${s.n === "Chalk" ? "text-black/70" : "text-white/80"}`}>{s.n}</span>
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between rounded-md border border-white/8 bg-white/[0.03] px-2.5 py-2">
          <span className="title-lg text-[1.9rem] normal-case leading-none">Aa</span>
          <span className="serif text-[1.9rem] leading-none text-ember">Aa</span>
        </div>
      </div>
    </div>
  );
}

const VISUALS = [EditorVisual, ViewfinderVisual, CalendarVisual, ChartVisual, BrandVisual];
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

function ServiceCard({ service, index, reels }) {
  const Visual = VISUALS[index % VISUALS.length];
  const enquire = () => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: service.title }));
  return (
    <Reveal delay={(index % 3) * 0.08} className={`${index === 0 ? "md:col-span-2" : ""} ${SPANS[index]}`}>
      <article className="glass edge group flex h-full flex-col rounded-[1.75rem] bg-white/[0.015] p-4 transition-colors duration-500 hover:bg-white/[0.04] md:p-5">
        <div aria-hidden="true" className="relative h-[15.5rem] overflow-hidden rounded-[1.25rem] border border-white/[0.06] bg-black/50 md:h-[17.5rem]">
          <Visual reels={reels} />
        </div>
        <div className="flex flex-1 flex-col px-2 pb-2 pt-6 md:px-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="title-lg text-[clamp(1.9rem,2.6vw,2.6rem)]">{service.title}</h3>
            <span className="mt-1 font-mono text-[12px] text-ember">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-smoke">{service.desc}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {service.tags.map((t) => (
              <li key={t} className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[12.5px] text-chalk/75">
                <FiCheck className="h-3 w-3 text-ember" />
                {t}
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={enquire} className="mt-auto inline-flex items-center gap-2 pt-6 text-[14.5px] font-semibold text-chalk transition-colors hover:text-ember">
            Enquire about this
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.07] transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-ember group-hover:text-black">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Services({ reels = [] }) {
  return (
    <section id="services" tabIndex={-1} className="relative overflow-hidden bg-coal px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_90%_0%,rgba(109,92,255,0.12),transparent_70%),radial-gradient(35%_30%_at_0%_60%,rgba(255,92,53,0.08),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1600px]">
        <SectionHeader
          index="02"
          label="Services"
          title="Everything a brand *needs to grow.*"
          intro="From the first script to the last ad rupee. Pick one service, or let one team run the whole show."
        />
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {content.services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} reels={reels} />
          ))}
        </div>
      </div>
    </section>
  );
}
