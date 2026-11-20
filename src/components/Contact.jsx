import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import emailjs from "@emailjs/browser";
import { content } from "../data/content";
import { SELECT_SERVICE_EVENT } from "../lib/events";
import SectionLabel from "./SectionLabel";
import { Reveal, SplitText } from "./Motion";

// ─── EmailJS config ─────────────────────────────────────────────────────────
// Create a .env.local file in the project root with these values:
//   VITE_EMAILJS_SERVICE_ID=your_service_id
//   VITE_EMAILJS_TEMPLATE_ID=your_template_id
//   VITE_EMAILJS_PUBLIC_KEY=your_public_key
// Get them from: https://dashboard.emailjs.com
// The form still posts the same field names (name, email, phone, company,
// service, message), so an existing EmailJS template keeps working.
// ─────────────────────────────────────────────────────────────────────────────
const EJ_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EJ_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EJ_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const INITIAL = { name: "", email: "", phone: "", company: "", service: "", message: "" };
const SERVICE_OPTIONS = [...content.services.map((s) => s.title), "Something else"];

function ContactLine({ label, children, href, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-baseline justify-between gap-4 border-b border-ink/15 py-4"
    >
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/50">{label}</span>
      <span className="flex items-center gap-3 text-right text-[1.05rem] transition-colors group-hover:text-tomato md:text-lg">
        {children}
        <span
          aria-hidden="true"
          className="inline-block -translate-x-1 opacity-0 transition-all duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100"
        >
          ↗
        </span>
      </span>
    </a>
  );
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);
  const c = content.contact;

  // Clicking a service row pre-selects it here.
  useEffect(() => {
    const onSelect = (e) => setForm((f) => ({ ...f, service: e.detail }));
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    emailjs
      .sendForm(EJ_SERVICE, EJ_TEMPLATE, formRef.current, EJ_KEY)
      .then(() => {
        setStatus("success");
        setForm(INITIAL);
      })
      .catch(() => setStatus("error"));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(c.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${c.email}`;
    }
  };

  return (
    <section id="contact" tabIndex={-1} className="relative bg-bone px-5 py-24 sm:px-8 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1680px]">
        <SectionLabel index="04" label="Contact" aside="Start a conversation" />

        <div className="mt-12 grid gap-16 md:mt-16 lg:grid-cols-12 lg:gap-6">
          {/* left: pitch + details */}
          <div className="lg:col-span-5">
            <SplitText
              text="Tell us about your *brand.*"
              className="font-display text-[clamp(2.6rem,6vw,6.25rem)] leading-[0.93] tracking-[-0.04em]"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-[15.5px] leading-relaxed text-ink/65">
                A launch, a rebrand, or just more customers. Share a few details and we&apos;ll come back
                with ideas, not a sales pitch.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-12 border-t border-ink/15">
              <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 py-4">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/50">Email</span>
                <span className="flex items-center gap-3">
                  <a href={`mailto:${c.email}`} className="text-[1.05rem] transition-colors hover:text-tomato md:text-lg">
                    {c.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  >
                    <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
                  </button>
                </span>
              </div>
              {c.phones.map((p, i) => (
                <ContactLine key={p} label={`Phone ${i + 1}`} href={`tel:${p.replace(/\s/g, "")}`}>
                  {p}
                </ContactLine>
              ))}
              <ContactLine label="WhatsApp" href={`https://wa.me/${c.whatsapp}`} external>
                {c.whatsappDisplay}
              </ContactLine>
              <ContactLine label="Instagram" href={c.instagramUrl} external>
                {c.instagram}
              </ContactLine>
            </Reveal>
          </div>

          {/* right: form */}
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-[0_40px_80px_-60px_rgb(20_26_22/0.45)] sm:p-9 md:p-12"
            >
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
                <label className="block">
                  <span className="field-label">Your name *</span>
                  <input name="name" type="text" required autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} className="field-input" />
                </label>
                <label className="block">
                  <span className="field-label">Email *</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@brand.com" value={form.email} onChange={handleChange} className="field-input" />
                </label>
                <label className="block">
                  <span className="field-label">Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+91" value={form.phone} onChange={handleChange} className="field-input" />
                </label>
                <label className="block">
                  <span className="field-label">Company / brand</span>
                  <input name="company" type="text" autoComplete="organization" placeholder="Your brand" value={form.company} onChange={handleChange} className="field-input" />
                </label>
              </div>

              <fieldset className="mt-9">
                <legend className="field-label">I&apos;m interested in</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map((opt) => {
                    const active = form.service === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setForm((f) => ({ ...f, service: active ? "" : opt }))}
                        className={`rounded-full border px-4 py-2 text-[13.5px] transition-all duration-300 ${
                          active
                            ? "border-ink bg-ink text-bone"
                            : "border-ink/15 text-ink/75 hover:border-ink/50 hover:text-ink"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="service" value={form.service} />
              </fieldset>

              <label className="mt-9 block">
                <span className="field-label">Tell us a little more *</span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Goals, timelines, what's not working right now…"
                  value={form.message}
                  onChange={handleChange}
                  className="field-input resize-none"
                />
              </label>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-bone transition-colors duration-300 hover:bg-tomato disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-tomato transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-ink">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                </button>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink/45">
                  Or WhatsApp{" "}
                  <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4 hover:text-tomato">
                    {c.whatsappDisplay}
                  </a>
                </p>
              </div>

              <div aria-live="polite">
                <AnimatePresence>
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 rounded-xl bg-sage-soft px-4 py-3 text-sm text-ink"
                    >
                      Message sent. We&apos;ll get back to you soon.
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 rounded-xl bg-tomato/10 px-4 py-3 text-sm text-tomato-deep"
                    >
                      Something went wrong. Please try again, or reach us on{" "}
                      <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="underline">
                        WhatsApp
                      </a>{" "}
                      directly.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
