import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import emailjs from "@emailjs/browser";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUpRight, FiCheck, FiCopy, FiInstagram, FiMail, FiPhone } from "react-icons/fi";
import { content } from "../data/content";
import { SELECT_SERVICE_EVENT } from "../lib/events";
import { formatIST, useNow } from "../lib/useNow";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Motion";

// ─── EmailJS ─────────────────────────────────────────────────────────────────
// Set VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _PUBLIC_KEY (see .env.example).
// Sends: name, email, phone, company, service, budget, timeline, message.
// `message` also repeats the budget and start date, so older templates that only
// print {{message}} still get everything.
// If EmailJS isn't configured or a send fails, the visitor is offered WhatsApp
// with their enquiry already typed out, so no lead is lost.
// ─────────────────────────────────────────────────────────────────────────────
const EJ_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EJ_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EJ_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAIL_READY = Boolean(EJ_SERVICE && EJ_TEMPLATE && EJ_KEY);

const EASE = [0.16, 1, 0.3, 1];
const C = content.contact;
const SERVICES = content.services.map((s) => ({ value: s.title, label: s.short || s.title }));
const INITIAL = { name: "", company: "", email: "", phone: "", budget: "", start: "", message: "" };

const waLink = (text) => `https://wa.me/${C.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const tel = (p) => `tel:${p.replace(/\s/g, "")}`;

function summary(f, services) {
  return [
    `Hi om.wrk! I'm ${f.name || "interested in working with you"}${f.company ? ` from ${f.company}` : ""}.`,
    services.length ? `Looking for: ${services.join(", ")}.` : "",
    f.budget ? `Budget: ${f.budget}.` : "",
    f.start ? `Start: ${f.start}.` : "",
    f.email ? `Email: ${f.email}` : "",
    f.phone ? `Phone: ${f.phone}` : "",
    f.message,
  ]
    .filter(Boolean)
    .join("\n");
}

/* ── Inline fields for the sentence ─────────────────────────────── */
function Blank({ name, value, onChange, placeholder, label, type = "text", required, autoComplete, inputMode }) {
  // The hidden copy of the text (CSS ::after) sizes the field to exactly what's typed.
  return (
    <span className="ml-sizer" data-value={value || placeholder}>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        size={1}
        className="ml-blank"
      />
    </span>
  );
}

function Pick({ name, value, onChange, options, placeholder, label }) {
  return (
    <span className="ml-sizer ml-sizer-select" data-value={value || placeholder}>
      <select name={name} value={value} onChange={onChange} aria-label={label} className={`ml-blank ml-select ${value ? "" : "is-empty"}`}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </span>
  );
}

/* ── Right-hand contact tiles ───────────────────────────────────── */
function Tile({ href, icon: Icon, label, children, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="glass group flex items-center gap-4 rounded-2xl p-4 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-chalk transition-colors duration-300 group-hover:bg-ember group-hover:text-black">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="eyebrow block !text-[9.5px] text-dim">{label}</span>
        <span className="mt-0.5 block truncate text-[15.5px] font-medium">{children}</span>
      </span>
      <FiArrowUpRight className="h-4 w-4 shrink-0 text-dim transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-chalk" />
    </a>
  );
}

function Clock() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)}</span>;
}

function Sent({ name, services, onReset }) {
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      role="status"
      className="flex min-h-[30rem] flex-col items-start justify-center"
    >
      <span className="relative grid h-20 w-20 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-ember/25"
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", repeat: 2 }}
        />
        <span className="relative grid h-20 w-20 place-items-center rounded-full bg-ember text-black">
          <FiCheck className="h-9 w-9" strokeWidth={2.5} />
        </span>
      </span>
      <h3 className="title-lg mt-9 text-[clamp(2.6rem,5vw,4.5rem)]">
        Thanks{name ? `, ${name}` : ""}.
        <br />
        <span className="serif text-glow">We&apos;re on it.</span>
      </h3>
      <p className="mt-5 max-w-md text-[17px] leading-relaxed text-smoke">
        Your enquiry is in. We&apos;ll be in touch shortly with next steps and a couple of ideas for your brand.
      </p>
      {services.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s} className="rounded-full border border-white/12 px-3 py-1.5 text-[13px] text-chalk/80">
              {s}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-9 flex flex-wrap gap-3">
        <a href={waLink("Hi om.wrk! I just sent an enquiry on your website.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-wa px-5 py-3 text-[14px] font-semibold text-black">
          <FaWhatsapp className="h-4 w-4" /> Say hi on WhatsApp
        </a>
        <button type="button" onClick={onReset} className="glass rounded-full px-5 py-3 text-[14px] font-semibold transition-colors hover:border-white/30">
          Send another enquiry
        </button>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | whatsapp
  const [sent, setSent] = useState({ name: "", services: [] });
  const [copied, setCopied] = useState(false);

  // "Enquire about …" buttons elsewhere on the page preselect a service here.
  useEffect(() => {
    const onSelect = (e) => setServices((s) => (s.includes(e.detail) ? s : [...s, e.detail]));
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const toggle = (v) => setServices((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const labelOf = (v) => SERVICES.find((s) => s.value === v)?.label || v;

  const submit = (e) => {
    e.preventDefault();
    const text = summary(form, services.map(labelOf));
    if (!EMAIL_READY) {
      window.open(waLink(text), "_blank", "noopener");
      setStatus("whatsapp");
      return;
    }
    setStatus("sending");
    const extra = [form.budget && `Budget: ${form.budget}`, form.start && `Start: ${form.start}`].filter(Boolean).join(" · ");
    emailjs
      .send(
        EJ_SERVICE,
        EJ_TEMPLATE,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service: services.join(", "),
          budget: form.budget,
          timeline: form.start,
          message: [form.message, extra].filter(Boolean).join("\n\n"),
        },
        EJ_KEY
      )
      .then(() => {
        setSent({ name: form.name.trim().split(" ")[0], services: services.map(labelOf) });
        setStatus("sent");
        setForm(INITIAL);
        setServices([]);
      })
      .catch(() => setStatus("error"));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(C.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${C.email}`;
    }
  };

  return (
    <section id="contact" tabIndex={-1} className="relative overflow-hidden bg-coal px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_30%_100%,rgba(255,92,53,0.20),transparent_70%),radial-gradient(35%_35%_at_100%_10%,rgba(109,92,255,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        <SectionHeader index="06" label="Contact" title="Let's make something *people stop for.*">
          <p className="max-w-sm text-[16px] leading-relaxed text-smoke">
            Fill in the blanks and hit send. We come back with ideas, not a sales pitch.
          </p>
        </SectionHeader>

        <div className="mt-14 grid gap-5 md:mt-20 lg:grid-cols-12 lg:gap-6">
          {/* ── the sentence form ── */}
          <Reveal className="lg:col-span-8">
            <div className="glass edge relative overflow-hidden rounded-[2rem] bg-black/40 p-6 sm:p-10 md:p-12">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <Sent
                    name={sent.name}
                    services={sent.services}
                    onReset={() => {
                      setStatus("idle");
                      setSent({ name: "", services: [] });
                    }}
                  />
                ) : (
                  <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="eyebrow flex items-center gap-2.5 text-smoke">
                        <span className="rec-dot" /> New enquiry
                      </p>
                      <p className="eyebrow !text-[10px] text-dim">≈ 30 seconds</p>
                    </div>

                    <div className="madlib mt-8 md:mt-10">
                      Hi om.wrk, I&apos;m{" "}
                      <Blank name="name" value={form.name} onChange={update} placeholder="your name" label="Your name" required autoComplete="name" /> from{" "}
                      <Blank name="company" value={form.company} onChange={update} placeholder="your brand" label="Your brand or company" autoComplete="organization" />. I&apos;m
                      looking for help with{" "}
                      <span role="group" aria-label="Services you need">
                        {SERVICES.map((s) => (
                          <button key={s.value} type="button" aria-pressed={services.includes(s.value)} onClick={() => toggle(s.value)} className="ml-chip">
                            {services.includes(s.value) && <FiCheck className="mr-1 inline h-[0.9em] w-[0.9em] align-[-0.1em]" strokeWidth={3} />}
                            {s.label}
                          </button>
                        ))}
                      </span>
                      . My budget is <Pick name="budget" value={form.budget} onChange={update} options={C.budgets} placeholder="pick a range" label="Budget" /> and I&apos;d like to
                      start <Pick name="start" value={form.start} onChange={update} options={C.starts} placeholder="when?" label="When you'd like to start" />. You can reach me at{" "}
                      <Blank name="email" type="email" value={form.email} onChange={update} placeholder="you@brand.com" label="Your email" required autoComplete="email" /> or on WhatsApp at{" "}
                      <Blank name="phone" type="tel" value={form.phone} onChange={update} placeholder="+91 …" label="Your phone or WhatsApp number" autoComplete="tel" inputMode="tel" />.
                    </div>

                    <label className="mt-10 block">
                      <span className="field-label">Anything else we should know? (optional)</span>
                      <textarea
                        name="message"
                        rows={3}
                        value={form.message}
                        onChange={update}
                        placeholder="Goals, links to your page, what's not working right now…"
                        className="field-input resize-none"
                      />
                    </label>

                    <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className={`group inline-flex items-center justify-between gap-4 rounded-full py-2.5 pl-7 pr-2.5 text-[16px] font-semibold text-black transition-colors duration-300 disabled:opacity-60 sm:justify-center ${
                          EMAIL_READY ? "bg-ember shadow-[0_18px_50px_-14px_rgba(255,92,53,0.7)] hover:bg-chalk" : "bg-wa shadow-[0_18px_50px_-14px_rgba(37,211,102,0.55)] hover:bg-chalk"
                        }`}
                      >
                        {status === "sending" ? "Sending…" : EMAIL_READY ? "Send enquiry" : "Send on WhatsApp"}
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-black text-chalk transition-transform duration-500 ease-expo group-hover:rotate-45">
                          {EMAIL_READY ? <FiArrowUpRight className="h-5 w-5" /> : <FaWhatsapp className="h-5 w-5 group-hover:-rotate-45" />}
                        </span>
                      </button>
                      <p className="max-w-xs text-[13px] leading-relaxed text-dim">Your details stay with us. No spam, no mailing lists.</p>
                    </div>

                    <div aria-live="polite">
                      {status === "error" && (
                        <p className="mt-6 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-[14.5px] leading-relaxed">
                          That didn&apos;t go through. Your answers are still here, so try again, or{" "}
                          <a href={waLink(summary(form, services.map(labelOf)))} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                            send it on WhatsApp
                          </a>{" "}
                          instead.
                        </p>
                      )}
                      {status === "whatsapp" && (
                        <p className="mt-6 rounded-xl border border-wa/30 bg-wa/10 px-4 py-3 text-[14.5px] leading-relaxed">
                          WhatsApp is open with your enquiry typed out. Just hit send. Didn&apos;t open?{" "}
                          <a href={waLink(summary(form, services.map(labelOf)))} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                            Tap here
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* ── direct lines ── */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            <Reveal delay={0.08}>
              <a
                href={waLink("Hi om.wrk! I'd like to talk about a project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-[1.6rem] border border-wa/25 bg-[linear-gradient(150deg,rgba(37,211,102,0.20),rgba(37,211,102,0.04)_60%)] p-6 transition-colors duration-500 hover:border-wa/50"
              >
                <span aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-wa/25 blur-3xl transition-transform duration-700 ease-expo group-hover:scale-125" />
                <span className="relative flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-wa text-black shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)]">
                    <FaWhatsapp className="h-7 w-7" />
                  </span>
                  <span className="eyebrow rounded-full bg-black/30 px-2.5 py-1 !text-[9.5px] text-wa">Fastest reply</span>
                </span>
                <span className="relative mt-8 block text-[1.6rem] font-semibold leading-tight tracking-[-0.02em]">Chat on WhatsApp</span>
                <span className="relative mt-1 flex items-center justify-between text-[15px] text-chalk/70">
                  {C.whatsappDisplay}
                  <FiArrowUpRight className="h-5 w-5 text-wa transition-transform duration-500 ease-expo group-hover:rotate-45" />
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.12} className="flex flex-col gap-3">
              {C.phones.map((p, i) => (
                <Tile key={p} href={tel(p)} icon={FiPhone} label={i === 0 ? "Call us" : "Or call"}>
                  {p}
                </Tile>
              ))}
              <div className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                  <FiMail className="h-[18px] w-[18px]" />
                </span>
                <a href={`mailto:${C.email}`} className="min-w-0 flex-1">
                  <span className="eyebrow block !text-[9.5px] text-dim">Email</span>
                  <span className="mt-0.5 block truncate text-[15.5px] font-medium transition-colors hover:text-ember">{C.email}</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-smoke transition-colors hover:border-white/40 hover:text-chalk"
                >
                  {copied ? <FiCheck className="h-4 w-4 text-ok" /> : <FiCopy className="h-4 w-4" />}
                </button>
              </div>
              <Tile href={C.instagramUrl} icon={FiInstagram} label="Instagram" external>
                {C.instagram}
              </Tile>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="glass rounded-[1.6rem] p-6">
                <div className="flex items-center justify-between">
                  <p className="eyebrow !text-[10px] text-smoke">What happens next</p>
                  <p className="eyebrow !text-[10px] text-dim">
                    India · <Clock /> IST
                  </p>
                </div>
                <ol className="relative mt-5 space-y-4 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-white/12">
                  {["We read your brief and look at your page.", "A quick call to understand your goals.", "You get a plan: content, ads and timelines."].map((s, i) => (
                    <li key={s} className="relative flex gap-4 text-[14.5px] leading-snug text-chalk/85">
                      <span className="relative grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full border border-white/15 bg-coal font-mono text-[10px] text-ember">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
