import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { Reveal, SplitText } from "./Motion";

const EASE = [0.16, 1, 0.3, 1];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" tabIndex={-1} className="relative bg-black px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal y={12}>
              <p className="eyebrow flex items-center gap-3 text-smoke">
                <span className="text-ember">05</span>
                <span aria-hidden="true" className="h-px w-10 bg-white/20" />
                FAQ
              </p>
            </Reveal>
            <SplitText text="Good *questions.*" emClass="serif text-glow pr-[0.05em]" className="title-lg mt-5 text-[clamp(2.75rem,5.6vw,5.5rem)]" />
            <Reveal delay={0.1}>
              <a
                href={`https://wa.me/${content.contact.whatsapp}?text=${encodeURIComponent("Hi Zoomify Media! I have a question.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group mt-10 flex max-w-sm items-center gap-4 rounded-2xl p-4 transition-colors hover:border-wa/40"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-wa text-black">
                  <FaWhatsapp className="h-5 w-5" />
                </span>
                <span className="text-[14.5px] leading-snug">
                  <span className="block font-semibold">Something else on your mind?</span>
                  <span className="text-smoke">Ask us on WhatsApp</span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>

        <ul className="flex flex-col gap-3 lg:col-span-8">
          {content.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={item.q} delay={i * 0.05} y={16} className={`overflow-hidden rounded-[1.4rem] border transition-colors duration-500 ${isOpen ? "border-white/15 bg-white/[0.045]" : "border-white/8 bg-white/[0.015] hover:border-white/15"}`}>
                <h3>
                  <button
                    type="button"
                    id={`faq-${i}-btn`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}-panel`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-5 px-5 py-5 text-left md:px-7 md:py-6"
                  >
                    <span className={`font-mono text-[12px] ${isOpen ? "text-ember" : "text-dim"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[clamp(1.1rem,1.7vw,1.4rem)] font-semibold tracking-[-0.02em]">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-500 ${isOpen ? "rotate-180 bg-ember text-black" : "bg-white/[0.07]"}`}
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
                      <p className="max-w-2xl pb-6 pl-[3.6rem] pr-6 text-[16px] leading-relaxed text-smoke md:pl-[4.6rem]">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
