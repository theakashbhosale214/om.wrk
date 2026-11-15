/** "(01) — About ———————— Who we are" editorial section marker. */
export default function SectionLabel({ index, label, aside, tone = "dark", className = "" }) {
  const light = tone === "light";
  return (
    <div
      className={`flex items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.2em] ${
        light ? "text-bone/60" : "text-ink/55"
      } ${className}`}
    >
      <span className="text-tomato">({index})</span>
      <span>{label}</span>
      <span aria-hidden="true" className={`h-px flex-1 ${light ? "bg-bone/15" : "bg-ink/15"}`} />
      {aside && <span className="hidden sm:inline">{aside}</span>}
    </div>
  );
}
