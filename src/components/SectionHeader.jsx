import { Reveal, SplitText } from "./Motion";

/** "01 —— WORK" eyebrow, a film-title heading, and an optional intro on the right. */
export default function SectionHeader({ index, label, title, intro, children }) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
      <div className="md:col-span-8">
        <Reveal y={12}>
          <p className="eyebrow flex items-center gap-3 text-smoke">
            <span className="text-ember">{index}</span>
            <span aria-hidden="true" className="h-px w-10 bg-white/20" />
            {label}
          </p>
        </Reveal>
        <SplitText text={title} emClass="serif text-glow pr-[0.05em]" className="title-lg mt-5 text-[clamp(2.75rem,7.4vw,7rem)]" />
      </div>
      {(intro || children) && (
        <Reveal className="md:col-span-4" delay={0.1}>
          {intro && <p className="max-w-sm text-[16px] leading-relaxed text-smoke">{intro}</p>}
          {children}
        </Reveal>
      )}
    </div>
  );
}
