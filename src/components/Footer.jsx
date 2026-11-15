import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { formatIST, useNow } from "../lib/useNow";
import LogoMark from "./LogoMark";

function LocalTime() {
  const now = useNow();
  return <span className="tabular-nums">{formatIST(now, false)} IST</span>;
}

export default function Footer() {
  const c = content.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest px-5 pt-20 text-bone sm:px-8 md:px-12 md:pt-28">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <LogoMark className="h-10 w-auto text-bone" />
            <p className="mt-6 max-w-xs font-display text-2xl leading-snug tracking-[-0.02em] text-bone/90">
              {content.brand.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-1 md:col-span-2 md:col-start-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone/40">Navigate</p>
            <ul className="mt-5 space-y-2.5">
              {content.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-bone/75 transition-colors hover:text-tomato">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-last col-span-2 md:order-none md:col-span-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone/40">Say hello</p>
            <ul className="mt-5 space-y-2.5 text-bone/75">
              <li>
                <a href={`mailto:${c.email}`} className="break-all transition-colors hover:text-tomato">
                  {c.email}
                </a>
              </li>
              {c.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, "")}`} className="transition-colors hover:text-tomato">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone/40">Follow</p>
            <div className="mt-5 flex gap-2">
              <a
                href={c.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-bone/20 transition-colors hover:border-tomato hover:bg-tomato"
              >
                <FaInstagram />
              </a>
              <a
                href={`https://wa.me/${c.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full border border-bone/20 transition-colors hover:border-tomato hover:bg-tomato"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone/45 md:mt-24">
          <span>© {year} Zoomify Media. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-tomato" /> India · <LocalTime />
          </span>
          <a href="#home" className="text-bone/70 transition-colors hover:text-tomato">
            Back to top ↑
          </a>
        </div>
      </div>

      {/* giant wordmark */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mx-5 mt-10 select-none whitespace-nowrap pb-[0.06em] text-center font-display text-[18.6vw] leading-[0.8] tracking-[-0.055em] text-bone sm:-mx-8 md:-mx-12 md:mt-14"
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        Zoomify<em className="text-tomato">media</em>
      </p>
    </footer>
  );
}
