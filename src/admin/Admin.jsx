import { useCallback, useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt, FaLock, FaSignOutAlt, FaSyncAlt, FaTrash } from "react-icons/fa";
import LogoMark from "../components/LogoMark";
import { AuthError, clearToken, deleteReel, getToken, listReels, login, updateReel } from "./api";
import SitePreview from "./SitePreview";
import SlotCard, { MoveSelect } from "./SlotCard";
import { SLOTS } from "./slots";

/*
  /admin — the homepage videos.
  The site shows four videos, each in a fixed spot (see slots.js). Sign in with
  ADMIN_PASSWORD, then fill, replace, rename, move or remove the video in each spot.
  Uploads go straight to Cloudinary. The site reads /api/reels (cached ~1 minute).
*/

function useNoIndex() {
  useEffect(() => {
    document.title = "Admin · om.wrk";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onLogin(await login(password));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-svh place-items-center bg-black px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-graphite/60 p-7 md:p-9">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-10 w-auto text-chalk" title="om.wrk" />
        </div>
        <h1 className="title-lg mt-8 text-[2.75rem]">Website videos</h1>
        <p className="mt-2 text-[15px] text-smoke">Sign in to change the videos on your homepage.</p>
        <label className="mt-7 block">
          <span className="field-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
            className="field-input"
          />
        </label>
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-ember/40 bg-ember/10 px-3 py-2 text-[14px]">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember py-3 text-[15px] font-semibold text-black transition-colors hover:bg-chalk disabled:opacity-60"
        >
          <FaLock className="h-3.5 w-3.5" /> {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="mt-5 block text-center text-[13.5px] text-smoke hover:text-chalk">
          ← Back to the website
        </a>
      </form>
    </main>
  );
}

function SetupGuide({ missing }) {
  return (
    <div className="rounded-[1.5rem] border border-amber-400/30 bg-amber-400/[0.06] p-6 md:p-8">
      <h2 className="text-xl font-semibold">Connect Cloudinary to start uploading</h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-smoke">
        Reels are stored and compressed by Cloudinary. Until it&apos;s connected, the website shows the three built-in videos.
      </p>
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed">
        <li>
          Create a free account at{" "}
          <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noopener noreferrer" className="text-ember underline">
            cloudinary.com
          </a>
          .
        </li>
        <li>Copy your Cloud name, API key and API secret from the Cloudinary dashboard.</li>
        <li>In Vercel → your project → Settings → Environment Variables, add them, then redeploy.</li>
      </ol>
      <p className="eyebrow mt-5 text-smoke">Missing right now</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {missing.map((m) => (
          <li key={m} className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-[12.5px] text-amber-100">
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [reels, setReels] = useState([]);
  const [state, setState] = useState({ loading: true, configured: true, missing: [], error: "" });
  const [busyId, setBusyId] = useState(null);
  const [hover, setHover] = useState(null);
  const cardRefs = useRef({});

  const handle = useCallback(
    (err) => {
      if (err instanceof AuthError) onLogout();
      else setState((s) => ({ ...s, error: err.message }));
    },
    [onLogout]
  );

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await listReels();
      setReels(data.reels || []);
      setState({ loading: false, configured: data.configured !== false, missing: data.missing || [], error: "" });
    } catch (err) {
      setState((s) => ({ ...s, loading: false }));
      handle(err);
    }
  }, [handle]);

  useEffect(() => {
    // Initial fetch of the reel list; load() owns the loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const bySlot = Object.fromEntries(reels.filter((r) => r.slot > 0).map((r) => [r.slot, r]));
  const extras = reels.filter((r) => !r.slot);
  const filled = Object.keys(bySlot).length;

  const save = async (reel) => {
    setBusyId(reel.id);
    try {
      await updateReel(reel);
      setReels((list) => list.map((r) => (r.id === reel.id ? { ...r, ...reel } : r)));
      return true;
    } catch (err) {
      handle(err);
      return false;
    } finally {
      setBusyId(null);
    }
  };

  /** Puts `reel` in spot `to`; whatever was there takes the reel's old spot (0 = off the site). */
  const move = async (reel, to) => {
    const other = bySlot[to];
    const from = reel.slot || 0;
    setReels((list) =>
      list.map((r) => (r.id === reel.id ? { ...r, slot: to } : other && r.id === other.id ? { ...r, slot: from } : r))
    );
    setBusyId(reel.id);
    try {
      await updateReel({ ...reel, slot: to });
      if (other) await updateReel({ ...other, slot: from });
    } catch (err) {
      handle(err);
      load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (reel, { silent = false } = {}) => {
    if (!silent && !window.confirm(`Remove "${reel.title}"?\n\nThe video is deleted from your account and taken off the website. This can't be undone.`)) return;
    setBusyId(reel.id);
    try {
      await deleteReel(reel.id);
      setReels((list) => list.filter((r) => r.id !== reel.id));
    } catch (err) {
      handle(err);
    } finally {
      setBusyId(null);
    }
  };

  // Cloudinary needs a moment to cut the poster, so give it a beat before re-listing.
  const uploaded = () => new Promise((r) => setTimeout(r, 1500)).then(load);

  const jumpTo = (n) => {
    const el = cardRefs.current[n];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
    setHover(n);
  };

  return (
    <div className="min-h-svh bg-black">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <span className="flex items-center gap-3">
            <LogoMark className="h-9 w-auto text-chalk" title="om.wrk" />
            <span className="h-5 w-px bg-white/15" />
            <span className="text-[14px] text-smoke">Website videos</span>
          </span>
          <nav className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13.5px] hover:border-white/40 sm:flex">
              View site <FaExternalLinkAlt className="h-3 w-3" />
            </a>
            <button onClick={onLogout} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13.5px] hover:border-white/40">
              <FaSignOutAlt className="h-3.5 w-3.5" /> Log out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="title-lg text-[clamp(2rem,4vw,3rem)]">Your homepage videos</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-smoke">
              The website shows <b className="font-semibold text-chalk">4 videos</b>, each in its own spot. Put a video in a spot, and that&apos;s exactly where it plays. Changes go live in about a minute.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/5 px-3.5 py-2 text-[13.5px]">
              <b className="font-semibold tabular-nums">{filled}</b>
              <span className="text-smoke"> of 4 spots filled</span>
            </span>
            <button onClick={load} aria-label="Refresh" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-white/40">
              <FaSyncAlt className={`h-3 w-3 ${state.loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {!state.loading && !state.configured && <SetupGuide missing={state.missing} />}
          {state.error && (
            <p role="alert" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-[14.5px]">
              {state.error}
            </p>
          )}
        </div>

        {state.configured && (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
            <div className="min-w-0 lg:sticky lg:top-24">
              <SitePreview bySlot={bySlot} active={hover} onHover={setHover} onPick={jumpTo} />
            </div>

            {state.loading && !reels.length ? (
              <p className="text-smoke">Loading your videos…</p>
            ) : (
              <ul className="grid min-w-0 gap-4">
                {SLOTS.map((slot) => (
                  <SlotCard
                    key={slot.n}
                    ref={(el) => (cardRefs.current[slot.n] = el)}
                    slot={slot}
                    reel={bySlot[slot.n]}
                    active={hover === slot.n}
                    busy={bySlot[slot.n] && busyId === bySlot[slot.n].id}
                    onHover={setHover}
                    onSave={save}
                    onMove={move}
                    onRemove={remove}
                    onUploaded={uploaded}
                    onAuthError={onLogout}
                  />
                ))}
              </ul>
            )}
          </div>
        )}

        {extras.length > 0 && (
          <section className="mt-14 border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold">Not on the website</h2>
            <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-smoke">
              These were uploaded earlier but don&apos;t have a spot. Put one in a spot (it swaps with the video there), or delete the ones you don&apos;t need.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extras.map((reel) => (
                <li key={reel.id} className={`flex gap-3 rounded-xl border border-white/10 bg-graphite/40 p-3 ${busyId === reel.id ? "pointer-events-none opacity-60" : ""}`}>
                  <a href={reel.full} target="_blank" rel="noopener noreferrer" className="block aspect-[9/16] w-16 shrink-0 overflow-hidden rounded-md bg-black">
                    <img src={reel.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </a>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="truncate text-[14px] font-semibold">{reel.title}</p>
                    {reel.client && <p className="-mt-1.5 truncate text-[12.5px] text-smoke">{reel.client}</p>}
                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      <MoveSelect onMove={(to) => move(reel, to)} label="Put in spot" />
                      <button type="button" onClick={() => remove(reel)} aria-label={`Delete ${reel.title}`} className="grid h-8 w-8 place-items-center rounded-full text-smoke hover:bg-ember/10 hover:text-ember">
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  useNoIndex();
  const [token, setToken] = useState(() => getToken());
  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  return token ? <Dashboard onLogout={logout} /> : <Login onLogin={setToken} />;
}
