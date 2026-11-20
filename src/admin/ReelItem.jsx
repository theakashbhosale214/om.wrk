import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaCheck, FaExternalLinkAlt, FaStar, FaRegStar, FaTrash } from "react-icons/fa";
import { formatBytes } from "./api";

/** One reel in the admin list: poster, editable details, hero toggle, reorder, delete. */
export default function ReelItem({ reel, isFirst, isLast, busy, onSave, onToggleFeatured, onMove, onDelete }) {
  const [draft, setDraft] = useState({ title: reel.title, client: reel.client, category: reel.category });
  const [saved, setSaved] = useState(false);
  const dirty = draft.title !== reel.title || draft.client !== reel.client || draft.category !== reel.category;

  const save = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const ok = await onSave({ ...reel, ...draft });
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <li className={`flex gap-4 rounded-[1.25rem] border border-white/10 bg-graphite/50 p-3 transition-opacity md:gap-5 md:p-4 ${busy ? "pointer-events-none opacity-60" : ""}`}>
      <a href={reel.full} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[9/16] w-24 shrink-0 overflow-hidden rounded-lg bg-black md:w-28" title="Open the full video">
        <img src={reel.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <FaExternalLinkAlt className="h-3.5 w-3.5" />
        </span>
        {reel.featured && (
          <span className="eyebrow absolute left-1.5 top-1.5 rounded-full bg-ember px-1.5 py-0.5 !text-[8.5px] text-black">Hero</span>
        )}
      </a>

      <form onSubmit={save} className="flex min-w-0 flex-1 flex-col gap-3">
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          maxLength={80}
          aria-label="Title"
          className="field-input !mt-0 !py-2.5 text-[15px] font-semibold"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} maxLength={60} placeholder="Client" aria-label="Client" className="field-input !mt-0 !py-2.5 text-[14px]" />
          <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} maxLength={40} placeholder="Category" aria-label="Category" list="reel-categories" className="field-input !mt-0 !py-2.5 text-[14px]" />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {dirty && (
            <button type="submit" className="rounded-full bg-chalk px-4 py-2 text-[13px] font-semibold text-black hover:bg-ember">
              Save changes
            </button>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 text-[13px] text-ok" role="status">
              <FaCheck className="h-3 w-3" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={() => onToggleFeatured(reel)}
            aria-pressed={reel.featured}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-colors ${
              reel.featured ? "border-ember/50 bg-ember/10 text-ember" : "border-white/15 text-smoke hover:border-white/35 hover:text-chalk"
            }`}
          >
            {reel.featured ? <FaStar className="h-3 w-3" /> : <FaRegStar className="h-3 w-3" />}
            {reel.featured ? "In hero" : "Add to hero"}
          </button>

          <span className="ml-auto flex items-center gap-1.5">
            <button type="button" onClick={() => onMove(reel, -1)} disabled={isFirst} aria-label="Move up" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-white/40 disabled:opacity-30">
              <FaArrowUp className="h-3 w-3" />
            </button>
            <button type="button" onClick={() => onMove(reel, 1)} disabled={isLast} aria-label="Move down" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-white/40 disabled:opacity-30">
              <FaArrowDown className="h-3 w-3" />
            </button>
            <button type="button" onClick={() => onDelete(reel)} aria-label={`Delete ${reel.title}`} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-smoke hover:border-ember hover:bg-ember hover:text-black">
              <FaTrash className="h-3 w-3" />
            </button>
          </span>
        </div>
        {reel.bytes ? <p className="eyebrow !text-[9.5px] text-dim">Original: {formatBytes(reel.bytes)}</p> : null}
      </form>
    </li>
  );
}
