import { content } from "../data/content";
import SectionLabel from "./SectionLabel";
import { Reveal, SplitText } from "./Motion";

export default function Approach() {
  return (
    <section
      id="approach"
      tabIndex={-1}
      className="relative bg-forest px-5 py-24 text-bone sm:px-8 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-[1680px]">
        <SectionLabel index="04" label="Why Zoomify" aside="How we work" tone="light" />

        <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <SplitText
                text="Creative instinct. *Strategic* discipline."
                className="font-display text-[clamp(2.6rem,5.6vw,6rem)] leading-[0.95] tracking-[-0.04em]"
              />
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-sm text-[15.5px] leading-relaxed text-bone/60">
                  We combine creativity with strategy to deliver measurable results for your brand. Here&apos;s
                  what that looks like in practice.
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="md:col-span-6 md:col-start-7">
            {content.whyChooseUs.map((item, i) => (
              <Reveal as="li" key={item.title} y={32} className="group border-t border-bone/15 py-8 md:py-10">
                <div className="grid grid-cols-[3.25rem_1fr] gap-x-4 md:grid-cols-[4.5rem_1fr]">
                  <span className="pt-2 font-mono text-[11px] text-tomato">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.03em] transition-transform duration-700 ease-expo md:group-hover:translate-x-2">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-bone/60">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* process */}
        <div className="mt-24 md:mt-36">
          <div className="flex items-baseline justify-between gap-6 border-b border-bone/15 pb-6">
            <h3 className="font-display text-[clamp(1.9rem,3.4vw,3rem)] tracking-[-0.03em]">
              From brief to <em className="text-sage">growth</em>
            </h3>
            <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone/45 sm:inline">
              Four steps
            </span>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
            {content.process.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 0.08}
                className="relative border-b border-bone/15 py-8 pr-6 sm:[&:nth-child(2n)]:border-l sm:[&:nth-child(2n)]:pl-6 lg:border-b-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-bone/25 font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-8 font-display text-[1.75rem] tracking-[-0.025em]">{step.title}</h4>
                <p className="mt-2 max-w-[16rem] text-[14.5px] leading-relaxed text-bone/55">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
