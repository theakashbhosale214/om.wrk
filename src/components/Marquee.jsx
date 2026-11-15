import { content } from "../data/content";

function Star({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

/** Ink band of services that scrolls forever. Decorative — services are listed properly below. */
export default function Marquee() {
  const items = content.services.map((s) => s.title);
  const run = [...items, ...items];

  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-ink py-5 text-bone md:py-7">
      <div className="marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((title, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span
                  className={`whitespace-nowrap px-6 font-display text-[2rem] leading-none tracking-[-0.03em] md:px-10 md:text-[3.25rem] ${
                    i % 2 ? "italic text-sage" : ""
                  }`}
                >
                  {title}
                </span>
                <Star className="h-4 w-4 shrink-0 text-tomato md:h-5 md:w-5" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
