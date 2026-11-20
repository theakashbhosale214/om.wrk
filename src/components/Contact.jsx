import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import emailjs from "@emailjs/browser";
import { FaArrowRight, FaCheck, FaEnvelope, FaInstagram, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { SELECT_SERVICE_EVENT } from "../lib/events";
import { Reveal, SplitText } from "./Motion";

// ─── EmailJS ─────────────────────────────────────────────────────────────────
// Set VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _PUBLIC_KEY (see .env.example).
// The form posts: name, email, phone, company, service, message.
// If EmailJS isn't configured or a send fails, the visitor is offered WhatsApp
// with their message already typed out, so no enquiry is lost.
// ─────────────────────────────────────────────────────────────────────────────
const EJ_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EJ_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EJ_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAIL_READY = Boolean(EJ_SERVICE && EJ_TEMPLATE && EJ_KEY);

const EASE = [0.16, 1, 0.3, 1];
const C = content.contact;
const OPTIONS = [...content.services.map((s) => s.title), "Not sure yet"];
const INITIAL = { name: "", email: "", phone: "", company: "", message: "" };

const waLink = (text) => `https://wa.me/${C.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const waMessage = (f, services) =>
  [
    `Hi Zoomify Media! I'm ${f.name || "interested in working with you"}${f.company ? ` from ${f.company}` : ""}.`,
    services.length ? `Interested in: ${services.join(", ")}.` : "",
    f.message,
  ]
    .filter(Boolean)
    .join("\n\n");

const NEXT_STEPS = [
  "You tell us about your brand and goals.",
  "We set up a quick call to understand what you need.",
  "You get a clear plan for content, ads and timelines.",
];

function ContactRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 border-t border-white/10 py-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-chalk">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="eyebrow !text-[10px] text-smoke">{label}</p>
        <div className="mt-1 text-[16px] font-medium">{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | whatsapp
  const [sentName, setSentName] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const onSelect = (e) => setServices((s) => (s.includes(e.detail) ? s : [...s, e.detail]));
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const toggle = (opt) => setServices((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_READY) {
      window.open(waLink(waMessage(form, services)), "_blank", "noopener");
      setStatus("whatsapp");
      return;
    }
    setStatus("sending");
    emailjs
      .sendForm(EJ_SERVICE, EJ_TEMPLATE, formRef.current, EJ_KEY)
      .then(() => {
        setSentName(form.name.split(" ")[0]);
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_50%_at_100%_0%,rgba(255,92,53,0.12),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-12 lg:gap-10">
        {/* ── left: pitch + direct lines ── */}
        <div className="lg:col-span-5">
          <Reveal y={12}>
            <p className="eyebrow flex items-center gap-3 text-smoke">
              <span className="text-ember">06</span>
              <span aria-hidden="true" className="h-px w-10 bg-white/20" />
              Contact
            </p>
          </Reveal>
          <SplitText text="Let's make something people *stop* for." className="title-lg mt-5 text-[clamp(2.75rem,6vw,5.75rem)]" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-smoke">
              Tell us about your brand and what you want to achieve. We&apos;ll come back with ideas, not a sales pitch.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <a
              href={waLink("Hi Zoomify Media! I'd like to talk about a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 flex items-center gap-4 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/[0.08] p-4 transition-colors duration-300 hover:border-[#25d366]/60 hover:bg-[#25d366]/[0.14] md:p-5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25d366] text-black">
                <FaWhatsapp className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold">Chat on WhatsApp</span>
                <span className="block text-[14px] text-smoke">{C.whatsappDisplay} · usually the quickest reply</span>
              </span>
              <FaArrowRight className="h-4 w-4 text-[#25d366] transition-transform duration-500 ease-expo group-hover:translate-x-1" />
            </a>
          </Reveal>

          <Reveal delay={0.2} className="mt-6">
            <ContactRow icon={FaPhoneAlt} label="Call us">
              <span className="flex flex-wrap gap-x-4 gap-y-1">
                {C.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="transition-colors hover:text-ember">
                    {p}
                  </a>
                ))}
              </span>
            </ContactRow>
            <ContactRow icon={FaEnvelope} label="Email">
              <span className="flex flex-wrap items-center gap-3">
                <a href={`mailto:${C.email}`} className="break-all transition-colors hover:text-ember">
                  {C.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="eyebrow rounded-full border border-white/15 px-2.5 py-1 !text-[9.5px] text-smoke transition-colors hover:border-white/40 hover:text-chalk"
                >
                  <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
                </button>
              </span>
            </ContactRow>
            <ContactRow icon={FaInstagram} label="Instagram">
              <a href={C.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ember">
                {C.instagram}
              </a>
            </ContactRow>
          </Reveal>

          <Reveal delay={0.25} className="mt-10">
            <p className="eyebrow text-smoke">What happens next</p>
            <ol className="mt-4 space-y-3">
              {NEXT_STEPS.map((s, i) => (
                <li key={s} className="flex gap-3 text-[15px] text-chalk/85">
                  <span className="font-mono text-[12px] leading-6 text-ember">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* ── right: the form ── */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-graphite/70 p-6 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur sm:p-9 md:p-11">
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[32rem] flex-col items-start justify-center"
                  role="status"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-ember text-black">
                    <FaCheck className="h-6 w-6" />
                  </span>
                  <h3 className="title-lg mt-8 text-[clamp(2.4rem,4vw,3.5rem)]">
                    Thanks{sentName ? `, ${sentName}` : ""}.
                    <br />
                    <span className="text-ember">Message received.</span>
                  </h3>
                  <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-smoke">
                    We&apos;ll get back to you soon. Want to speed things up? Send us a hello on{" "}
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-chalk underline decoration-[#25d366] decoration-2 underline-offset-4">
                      WhatsApp
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-white/15 px-5 py-2.5 text-[14px] font-semibold transition-colors hover:border-white/40"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.6rem] font-semibold tracking-[-0.02em]">Start a project</h3>
                    <span className="eyebrow !text-[10px] text-smoke">About a minute</span>
                  </div>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="field-label">Your name *</span>
                      <input name="name" required autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={update} className="field-input" />
                    </label>
                    <label className="block">
                      <span className="field-label">Email *</span>
                      <input name="email" type="email" required autoComplete="email" placeholder="you@brand.com" value={form.email} onChange={update} className="field-input" />
                    </label>
                    <label className="block">
                      <span className="field-label">Phone / WhatsApp</span>
                      <input name="phone" type="tel" autoComplete="tel" placeholder="+91" value={form.phone} onChange={update} className="field-input" />
                    </label>
                    <label className="block">
                      <span className="field-label">Brand / company</span>
                      <input name="company" autoComplete="organization" placeholder="Your brand" value={form.company} onChange={update} className="field-input" />
                    </label>
                  </div>

                  <fieldset className="mt-8">
                    <legend className="field-label">What do you need? (pick any)</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {OPTIONS.map((opt) => (
                        <button key={opt} type="button" aria-pressed={services.includes(opt)} onClick={() => toggle(opt)} className="chip">
                          {services.includes(opt) && <span className="mr-1.5">✓</span>}
                          {opt}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="service" value={services.join(", ")} />
                  </fieldset>

                  <label className="mt-8 block">
                    <span className="field-label">Tell us about the project *</span>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="Your goals, timelines, what's not working right now…"
                      value={form.message}
                      onChange={update}
                      className="field-input resize-none"
                    />
                  </label>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-ember py-2 pl-7 pr-2 text-[15px] font-semibold text-black transition-colors duration-300 hover:bg-chalk disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : EMAIL_READY ? "Send message" : "Send via WhatsApp"}
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-chalk transition-transform duration-500 ease-expo group-hover:rotate-45">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                    </button>
                    <p className="text-[13.5px] text-smoke">
                      Prefer to talk?{" "}
                      <a href={`tel:${C.phones[0].replace(/\s/g, "")}`} className="font-semibold text-chalk underline decoration-white/30 underline-offset-4 hover:decoration-ember">
                        Call {C.phones[0]}
                      </a>
                    </p>
                  </div>

                  <div aria-live="polite">
                    {status === "error" && (
                      <p className="mt-6 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-[14.5px] leading-relaxed">
                        That didn&apos;t send. Your message is still here, so try again, or{" "}
                        <a href={waLink(waMessage(form, services))} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                          send it on WhatsApp
                        </a>{" "}
                        instead.
                      </p>
                    )}
                    {status === "whatsapp" && (
                      <p className="mt-6 rounded-xl border border-[#25d366]/30 bg-[#25d366]/10 px-4 py-3 text-[14.5px] leading-relaxed">
                        We&apos;ve opened WhatsApp with your message ready. Just hit send. Didn&apos;t open?{" "}
                        <a href={waLink(waMessage(form, services))} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
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
      </div>
    </section>
  );
}
