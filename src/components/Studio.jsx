import { FaCheck } from "react-icons/fa";
import { content } from "../data/content";
import CountUp from "./CountUp";
import { Reveal, ScrollWords } from "./Motion";

/** About the studio: a statement that lights up as you scroll, the numbers, and why brands pick us. */
export default function Studio() {
  return (
    <section id="studio" tabIndex={-1} className="relative bg-coal px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <Reveal y={12}>
          <p className="eyebrow flex items-center gap-3 text-smoke">
            <span className="text-ember">04</span>
            <span aria-hidden="true" className="h-px w-10 bg-white/20" />
            Studio
          </p>
        </Reveal>

        <ScrollWords
          text={content.studio.statement}
          className="mt-8 max-w-[24ch] text-[clamp(2rem,4.6vw,4.4rem)] font-semibold leading-[1.06] tracking-[-0.03em]"
        />

        {/* numbers */}
        <dl className="mt-16 grid border-y border-white/10 sm:grid-cols-3 md:mt-24">
          {content.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="flex items-baseline justify-between gap-4 border-b border-white/10 py-7 last:border-b-0 sm:flex-col sm:items-start sm:border-b-0 sm:py-10 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-8"
            >
              <dd className="title-xl order-1 text-[clamp(3.5rem,8vw,7.5rem)] sm:order-none">
                <CountUp to={s.value} />
                <span className="text-ember">{s.suffix}</span>
              </dd>
              <dt className="eyebrow text-smoke sm:mt-3">{s.label}</dt>
            </Reveal>
          ))}
        </dl>

        {/* body + why */}
        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <h3 className="title-lg text-[clamp(2rem,3.6vw,3.25rem)]">
              Creative instinct.
              <br />
              <span className="text-ember">Strategic</span> discipline.
            </h3>
            <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-smoke">{content.studio.body}</p>
          </Reveal>

          <ul className="lg:col-span-6 lg:col-start-7">
            {content.whyChooseUs.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.06} y={16} className="flex gap-5 border-t border-white/10 py-6 last:border-b">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ember/15 text-ember">
                  <FaCheck className="h-3 w-3" />
                </span>
                <div>
                  <p className="text-[18px] font-semibold tracking-[-0.01em]">{item.title}</p>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-smoke">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
