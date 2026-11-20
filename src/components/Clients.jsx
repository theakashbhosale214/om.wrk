import { content } from "../data/content";

const LOGOS = content.clients.filter((c) => !c.dark);

/**
 * A quiet "trusted by" band: small greyscale logos drifting past.
 * Deliberately understated — social proof, not the main act.
 */
export default function Clients() {
  return (
    <section id="clients" tabIndex={-1} aria-label="Some of the brands we work with" className="relative border-y border-ink/10 bg-bone">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:gap-12 md:px-12 md:py-10">
        <div className="shrink-0 md:w-60">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink/50">Collaborations</p>
          <p className="mt-1.5 font-display text-[1.35rem] leading-tight tracking-[-0.02em]">
            Trusted by <em className="text-tomato">200+</em> growing brands
          </p>
        </div>

        <div className="logo-strip relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee" style={{ "--marquee-dur": "55s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16">
                {LOGOS.map((c) => (
                  <li key={c.name} className="shrink-0">
                    <img
                      src={c.logo}
                      alt={copy === 0 ? c.name : ""}
                      loading="lazy"
                      decoding="async"
                      className="h-7 w-auto max-w-[6.5rem] object-contain md:h-8"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
