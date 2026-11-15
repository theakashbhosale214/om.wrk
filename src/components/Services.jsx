import { content } from "../data/content";
import SectionLabel from "./SectionLabel";
import { Reveal, SplitText } from "./Motion";
import { SELECT_SERVICE_EVENT } from "../lib/events";

function ServiceRow({ service, index }) {
  const [first, ...rest] = service.title.split(" ");
  const pick = () =>
    window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: service.title }));

  return (
    <Reveal as="li" delay={index * 0.05} y={20} className="border-b border-ink/15">
      <a
        href="#contact"
        onClick={pick}
        className="group relative block overflow-hidden"
        aria-label={`${service.title}: ${service.desc} Enquire about this service.`}
      >
        {/* tomato wash that rises on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-tomato transition-transform duration-700 ease-quart group-hover:scale-y-100"
        />

        <div className="relative grid grid-cols-12 items-start gap-x-4 gap-y-4 px-1 py-8 transition-colors duration-500 group-hover:text-bone md:items-center md:px-5 md:py-10">
          <span className="col-span-2 pt-2 font-mono text-[11px] text-ink/45 transition-colors duration-500 group-hover:text-bone/70 md:col-span-1 md:pt-0">
            ({String(index + 1).padStart(2, "0")})
          </span>

          <h3 className="col-span-10 font-display text-[clamp(2.1rem,5.4vw,5rem)] leading-[0.95] tracking-[-0.035em] transition-transform duration-700 ease-expo md:col-span-6 md:group-hover:translate-x-4">
            {first} {rest.length > 0 && <em>{rest.join(" ")}</em>}
          </h3>

          <div className="col-span-10 col-start-3 md:col-span-4 md:col-start-auto">
            <p className="max-w-sm text-[15px] leading-relaxed text-ink/65 transition-colors duration-500 group-hover:text-bone/85">
              {service.desc}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 transition-colors duration-500 group-hover:border-bone/30 group-hover:text-bone/80"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <span
            aria-hidden="true"
            className="col-span-1 hidden h-14 w-14 place-items-center justify-self-end rounded-full border border-ink/20 transition-all duration-700 ease-expo group-hover:rotate-45 group-hover:border-bone group-hover:bg-bone group-hover:text-tomato md:grid"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="services" tabIndex={-1} className="relative bg-bone px-5 pb-24 sm:px-8 md:px-12 md:pb-36">
      <div className="mx-auto max-w-[1680px]">
        <SectionLabel index="02" label="Services" aside="What we do" />

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
          <SplitText
            text="Five ways we make your brand *grow.*"
            className="font-display text-[clamp(2.6rem,7vw,7.25rem)] leading-[0.93] tracking-[-0.04em] md:col-span-8"
          />
          <Reveal className="md:col-span-3 md:col-start-10">
            <p className="text-[15px] leading-relaxed text-ink/65">
              Full-spectrum digital marketing, tailored to your brand. Pick one, or let us run the whole
              show.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 border-t border-ink/15 md:mt-20">
          {content.services.map((service, i) => (
            <ServiceRow key={service.title} service={service} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
