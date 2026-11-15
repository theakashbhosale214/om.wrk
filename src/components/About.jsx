import { content } from "../data/content";
import SectionLabel from "./SectionLabel";
import CountUp from "./CountUp";
import { Reveal, ScrollWords } from "./Motion";

export default function About() {
  return (
    <section id="about" tabIndex={-1} className="relative bg-bone px-5 py-24 sm:px-8 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1680px]">
        <SectionLabel index="01" label="About" aside="Who we are" />

        <ScrollWords
          text={content.about.statement}
          className="mt-12 max-w-[20ch] font-display text-[clamp(2.1rem,5.6vw,5.75rem)] leading-[1.02] tracking-[-0.035em] md:mt-16"
        />

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-4">
            <p className="max-w-sm text-[15.5px] leading-relaxed text-ink/65">{content.about.body}</p>
            <a
              href="#approach"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-tomato"
            >
              How we work <span aria-hidden="true">→</span>
            </a>
          </Reveal>

          <dl className="grid border-t border-ink/15 sm:grid-cols-3 md:col-span-7 md:col-start-6">
            {content.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.08}
                className="flex items-end justify-between gap-4 border-b border-ink/15 py-6 sm:flex-col-reverse sm:items-start sm:justify-end sm:border-b-0 sm:py-8 sm:pr-6 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-6"
              >
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/55 sm:mt-3">
                  {s.label}
                </dt>
                <dd className="font-display text-[3.25rem] leading-none tracking-[-0.04em] md:text-[4.5rem]">
                  <CountUp to={s.value} />
                  <span className="text-tomato">{s.suffix}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
