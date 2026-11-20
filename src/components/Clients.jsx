import { content } from "../data/content";

/** Slim "trusted by" strip: small white logo marks drifting past. Social proof, not the main act. */
export default function Clients() {
  const logos = content.clients;
  return (
    <section aria-label="Some of the brands we work with" className="border-y border-white/8 bg-black">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:gap-12 md:px-10 md:py-9">
        <p className="eyebrow shrink-0 text-smoke md:w-56">
          Trusted by <span className="text-chalk">200+</span> brands
        </p>
        <div className="edge-fade relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee" style={{ "--marquee-dur": "60s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-14 pr-14">
                {logos.map((c) => (
                  <li key={c.name} className="shrink-0">
                    <img
                      src={c.logo}
                      alt={copy === 0 ? c.name : ""}
                      loading="lazy"
                      decoding="async"
                      className={`h-8 w-auto max-w-[6.5rem] object-contain md:h-9 ${c.dark ? "logo-dark" : "logo-invert"}`}
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
