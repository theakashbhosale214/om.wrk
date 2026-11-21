import { FaPlus } from "react-icons/fa";
import { SLOTS } from "./slots";

/**
 * A miniature of the homepage hero with the four phones where they really sit,
 * each showing the video in that spot. Hovering a spot card lights up its phone;
 * clicking a phone jumps to its card.
 */
export default function SitePreview({ bySlot, active, onHover, onPick }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
        {/* browser bar */}
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-coal px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-3 rounded-md bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-dim">om.wrk · homepage</span>
        </div>

        <div className="relative aspect-[16/10] bg-[radial-gradient(55%_48%_at_50%_0%,rgba(255,92,53,0.22),transparent_72%)]">
          {/* headline placeholder */}
          <div aria-hidden="true" className="absolute inset-x-[30%] top-[34%] flex flex-col items-center gap-[6%]">
            <span className="h-[0.55rem] w-[36%] rounded-full bg-white/10" />
            <span className="h-3 w-full rounded-full bg-white/20" />
            <span className="h-3 w-[86%] rounded-full bg-white/20" />
            <span className="mt-1 h-[0.4rem] w-[70%] rounded-full bg-white/8" />
            <span className="mt-1 flex w-[60%] gap-2">
              <span className="h-3 flex-1 rounded-full bg-ember/60" />
              <span className="h-3 flex-1 rounded-full bg-white/12" />
            </span>
          </div>

          {SLOTS.map(({ n, pos }) => {
            const reel = bySlot[n];
            const on = active === n;
            const { rotate, ...place } = pos;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onPick(n)}
                onPointerEnter={() => onHover(n)}
                onPointerLeave={() => onHover(null)}
                aria-label={`Spot ${n}${reel ? `: ${reel.title}` : ": empty"}`}
                style={{ ...place, rotate: `${rotate}deg` }}
                className={`absolute aspect-[9/19] overflow-hidden rounded-[14%/7%] border-2 bg-graphite transition-[scale,border-color,box-shadow] duration-300 ${
                  on ? "z-10 scale-110 border-ember shadow-[0_0_0_4px_rgba(255,92,53,0.25)]" : "border-white/20 hover:border-white/50"
                }`}
              >
                {reel ? (
                  <img src={reel.poster} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center border border-dashed border-white/10 text-dim">
                    <FaPlus className="h-[18%] w-[18%]" />
                  </span>
                )}
                <span className="absolute left-1/2 top-[6%] grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-ember text-[11px] font-bold text-black shadow">
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-smoke">
        This is the top of your homepage. The numbers match the spots below. On phones, the four videos take turns in a fan of three.
      </figcaption>
    </figure>
  );
}
