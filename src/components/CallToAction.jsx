import { content } from "../data/content";
import { Magnetic, SplitText } from "./Motion";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-tomato px-5 py-24 text-bone sm:px-8 md:px-12 md:py-32">
      {/* oversized ghost mark */}
      <svg
        aria-hidden="true"
        viewBox="0 0 268 320"
        className="pointer-events-none absolute -right-[8vw] -top-[10vw] h-[70vw] max-h-[52rem] w-auto opacity-[0.09] md:-right-[4vw]"
      >
        <path d="M136 0 L177 72 L83 233 L0 233 Z M177 72 L268 233 L183 233 L134 147 Z M135 147 L183 233 L135 320 L87 233 Z" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-[1680px]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone">Ready when you are</p>

        <div className="mt-8 grid items-end gap-12 lg:grid-cols-12">
          <SplitText
            text="Let's make your brand *zoom.*"
            emClass="italic text-ink"
            className="font-display text-[clamp(3.2rem,10vw,10.5rem)] leading-[0.88] tracking-[-0.045em] lg:col-span-9"
          />

          <div className="flex items-center gap-6 lg:col-span-3 lg:flex-col lg:items-end">
            <Magnetic>
              <a
                href="#contact"
                className="group relative grid h-36 w-36 place-items-center rounded-full bg-ink text-center text-bone md:h-44 md:w-44"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-bone transition-transform duration-700 ease-expo group-hover:scale-100" />
                <span className="relative text-[15px] font-medium leading-tight transition-colors duration-500 group-hover:text-ink">
                  Start a<br />project ↗
                </span>
              </a>
            </Magnetic>
            <a
              href={`https://wa.me/${content.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-bone underline decoration-bone/50 underline-offset-4 transition-colors hover:text-ink lg:text-right"
            >
              or WhatsApp us
              <br />
              {content.contact.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
