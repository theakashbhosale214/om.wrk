import { content } from "../data/content";

/**
 * Slim "trusted by" strip. Logos sit on small uniform tiles (many of them have
 * coloured or illustrated backgrounds, so they can't be knocked out to white).
 * Greyscale until hovered, so they support the work instead of competing with it.
 */
export default function Clients() {
  const logos = content.clients;
  return (
    <section aria-label="Some of the brands we work with" className="border-y border-white/8 bg-black">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:gap-12 md:px-10">
        <p className="eyebrow shrink-0 text-smoke md:w-56">
          Trusted by <span className="text-chalk">200+</span> brands
        </p>
        <div className="edge-fade marquee-pause relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee" style={{ "--marquee-dur": "70s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-3 pr-3">
                {logos.map((c) => (
                  <li
                    key={c.name}
                    className={`group grid h-14 w-[7.5rem] shrink-0 place-items-center rounded-xl px-3 transition-colors duration-500 ${c.dark ? "bg-[#101012] ring-1 ring-white/10" : "bg-chalk"}`}
                  >
                    <img
                      src={c.logo}
                      alt={copy === 0 ? c.name : ""}
                      loading="lazy"
                      decoding="async"
                      className="max-h-10 w-auto max-w-full object-contain opacity-75 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
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
