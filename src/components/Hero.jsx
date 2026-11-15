import { useEffect, useRef } from "react";
import { content } from "../data/content";
import { formatIST, useNow } from "../lib/useNow";
import { prefersReducedMotion } from "../lib/smoothScroll";

/*
  THE ZOOM LENS
  ─────────────
  The hero is rendered twice, stacked in the same grid cell:
    1. the real, interactive layer (ink on bone)
    2. an inverted copy (bone on tomato), clipped to a circle that follows the cursor
       and scaled up around it — a magnifying glass over the page.
  Click to punch in. Scroll and the lens swallows the whole hero.
  On touch screens the lens drifts on its own; a tap pulls it to your finger.
*/

const RING_TEXT = "ZOOM IN ✦ CONTENT THAT CONVERTS ✦ ZOOMIFY MEDIA ✦ ZOOM IN ✦ CONTENT THAT CONVERTS ✦ ZOOMIFY MEDIA ✦ ";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function Clock() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now)} IST</span>;
}

function HeroLayer({ lens = false }) {
  const Title = lens ? "div" : "h1";
  const homeAttr = lens ? {} : { "data-lens-home": "" };

  return (
    <div
      className={`hero-layer ${lens ? "is-lens" : ""} relative flex min-h-[100svh] flex-col px-5 pb-7 pt-24 sm:px-8 md:px-12 md:pb-10 md:pt-28`}
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />

      {/* meta row */}
      <div
        className="fade-up relative flex items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--soft)]"
        style={{ "--i": 0 }}
      >
        <span>{content.hero.eyebrow}</span>
        <span className="hidden items-center gap-2.5 md:flex">
          <span className="live-dot" />
          {content.hero.status}
        </span>
        <span className="hidden sm:inline">
          India · <Clock />
        </span>
      </div>

      {/* headline */}
      <div className="relative mt-auto pt-16">
        <p
          className="fade-up mb-6 max-w-[19rem] font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-[var(--soft)] md:absolute md:right-0 md:top-16 md:mb-0 md:text-right"
          style={{ "--i": 2 }}
        >
          <span className="pointer-coarse:hidden">Move your cursor. Click to zoom.</span>
          <span className="hidden pointer-coarse:inline">Tap anywhere to zoom.</span>
          <br />
          Everything looks better up close.
        </p>

        <Title className="hero-title font-display">
          <span className="rise-line" style={{ "--i": 0 }}>
            <span>We make brands</span>
          </span>
          <span className="rise-line md:pl-[13vw]" style={{ "--i": 1 }}>
            <span>
              <em className="text-[var(--accent)]" {...homeAttr}>
                impossible
              </em>
            </span>
          </span>
          <span className="rise-line" style={{ "--i": 2 }}>
            <span>
              to scroll past<span className="text-[var(--accent)]">.</span>
            </span>
          </span>
        </Title>
      </div>

      {/* footer row */}
      <div className="relative mt-10 grid items-end gap-7 border-t border-[var(--line)] pt-6 md:mt-14 md:grid-cols-12 md:gap-6">
        <p
          className="fade-up max-w-md text-[15px] leading-relaxed text-[var(--soft)] md:col-span-5"
          style={{ "--i": 3 }}
        >
          {content.hero.subtitle}
        </p>

        <dl
          className="fade-up flex gap-10 md:col-span-3 md:col-start-6"
          style={{ "--i": 4 }}
        >
          {content.stats.slice(0, 2).map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--soft)]">
                {s.short}
              </dt>
              <dd className="font-display text-3xl tracking-tight md:text-4xl">
                {s.value.toLocaleString("en-IN")}
                <span className="text-[var(--accent)]">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div
          className="fade-up flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-4 md:justify-end"
          style={{ "--i": 5 }}
        >
          <a href="#contact" className="hero-btn-primary">
            Start a project
            <span className="arrow-dot" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
          </a>
          <a href="#work" className="hero-btn-ghost">
            See our work
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const ring = ringRef.current;
    if (!el || !ring) return;
    if (prefersReducedMotion()) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const introDelay =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro-delay")) || 0;

    let w = el.clientWidth;
    let h = el.clientHeight;
    let home = { x: w * 0.6, y: h * 0.6 };
    let baseR = 120;

    const measure = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      baseR = clamp(w * 0.11, 74, 168);
      // Rest the lens on "impossible". Offsets (not getBoundingClientRect) so the
      // headline's rise-in transform doesn't skew the measurement.
      const anchor = el.querySelector("[data-lens-home]");
      if (anchor) {
        let x = 0;
        let y = 0;
        let node = anchor;
        while (node && node !== el) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent;
        }
        if (node === el) {
          home = { x: x + anchor.offsetWidth * 0.58, y: y + anchor.offsetHeight * 0.55 };
        }
      }
    };
    measure();

    const pos = { ...home };
    const target = { ...home };
    let pointer = null; // last client coords while the mouse is over the hero
    let tapUntil = 0; // touch: hold the lens at the tap point until this time
    let r = 0;
    let pulse = 0;
    let opened = false;
    const start = performance.now();
    const openAt = start + (introDelay + 0.75) * 1000;

    const onPointerMove = (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") pointer = { x: e.clientX, y: e.clientY };
    };
    const onPointerLeave = (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") pointer = null;
    };
    const onPointerDown = (e) => {
      pulse = 1;
      if (e.pointerType === "touch") {
        const s = el.getBoundingClientRect();
        target.x = e.clientX - s.left;
        target.y = e.clientY - s.top;
        tapUntil = performance.now() + 2200;
      }
    };

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave, { passive: true });
    el.addEventListener("pointerdown", onPointerDown, { passive: true });

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);

    let frame = 0;
    let running = false;

    const tick = (now) => {
      const t = (now - start) / 1000;
      const rect = el.getBoundingClientRect();

      if (pointer) {
        target.x = pointer.x - rect.left;
        target.y = pointer.y - rect.top;
      } else if (now < tapUntil) {
        // keep the tap target
      } else if (!finePointer) {
        target.x = home.x + Math.sin(t * 0.42) * w * 0.24;
        target.y = home.y + Math.sin(t * 0.67 + 1.2) * Math.min(h * 0.12, 90);
      } else {
        target.x = home.x + Math.sin(t * 0.8) * 10;
        target.y = home.y + Math.cos(t * 0.6) * 8;
      }

      pos.x += (target.x - pos.x) * 0.13;
      pos.y += (target.y - pos.y) * 0.13;

      if (!opened && now >= openAt) opened = true;
      pulse *= 0.93;
      const rGoal = opened ? baseR * (1 + pulse * 0.55) : 0;
      r += (rGoal - r) * 0.1;

      // Scroll progress through the hero → lens grows to cover everything.
      const p = clamp(-rect.top / (h * 0.62), 0, 1);
      const e = p * p;
      const farthest = Math.max(
        Math.hypot(pos.x, pos.y),
        Math.hypot(w - pos.x, pos.y),
        Math.hypot(pos.x, h - pos.y),
        Math.hypot(w - pos.x, h - pos.y)
      );
      const radius = r + (farthest + 40 - r) * e;
      const zoomBase = 1.32 + pulse * 0.28;
      const zoom = zoomBase + (1 - zoomBase) * e;

      el.style.setProperty("--lx", `${pos.x.toFixed(1)}px`);
      el.style.setProperty("--ly", `${pos.y.toFixed(1)}px`);
      el.style.setProperty("--lr", `${radius.toFixed(1)}px`);
      el.style.setProperty("--lz", zoom.toFixed(4));

      const ringScale = (r + 16) / 138;
      ring.style.transform = `translate3d(${pos.x - 150}px, ${pos.y - 150}px, 0) scale(${ringScale.toFixed(4)})`;
      ring.style.opacity = String(clamp((r / baseR) * (1 - e * 3), 0, 1));

      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          frame = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} tabIndex={-1} className="hero relative isolate overflow-hidden bg-bone">
      <div className="hero-stack">
        <HeroLayer />
        <div className="lens-clip" aria-hidden="true" inert>
          <div className="lens-zoom">
            <HeroLayer lens />
          </div>
        </div>
      </div>

      {/* rotating caption ring around the lens */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="lens-ring pointer-events-none absolute left-0 top-0 z-10 hidden h-[300px] w-[300px] text-ink md:block"
        style={{ opacity: 0 }}
      >
        <svg viewBox="0 0 300 300" className="ring-spin h-full w-full overflow-visible">
          <defs>
            <path id="lens-ring-path" d="M150,150 m-138,0 a138,138 0 1,1 276,0 a138,138 0 1,1 -276,0" />
          </defs>
          <text fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="2" fill="currentColor">
            <textPath href="#lens-ring-path" textLength="860" lengthAdjust="spacing">
              {RING_TEXT}
            </textPath>
          </text>
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-bone"
        >
          <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </div>
    </section>
  );
}
