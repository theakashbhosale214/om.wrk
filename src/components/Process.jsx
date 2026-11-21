import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { content } from "../data/content";
import { Reveal, SplitText } from "./Motion";

/** Four steps as cards that stack on top of each other as you scroll. */
export default function Process() {
  const steps = content.process;

  return (
    <section id="process" tabIndex={-1} className="relative bg-black px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal y={12}>
              <p className="eyebrow flex items-center gap-3 text-smoke">
                <span className="text-ember">03</span>
                <span aria-hidden="true" className="h-px w-10 bg-white/20" />
                Process
              </p>
            </Reveal>
            <SplitText text="Brief to *results,* in four steps." emClass="serif text-glow pr-[0.05em]" className="title-lg mt-5 text-[clamp(2.75rem,5.6vw,5.5rem)]" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-smoke">
                A clear process, so you always know what&apos;s happening and why. No black boxes, no guesswork.
              </p>
              <a href="#contact" className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-chalk transition-colors hover:text-ember">
                Book an intro call
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.07] transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-ember group-hover:text-black">
                  <FiArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Reveal>
          </div>
        </div>

        <ol className="flex flex-col gap-5 lg:col-span-8">
          {steps.map((step, i) => (
            <li key={step.title} className="sticky" style={{ top: `calc(6.5rem + ${i * 1.4}rem)` }}>
              <article className="edge relative overflow-hidden rounded-[2rem] bg-graphite p-6 shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.9)] sm:p-9 md:p-11">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[13rem] font-extrabold leading-none text-white/[0.035] [font-stretch:68%] md:text-[17rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-2.5 text-ember">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-ember text-[11px] font-semibold text-black">{i + 1}</span>
                    Step {i + 1} of {steps.length}
                  </span>
                  <span aria-hidden="true" className="hidden gap-1 sm:flex">
                    {steps.map((_, k) => (
                      <span key={k} className={`h-1 w-6 rounded-full ${k <= i ? "bg-ember" : "bg-white/12"}`} />
                    ))}
                  </span>
                </div>
                <div className="relative mt-10 grid gap-8 md:mt-14 md:grid-cols-2 md:items-end">
                  <div>
                    <h3 className="title-xl text-[clamp(3rem,6vw,5.75rem)]">{step.title}</h3>
                    <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-smoke">{step.text}</p>
                  </div>
                  <ul className="flex flex-col gap-2 md:items-end">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 py-2 pl-2 pr-4 text-[14px] text-chalk/85">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-ember/15 text-ember">
                          <FiCheck className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
