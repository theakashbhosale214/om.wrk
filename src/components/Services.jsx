import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "../data/content";
import { SELECT_SERVICE_EVENT } from "../lib/events";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Motion";

const EASE = [0.16, 1, 0.3, 1];

function ServiceRow({ service, index, open, onToggle }) {
  const id = `service-${index}`;
  const enquire = () => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: service.title }));

  return (
    <li className={`border-b border-white/10 transition-colors duration-500 ${open ? "bg-white/[0.025]" : ""}`}>
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[5rem_1fr_auto] md:px-4 md:py-9"
        >
          <span className={`font-mono text-[12px] transition-colors duration-300 ${open ? "text-ember" : "text-dim group-hover:text-ember"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="title-lg text-[clamp(1.9rem,5.2vw,4.75rem)] transition-transform duration-500 ease-expo group-hover:translate-x-2">
            {service.title}
          </span>
          <span
            aria-hidden="true"
            className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500 md:h-14 md:w-14 ${
              open ? "border-ember bg-ember text-black" : "border-white/15 text-chalk group-hover:border-white/40"
            }`}
          >
            <span className="absolute h-[1.5px] w-4 bg-current" />
            <span className={`absolute h-4 w-[1.5px] bg-current transition-transform duration-500 ease-expo ${open ? "scale-y-0" : ""}`} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pb-9 pl-[3.5rem] md:grid-cols-12 md:pl-[6rem] md:pr-4">
              <p className="max-w-lg text-[17px] leading-relaxed text-smoke md:col-span-6">{service.desc}</p>
              <div className="md:col-span-6 md:flex md:flex-col md:items-end">
                <ul className="flex flex-wrap gap-2 md:justify-end">
                  {service.tags.map((t) => (
                    <li key={t} className="eyebrow rounded-full border border-white/12 px-3 py-1.5 !text-[10px] text-chalk/75">
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={enquire}
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ember transition-colors hover:text-chalk"
                >
                  Enquire about {service.title.toLowerCase()} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" tabIndex={-1} className="relative bg-coal px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader
          index="02"
          label="Services"
          title="Everything a brand *needs to grow.*"
          intro="From the first script to the last ad rupee. Pick one service, or let us run the whole show."
        />
        <Reveal className="mt-14 md:mt-20">
          <ul className="border-t border-white/10">
            {content.services.map((s, i) => (
              <ServiceRow key={s.title} service={s} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
