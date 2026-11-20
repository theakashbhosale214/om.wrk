import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { content } from "../data/content";
import { useScrollProgress } from "../lib/useScrollProgress";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Motion";

/** Four steps on a line that fills as you scroll. */
export default function Process() {
  const ref = useRef(null);
  const progress = useScrollProgress({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const fill = useTransform(progress, [0, 1], [0, 1]);
  const steps = content.process;

  return (
    <section id="process" tabIndex={-1} className="relative bg-black px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader
          index="03"
          label="Process"
          title="Brief to *results,* in four steps."
          intro="A clear process, so you always know what's happening and why. No black boxes, no guesswork."
        />

        <div ref={ref} className="relative mt-16 md:mt-24">
          {/* the line: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute left-[1.15rem] top-0 h-full w-px bg-white/10 md:left-0 md:top-[1.15rem] md:h-px md:w-full" />
          <motion.span
            aria-hidden="true"
            className="absolute left-[1.15rem] top-0 h-full w-px origin-top bg-ember md:hidden"
            style={{ scaleY: fill }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-[1.15rem] hidden h-px w-full origin-left bg-ember md:block"
            style={{ scaleX: fill }}
          />

          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.1} className="relative pl-14 md:pl-0">
                <span className="absolute left-0 top-0 grid h-[2.3rem] w-[2.3rem] place-items-center rounded-full border border-white/15 bg-black font-mono text-[11px] text-chalk md:relative">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="title-lg mt-0 text-[clamp(2rem,3.2vw,3rem)] md:mt-10">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[15.5px] leading-relaxed text-smoke">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
