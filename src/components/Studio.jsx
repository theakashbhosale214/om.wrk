import { FiCheck } from "react-icons/fi";
import { content } from "../data/content";
import CountUp from "./CountUp";
import LogoMark from "./LogoMark";
import { Reveal, ScrollWords } from "./Motion";

/** About the studio: a statement that lights up as you scroll, the numbers, and why brands pick us. */
export default function Studio() {
  return (
    <section id="studio" tabIndex={-1} className="relative overflow-hidden bg-coal px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_35%_at_100%_100%,rgba(255,92,53,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1600px]">
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
        <dl className="mt-16 grid gap-4 sm:grid-cols-3 md:mt-24">
          {content.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="glass edge relative overflow-hidden rounded-[1.75rem] p-7 md:p-9">
              <span aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-ember/10 blur-3xl" />
              <dt className="eyebrow relative text-smoke">{s.label}</dt>
              <dd className="title-xl relative mt-10 text-[clamp(4rem,8vw,7.5rem)]">
                <CountUp to={s.value} />
                <span className="serif text-glow">{s.suffix}</span>
              </dd>
            </Reveal>
          ))}
        </dl>

        {/* body + why */}
        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <h3 className="title-lg text-[clamp(2.4rem,4vw,3.75rem)]">
              Creative instinct.
              <br />
              <span className="serif text-glow">Strategic</span> discipline.
            </h3>
            <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-smoke">{content.studio.body}</p>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember">
                <LogoMark className="h-6 w-auto text-black" a="#0a0a0b" b="#0a0a0b" />
              </span>
              <span className="text-[14px] leading-tight text-smoke">
                <span className="block font-semibold text-chalk">One team</span>
                strategy · shoots · edits · ads
              </span>
            </div>
          </Reveal>

          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {content.whyChooseUs.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={(i % 2) * 0.06}
                y={16}
                className={`glass rounded-[1.4rem] p-6 transition-colors duration-500 hover:border-white/20 ${i === content.whyChooseUs.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ember/15 text-ember">
                  <FiCheck className="h-4 w-4" strokeWidth={3} />
                </span>
                <p className="mt-5 text-[18px] font-semibold tracking-[-0.01em]">{item.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-smoke">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
