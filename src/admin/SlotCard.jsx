import { forwardRef, useEffect, useRef, useState } from "react";
import { FaCheck, FaCloudUploadAlt, FaExchangeAlt, FaPlay, FaTimes, FaTrash } from "react-icons/fa";
import { AuthError, formatBytes, signUpload, uploadVideo } from "./api";
import { FREE_LIMIT, SLOTS } from "./slots";

const titleFromFile = (f) => f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim().slice(0, 80);

/**
 * Pick a file → add a title → upload. Used for an empty spot and for "Replace video".
 * When replacing, the old video is deleted only after the new one has uploaded.
 */
function SlotUploader({ slot, replacing, onDone, onCancel, onAuthError }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [meta, setMeta] = useState({ title: "", client: "" });
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | signing | uploading | finishing
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) return setError("That isn't a video. Choose an MP4 or MOV file.");
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMeta((m) => (m.title ? m : { ...m, title: titleFromFile(f) }));
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!meta.title.trim()) return setError("Give the video a title.");
    setError("");
    setPhase("signing");
    try {
      const signed = await signUpload({ ...meta, slot });
      setPhase("uploading");
      abortRef.current = new AbortController();
      await uploadVideo(file, signed, setProgress, abortRef.current.signal);
      setPhase("finishing");
      await onDone();
    } catch (err) {
      if (err.name === "AbortError") {
        setPhase("idle");
        setProgress(0);
        return;
      }
      if (err instanceof AuthError) return onAuthError(err);
      setPhase("idle");
      setError(
        /too large|file size/i.test(err.message)
          ? `${err.message}. Cloudinary's free plan takes videos up to 100 MB. Compress it (HandBrake, "Fast 1080p30") and try again.`
          : err.message
      );
    }
  };

  const busy = phase !== "idle";

  if (!file) {
    return (
      <div className="flex flex-col gap-3">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          className={`flex min-h-[11rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors ${
            drag ? "border-ember bg-ember/10" : "border-white/15 hover:border-white/35 hover:bg-white/[0.03]"
          }`}
        >
          <FaCloudUploadAlt className="h-7 w-7 text-ember" />
          <span className="text-[15px] font-semibold">{replacing ? "Drop the new video here" : "Drop a video here"}</span>
          <span className="text-[13px] text-smoke">or click to choose · MP4 or MOV, vertical, up to 100 MB</span>
          <input ref={inputRef} type="file" accept="video/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        {error && <Alert>{error}</Alert>}
        {replacing && (
          <button type="button" onClick={onCancel} className="self-start text-[13.5px] text-smoke underline-offset-4 hover:text-chalk hover:underline">
            Keep the current video
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-4">
      <div className="relative aspect-[9/16] w-24 shrink-0 overflow-hidden rounded-lg bg-black ring-1 ring-white/10 md:w-28">
        <video src={preview} muted loop autoPlay playsInline className="h-full w-full object-cover" />
        {!busy && (
          <button type="button" onClick={clear} aria-label="Choose a different file" className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/70 hover:bg-black">
            <FaTimes className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="truncate text-[12.5px] text-smoke">
          {file.name} · {formatBytes(file.size)}
        </p>
        {file.size > FREE_LIMIT && (
          <Alert tone="warn">Over 100 MB: Cloudinary&apos;s free plan will reject it. Compress it first (HandBrake, &quot;Fast 1080p30&quot;).</Alert>
        )}
        <Field label="Title" value={meta.title} onChange={(v) => setMeta({ ...meta, title: v })} max={80} placeholder="e.g. Site walkthrough, Kharadi" disabled={busy} />
        <Field label="Client (optional)" value={meta.client} onChange={(v) => setMeta({ ...meta, client: v })} max={60} placeholder="e.g. Aariv Interiors" disabled={busy} />

        {busy ? (
          <div aria-live="polite">
            <div className="flex justify-between text-[13px] text-smoke">
              <span>{phase === "signing" ? "Getting ready…" : phase === "uploading" ? "Uploading…" : "Almost done…"}</span>
              <span className="tabular-nums">{Math.round(progress * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-ember transition-[width] duration-300" style={{ width: `${Math.max(3, progress * 100)}%` }} />
            </div>
            {phase === "uploading" && (
              <button type="button" onClick={() => abortRef.current?.abort()} className="mt-3 text-[13px] text-smoke underline-offset-4 hover:text-chalk hover:underline">
                Cancel upload
              </button>
            )}
          </div>
        ) : (
          <>
            {error && <Alert>{error}</Alert>}
            {replacing && <p className="text-[12.5px] leading-relaxed text-smoke">The current video is deleted once this one has uploaded.</p>}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-[14px] font-semibold text-black transition-colors hover:bg-chalk">
                <FaCloudUploadAlt /> {replacing ? "Upload & replace" : "Upload to spot " + slot}
              </button>
              <button type="button" onClick={replacing ? onCancel : clear} className="rounded-full px-4 py-2.5 text-[14px] text-smoke hover:text-chalk">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, max, placeholder, disabled }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} placeholder={placeholder} disabled={disabled} className="field-input !mt-1.5 !py-2.5 text-[14.5px]" />
    </label>
  );
}

function Alert({ children, tone = "error" }) {
  return (
    <p
      role="alert"
      className={`rounded-lg border px-3 py-2 text-[13.5px] leading-relaxed ${
        tone === "warn" ? "border-amber-400/30 bg-amber-400/10 text-amber-100" : "border-ember/40 bg-ember/10"
      }`}
    >
      {children}
    </p>
  );
}

/** Saved details of the video in a spot, editable in place. */
function SlotDetails({ reel, onSave }) {
  const [draft, setDraft] = useState({ title: reel.title, client: reel.client });
  const [saved, setSaved] = useState(false);
  const dirty = draft.title !== reel.title || draft.client !== reel.client;

  const save = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    if (await onSave({ ...reel, ...draft })) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <form onSubmit={save} className="flex min-w-0 flex-1 flex-col gap-3">
      <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} max={80} />
      <Field label="Client (optional)" value={draft.client} onChange={(v) => setDraft({ ...draft, client: v })} max={60} />
      {(dirty || saved) && (
        <div className="flex items-center gap-3">
          {dirty && (
            <>
              <button type="submit" disabled={!draft.title.trim()} className="rounded-full bg-chalk px-4 py-2 text-[13px] font-semibold text-black hover:bg-ember disabled:opacity-50">
                Save
              </button>
              <button type="button" onClick={() => setDraft({ title: reel.title, client: reel.client })} className="text-[13px] text-smoke hover:text-chalk">
                Undo
              </button>
            </>
          )}
          {saved && (
            <span role="status" className="flex items-center gap-1.5 text-[13px] text-ok">
              <FaCheck className="h-3 w-3" /> Saved
            </span>
          )}
        </div>
      )}
    </form>
  );
}

/** One of the four homepage spots. */
const SlotCard = forwardRef(function SlotCard({ slot, reel, active, busy, onHover, onSave, onMove, onRemove, onUploaded, onAuthError }, ref) {
  const [replacing, setReplacing] = useState(false);
  const { n, name, where, note } = slot;

  const done = async () => {
    if (replacing && reel) await onRemove(reel, { silent: true });
    setReplacing(false);
    await onUploaded();
  };

  return (
    <li
      ref={ref}
      tabIndex={-1}
      onPointerEnter={() => onHover(n)}
      onPointerLeave={() => onHover(null)}
      onFocusCapture={() => onHover(n)}
      className={`flex flex-col gap-4 rounded-[1.25rem] border bg-graphite/50 p-4 outline-none transition-[border-color,opacity,box-shadow] duration-300 md:p-5 ${
        active ? "border-ember/60 shadow-[0_0_0_4px_rgba(255,92,53,0.12)]" : "border-white/10"
      } ${busy ? "pointer-events-none opacity-60" : ""}`}
    >
      <header className="flex items-start gap-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-bold ${reel ? "bg-ember text-black" : "border border-dashed border-white/25 text-smoke"}`}>
          {n}
        </span>
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold leading-tight">
            {name} {!reel && <span className="ml-1 rounded-full bg-white/8 px-2 py-0.5 align-middle text-[11px] font-medium text-smoke">Empty</span>}
          </h3>
          <p className="mt-0.5 text-[13px] leading-snug text-smoke">
            {where}
            {note && <span className="block text-dim">{note}</span>}
          </p>
        </div>
      </header>

      {!reel || replacing ? (
        <SlotUploader key={replacing ? "replace" : "new"} slot={n} replacing={replacing} onDone={done} onCancel={() => setReplacing(false)} onAuthError={onAuthError} />
      ) : (
        <>
          <div className="flex gap-4">
            <a href={reel.full} target="_blank" rel="noopener noreferrer" title="Watch the full video" className="group relative block aspect-[9/16] w-24 shrink-0 overflow-hidden rounded-lg bg-black md:w-28">
              <img src={reel.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-chalk text-black">
                  <FaPlay className="ml-0.5 h-3 w-3" />
                </span>
              </span>
            </a>
            <SlotDetails key={reel.id} reel={reel} onSave={onSave} />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
            <button type="button" onClick={() => setReplacing(true)} className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[13px] hover:border-white/40">
              <FaCloudUploadAlt className="h-3.5 w-3.5" /> Replace video
            </button>
            <MoveSelect current={n} onMove={(to) => onMove(reel, to)} />
            <button
              type="button"
              onClick={() => onRemove(reel)}
              className="ml-auto flex items-center gap-2 rounded-full px-3 py-2 text-[13px] text-smoke hover:bg-ember/10 hover:text-ember"
            >
              <FaTrash className="h-3 w-3" /> Remove
            </button>
          </div>
        </>
      )}
    </li>
  );
});

export default SlotCard;

/** "Move to spot…" — swaps with whatever is in the target spot. */
export function MoveSelect({ current = 0, onMove, label = "Move to" }) {
  return (
    <label className="relative flex items-center gap-2 rounded-full border border-white/15 py-2 pl-3.5 pr-3 text-[13px] focus-within:border-white/40 hover:border-white/40">
      <FaExchangeAlt className="h-3 w-3 text-smoke" />
      <span className="sr-only">{label}</span>
      <select
        value=""
        onChange={(e) => e.target.value && onMove(Number(e.target.value))}
        className="field-sizing-content max-w-[11rem] cursor-pointer appearance-none truncate bg-transparent pr-1 outline-none"
      >
        <option value="">{label}…</option>
        {SLOTS.filter((s) => s.n !== current).map((s) => (
          <option key={s.n} value={s.n} className="bg-graphite">
            Spot {s.n} · {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
