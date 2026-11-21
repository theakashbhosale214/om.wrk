import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { formatIST, useNow } from "../lib/useNow";
import LogoMark from "./LogoMark";

function LocalTime() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)} IST</span>;
}

const C = content.contact;
const tel = (p) => `tel:${p.replace(/\s/g, "")}`;

function Column({ title, children }) {
  return (
    <div>
      <p className="eyebrow !text-[10px] text-dim">{title}</p>
      <ul className="mt-5 space-y-3 text-[15px] text-chalk/80">{children}</ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,92,53,0.16),transparent_70%)]" />

      {/* columns */}
      <div className="relative mx-auto max-w-[1600px] px-5 pb-10 pt-16 sm:px-8 md:px-10 md:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <a href="#home" className="inline-flex items-center gap-3" aria-label="Zoomify Media, back to top">
              <LogoMark className="h-9 w-auto text-chalk" />
              <span className="text-[1.15rem] font-semibold tracking-[-0.01em]">Zoomify Media</span>
            </a>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-smoke">{content.brand.tagline}</p>
            <div className="mt-6 flex gap-2">
              <a href={C.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-ember hover:bg-ember hover:text-black">
                <FaInstagram />
              </a>
              <a href={`https://wa.me/${C.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-ember hover:bg-ember hover:text-black">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <Column title="Explore">
              {[...content.nav, { label: "Contact", href: "#contact" }].map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-ember">
                    {n.label}
                  </a>
                </li>
              ))}
            </Column>
          </div>

          <div className="md:col-span-3">
            <Column title="Services">
              {content.services.map((s) => (
                <li key={s.title}>
                  <a href="#services" className="transition-colors hover:text-ember">
                    {s.title}
                  </a>
                </li>
              ))}
            </Column>
          </div>

          <div className="col-span-2 md:col-span-2">
            <Column title="Contact">
              <li>
                <a href={`mailto:${C.email}`} className="break-all transition-colors hover:text-ember">
                  {C.email}
                </a>
              </li>
              {C.phones.map((p) => (
                <li key={p}>
                  <a href={tel(p)} className="transition-colors hover:text-ember">
                    {p}
                  </a>
                </li>
              ))}
              <li className="text-smoke">
                India · <LocalTime />
              </li>
            </Column>
          </div>
        </div>
      </div>

      {/* wordmark + bottom bar */}
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <p
          aria-hidden="true"
          className="title-xl select-none whitespace-nowrap bg-[linear-gradient(180deg,rgba(242,240,235,0.22)_0%,rgba(242,240,235,0.03)_95%)] bg-clip-text pt-6 text-center text-[26.5vw] leading-[0.8] text-transparent min-[1600px]:text-[26rem]"
        >
          Zoomify
        </p>
        <div className="eyebrow flex flex-col gap-3 border-t border-white/10 py-6 !text-[10px] text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Zoomify Media. All rights reserved.</span>
          <a href="#home" className="text-smoke transition-colors hover:text-ember">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
