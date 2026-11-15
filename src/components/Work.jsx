import { content } from "../data/content";
import SectionLabel from "./SectionLabel";
import { Reveal, SplitText } from "./Motion";

export default function Work() {
  return (
    <section id="work" tabIndex={-1} className="relative bg-sage-soft px-5 py-24 sm:px-8 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1680px]">
        <SectionLabel index="03" label="Collaborations" aside="A few of the brands we grow with" />

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
          <SplitText
            text="Growing together with *200+* brands."
            className="font-display text-[clamp(2.6rem,7vw,7.25rem)] leading-[0.93] tracking-[-0.04em] md:col-span-8"
          />
          <Reveal className="md:col-span-3 md:col-start-10">
            <p className="text-[15px] leading-relaxed text-ink/65">
              Real estate and interiors, food and weddings, finance and farming. Different industries, same
              goal: be the brand people remember.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:mt-20 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
          {content.clients.map((client, i) => (
            <Reveal as="li" key={client.name} delay={(i % 5) * 0.06} y={24}>
              <figure className={`logo-tile ${client.dark ? "is-dark" : ""}`}>
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  decoding="async"
                  className="logo-img"
                />
                <figcaption className="tile-name">{client.name}</figcaption>
              </figure>
            </Reveal>
          ))}

          <Reveal as="li" delay={0.2} y={24} className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1">
            <a
              href="#contact"
              className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-[1.25rem] bg-tomato p-5 text-bone md:p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/75">
                Slot open
              </span>
              <span className="flex items-end justify-between gap-4">
                <span className="font-display text-[2rem] leading-[0.95] tracking-[-0.03em] md:text-[2.3rem]">
                  Your brand,
                  <br />
                  <em>next.</em>
                </span>
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bone text-tomato transition-transform duration-700 ease-expo group-hover:rotate-45"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
              </span>
            </a>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
