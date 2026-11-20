import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaFilm, FaTimes } from "react-icons/fa";
import { AuthError, formatBytes, signUpload, uploadVideo } from "./api";

const FREE_LIMIT = 100 * 1024 * 1024; // Cloudinary free plan: max video size
const DEFAULT_CATEGORIES = ["Interiors", "Real estate", "Food & cafés", "Events & weddings", "Brand film", "Ad film"];
const BLANK = { title: "", client: "", category: "", featured: true };

/** Drag-and-drop reel upload: file + details → signed direct upload to Cloudinary. */
export default function Uploader({ categories, onUploaded, onAuthError }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [meta, setMeta] = useState(BLANK);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | signing | uploading | done | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("That isn't a video file. Upload an MP4 or MOV.");
      return;
    }
    setError("");
    setPhase("idle");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!meta.title) setMeta((m) => ({ ...m, title: f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() }));
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setMeta(BLANK);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Choose a video first.");
    if (!meta.title.trim()) return setError("Give the reel a title.");
    setError("");
    setPhase("signing");
    try {
      const signed = await signUpload(meta);
      setPhase("uploading");
      abortRef.current = new AbortController();
      await uploadVideo(file, signed, setProgress, abortRef.current.signal);
      setPhase("done");
      reset();
      onUploaded();
    } catch (err) {
      if (err.name === "AbortError") {
        setPhase("idle");
        setProgress(0);
        return;
      }
      if (err instanceof AuthError) return onAuthError(err);
      setPhase("error");
      setError(
        /too large|file size/i.test(err.message)
          ? `${err.message}. Cloudinary's free plan accepts videos up to 100 MB: compress the file (e.g. with HandBrake) or upgrade the plan.`
          : err.message
      );
    }
  };

  const busy = phase === "signing" || phase === "uploading";
  const suggestions = [...new Set([...categories, ...DEFAULT_CATEGORIES])];

  return (
    <form onSubmit={submit} className="rounded-[1.5rem] border border-white/10 bg-graphite/60 p-5 md:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">Upload a reel</h2>
        <span className="eyebrow !text-[10px] text-smoke">MP4 / MOV · vertical works best</span>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,15rem)_1fr]">
        {/* drop zone / preview */}
        {file ? (
          <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-black ring-1 ring-white/10 md:max-h-[26rem]">
            <video src={preview} muted loop autoPlay playsInline className="h-full w-full object-cover" />
            {!busy && (
              <button type="button" onClick={reset} aria-label="Remove video" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-chalk hover:bg-black">
                <FaTimes className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
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
            className={`flex aspect-[9/16] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-5 text-center transition-colors md:max-h-[26rem] ${
              drag ? "border-ember bg-ember/10" : "border-white/15 hover:border-white/35 hover:bg-white/[0.03]"
            }`}
          >
            <FaCloudUploadAlt className="h-8 w-8 text-ember" />
            <span className="text-[15px] font-semibold">Drop a video here</span>
            <span className="text-[13px] text-smoke">or click to choose a file</span>
            <input ref={inputRef} type="file" accept="video/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
        )}

        {/* details */}
        <div className="flex flex-col gap-4">
          {file && (
            <p className="flex items-center gap-2 text-[13.5px] text-smoke">
              <FaFilm className="shrink-0 text-chalk" />
              <span className="truncate">{file.name}</span>
              <span className="shrink-0">· {formatBytes(file.size)}</span>
            </p>
          )}
          {file && file.size > FREE_LIMIT && (
            <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[13.5px] leading-relaxed text-amber-100">
              This file is over 100 MB. Cloudinary&apos;s free plan rejects videos that big. Compress it first (HandBrake, &quot;Fast 1080p30&quot;) or
              upgrade your Cloudinary plan, then try again.
            </p>
          )}
          <label className="block">
            <span className="field-label">Title *</span>
            <input value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} maxLength={80} placeholder="e.g. Site walkthrough, Kharadi" className="field-input" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Client</span>
              <input value={meta.client} onChange={(e) => setMeta({ ...meta, client: e.target.value })} maxLength={60} placeholder="e.g. Aariv Interiors" className="field-input" />
            </label>
            <label className="block">
              <span className="field-label">Category</span>
              <input value={meta.category} onChange={(e) => setMeta({ ...meta, category: e.target.value })} maxLength={40} list="reel-categories" placeholder="e.g. Interiors" className="field-input" />
              <datalist id="reel-categories">
                {suggestions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-[15px]">
            <input type="checkbox" checked={meta.featured} onChange={(e) => setMeta({ ...meta, featured: e.target.checked })} className="h-4 w-4 accent-[var(--color-ember)]" />
            Show in the homepage hero
          </label>

          {busy && (
            <div aria-live="polite">
              <div className="flex justify-between text-[13px] text-smoke">
                <span>{phase === "signing" ? "Preparing upload…" : "Uploading to Cloudinary…"}</span>
                <span className="tabular-nums">{Math.round(progress * 100)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-ember transition-[width] duration-300" style={{ width: `${Math.max(3, progress * 100)}%` }} />
              </div>
            </div>
          )}
          {phase === "done" && (
            <p className="rounded-lg border border-ok/30 bg-ok/10 px-3 py-2 text-[14px] text-green-100" role="status">
              Uploaded. Cloudinary is preparing the web versions; the reel shows on the site within a minute or two.
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-ember/40 bg-ember/10 px-3 py-2 text-[14px] leading-relaxed" role="alert">
              {error}
            </p>
          )}

          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={busy || !file}
              className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-[15px] font-semibold text-black transition-colors hover:bg-chalk disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCloudUploadAlt /> {busy ? "Uploading…" : "Upload reel"}
            </button>
            {phase === "uploading" && (
              <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-full border border-white/15 px-5 py-3 text-[14px] font-semibold hover:border-white/40">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
