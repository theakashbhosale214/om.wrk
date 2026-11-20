import { useCallback, useEffect, useState } from "react";
import { FaExternalLinkAlt, FaLock, FaSignOutAlt, FaSyncAlt } from "react-icons/fa";
import LogoMark from "../components/LogoMark";
import { AuthError, clearToken, deleteReel, getToken, listReels, login, updateReel } from "./api";
import Uploader from "./Uploader";
import ReelItem from "./ReelItem";

/*
  /admin — reel manager.
  Sign in with ADMIN_PASSWORD, upload reels (straight to Cloudinary), edit their
  details, choose which ones play in the homepage hero, reorder and delete.
  The public site reads the same list from /api/reels (cached ~1 minute).
*/

function useNoIndex() {
  useEffect(() => {
    document.title = "Admin · Zoomify Media";
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
          <LogoMark className="h-8 w-auto text-chalk" />
          <span className="font-semibold">Zoomify Media</span>
        </div>
        <h1 className="title-lg mt-8 text-[2.75rem]">Reel admin</h1>
        <p className="mt-2 text-[15px] text-smoke">Sign in to upload and manage the reels on the website.</p>
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
        Reels are stored and compressed by Cloudinary. Until it&apos;s connected, the website shows the three bundled reels.
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

  const toggleFeatured = (reel) => save({ ...reel, featured: !reel.featured });

  const move = async (reel, dir) => {
    const i = reels.findIndex((r) => r.id === reel.id);
    const other = reels[i + dir];
    if (!other) return;
    // List is newest-first by `order`; swapping the two values swaps their places.
    let a = other.order;
    const b = reel.order;
    if (a === b) a = b + (dir < 0 ? 1 : -1);
    const next = [...reels];
    next[i] = { ...other, order: b };
    next[i + dir] = { ...reel, order: a };
    setReels(next);
    setBusyId(reel.id);
    try {
      await updateReel({ ...reel, order: a });
      await updateReel({ ...other, order: b });
    } catch (err) {
      handle(err);
      load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (reel) => {
    if (!window.confirm(`Delete "${reel.title}"? This removes the video from Cloudinary and the website. It can't be undone.`)) return;
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

  const categories = [...new Set(reels.map((r) => r.category).filter(Boolean))];
  const heroCount = reels.filter((r) => r.featured).length;

  return (
    <div className="min-h-svh bg-black">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <span className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-auto text-chalk" />
            <span className="font-semibold">
              Zoomify <span className="text-smoke">Admin</span>
            </span>
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

      <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 md:py-10">
        {!state.loading && !state.configured && <SetupGuide missing={state.missing} />}

        {state.error && (
          <p role="alert" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-[14.5px]">
            {state.error}
          </p>
        )}

        {state.configured && <Uploader categories={categories} onUploaded={() => setTimeout(load, 1500)} onAuthError={onLogout} />}

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Your reels</h2>
              <p className="mt-1 text-[14px] text-smoke">
                {reels.length} reel{reels.length === 1 ? "" : "s"} · {heroCount || "all"} in the hero · top of the list shows first. Changes reach the website within about a minute.
              </p>
            </div>
            <button onClick={load} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13.5px] hover:border-white/40">
              <FaSyncAlt className={`h-3 w-3 ${state.loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          {state.loading && !reels.length ? (
            <p className="mt-6 text-smoke">Loading reels…</p>
          ) : reels.length ? (
            <ul className="mt-6 grid gap-3 lg:grid-cols-2">
              {reels.map((reel, i) => (
                <ReelItem
                  key={reel.id}
                  reel={reel}
                  isFirst={i === 0}
                  isLast={i === reels.length - 1}
                  busy={busyId === reel.id}
                  onSave={save}
                  onToggleFeatured={toggleFeatured}
                  onMove={move}
                  onDelete={remove}
                />
              ))}
            </ul>
          ) : (
            state.configured && (
              <p className="mt-6 rounded-xl border border-dashed border-white/15 px-5 py-8 text-center text-smoke">
                No reels yet. Upload your first one above. Until then, the website shows the three bundled reels.
              </p>
            )
          )}
        </section>
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
