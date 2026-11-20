import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "../data/content";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Motion";

const EASE = [0.16, 1, 0.3, 1];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" tabIndex={-1} className="relative bg-black px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader index="05" label="FAQ" title="Good *questions.*">
          <p className="max-w-sm text-[16px] leading-relaxed text-smoke">
            Something else on your mind?{" "}
            <a href="#contact" className="font-semibold text-chalk underline decoration-ember decoration-2 underline-offset-4">
              Ask us directly.
            </a>
          </p>
        </SectionHeader>

        <Reveal className="mt-14 md:mt-20">
          <ul className="border-t border-white/10">
            {content.faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-b border-white/10">
                  <h3>
                    <button
                      type="button"
                      id={`faq-${i}-btn`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}-panel`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[5rem_1fr_auto] md:px-4 md:py-7"
                    >
                      <span className={`font-mono text-[12px] ${isOpen ? "text-ember" : "text-dim"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[clamp(1.15rem,2vw,1.6rem)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-ember">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300 ${
                          isOpen ? "border-ember bg-ember text-black" : "border-white/15"
                        }`}
                      >
                        <span className="absolute h-[1.5px] w-3.5 bg-current" />
                        <span className={`absolute h-3.5 w-[1.5px] bg-current transition-transform duration-500 ease-expo ${isOpen ? "scale-y-0" : ""}`} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}-panel`}
                        role="region"
                        aria-labelledby={`faq-${i}-btn`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-3xl pb-7 pl-[3.5rem] text-[16.5px] leading-relaxed text-smoke md:pl-[6rem]">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
