import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { getLenis, scrollToHash } from "../lib/smoothScroll";
import LogoMark from "./LogoMark";

const EASE = [0.16, 1, 0.3, 1];

function Wordmark({ className = "" }) {
  return (
    <span className={`font-display text-[1.4rem] leading-none tracking-[-0.03em] ${className}`}>
      Zoomify<em className="text-tomato">media</em>
    </span>
  );
}

function MobileMenu({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = (e, href) => {
    e.preventDefault();
    onClose();
    // Let the menu release the scroll lock before travelling.
    setTimeout(() => scrollToHash(href), 60);
  };

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col bg-forest px-5 pb-8 pt-4 text-bone sm:px-8"
      initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2rem)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2rem)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2rem)" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center justify-between py-1.5">
        <span className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-auto text-bone" />
          <Wordmark />
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          className="rounded-full border border-bone/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-auto">
        <ul>
          {content.nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-bone/10">
              <motion.a
                href={item.href}
                data-menu-link
                onClick={(e) => go(e, item.href)}
                className="flex items-baseline justify-between py-3.5"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
              >
                <span className="font-display text-[2.6rem] leading-none tracking-[-0.03em]">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] text-tomato">0{i + 1}</span>
              </motion.a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="mt-10 grid grid-cols-2 gap-6 text-sm text-bone/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/40">Say hello</p>
          <a href={`mailto:${content.contact.email}`} className="block text-[13px]">
            {content.contact.email}
          </a>
          <a href={`tel:${content.contact.phones[0].replace(/\s/g, "")}`} className="block">
            {content.contact.phones[0]}
          </a>
        </div>
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/40">Follow</p>
          <a href={content.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <FaInstagram /> Instagram
          </a>
          <a href={`https://wa.me/${content.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const menuBtnRef = useRef(null);
  const wasOpen = useRef(false);
  const { scrollY } = useScroll();
  const closeMenu = useCallback(() => setOpen(false), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 480);
  });

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      if (lenis) lenis.stop();
      else document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      else document.body.style.overflow = "";
      if (wasOpen.current) menuBtnRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? "-105%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div
          className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled ? "border-ink/10 bg-bone/80 backdrop-blur-xl" : "border-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-6 px-5 py-3 sm:px-8 md:px-12">
            <a href="#home" aria-label="Zoomify Media, back to top" className="group flex items-center gap-2.5">
              <LogoMark className="h-7 w-auto text-ink transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
              <Wordmark />
            </a>

            <nav aria-label="Primary" className="hidden md:block">
              <ul
                className="flex items-center rounded-full border border-ink/10 bg-paper/70 p-1 backdrop-blur-md"
                onMouseLeave={() => setHovered(null)}
              >
                {content.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      onBlur={() => setHovered(null)}
                      className="relative block rounded-full px-4 py-2 text-[13.5px]"
                    >
                      {hovered === item.href && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span
                        className={`relative transition-colors duration-300 ${
                          hovered === item.href ? "text-bone" : "text-ink/75"
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#contact"
                className="group hidden items-center gap-2.5 rounded-full bg-ink py-2.5 pl-5 pr-4 text-[13.5px] font-medium text-bone transition-colors duration-300 hover:bg-tomato sm:inline-flex"
              >
                Let&apos;s talk
                <span className="h-1.5 w-1.5 rounded-full bg-tomato transition-colors duration-300 group-hover:bg-bone" />
              </a>
              <button
                ref={menuBtnRef}
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] backdrop-blur-md md:hidden"
              >
                <span className="flex flex-col gap-[3px]" aria-hidden="true">
                  <span className="block h-px w-3.5 bg-ink" />
                  <span className="block h-px w-3.5 bg-ink" />
                </span>
                Menu
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={closeMenu} />}</AnimatePresence>
    </>
  );
}
