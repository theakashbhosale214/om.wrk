import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { getLenis, scrollToHash } from "../lib/smoothScroll";
import LogoMark from "./LogoMark";

const EASE = [0.16, 1, 0.3, 1];
const LINKS = [...content.nav, { label: "Contact", href: "#contact" }];

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
    setTimeout(() => scrollToHash(href), 60);
  };

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col bg-black px-5 pb-8 pt-5 sm:px-8"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2.5">
          <LogoMark className="h-11 w-auto text-chalk" title="om.wrk" />
        </span>
        <button ref={closeRef} onClick={onClose} className="eyebrow rounded-full border border-white/15 px-4 py-2.5">
          Close ✕
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-auto">
        <ul>
          {LINKS.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-white/10">
              <motion.a
                href={item.href}
                data-menu-link
                onClick={(e) => go(e, item.href)}
                className="flex items-baseline justify-between py-3"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.18 + i * 0.05 }}
              >
                <span className="title-lg text-[3rem]">{item.label}</span>
                <span className="font-mono text-[11px] text-ember">0{i + 1}</span>
              </motion.a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="mt-10 grid grid-cols-2 gap-6 text-sm text-smoke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="space-y-1">
          <p className="eyebrow !text-[10px] text-dim">Say hello</p>
          <a href={`mailto:${content.contact.email}`} className="block text-[13px] text-chalk">
            {content.contact.email}
          </a>
          <a href={`tel:${content.contact.phones[0].replace(/\s/g, "")}`} className="block text-chalk">
            {content.contact.phones[0]}
          </a>
        </div>
        <div className="space-y-1">
          <p className="eyebrow !text-[10px] text-dim">Follow</p>
          <a href={content.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-chalk">
            <FaInstagram /> Instagram
          </a>
          <a href={`https://wa.me/${content.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-chalk">
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
  const menuBtnRef = useRef(null);
  const wasOpen = useRef(false);
  const { scrollY } = useScroll();
  const closeMenu = useCallback(() => setOpen(false), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > prev && y > 500);
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
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className={`border-b transition-[background-color,border-color] duration-500 ${
            scrolled ? "border-white/8 bg-black/70 backdrop-blur-xl" : "border-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8 md:px-10">
            <a href="#home" aria-label="om.wrk, back to top" className="flex items-center">
              <LogoMark className="h-11 w-auto text-chalk" />
            </a>

            <nav aria-label="Primary" className="hidden md:block">
              <ul className="glass flex items-center gap-0.5 rounded-full p-1">
                {content.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="block rounded-full px-4 py-2 text-[14px] text-chalk/70 transition-colors duration-300 hover:bg-white/10 hover:text-chalk">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#contact"
                className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-chalk py-2.5 pl-5 pr-4 text-[14px] font-semibold text-black transition-colors duration-300 hover:bg-ember sm:inline-flex"
              >
                Start a project
                <span aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <button
                ref={menuBtnRef}
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="eyebrow flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 md:hidden"
              >
                <span className="flex flex-col gap-[3px]" aria-hidden="true">
                  <span className="block h-px w-3.5 bg-current" />
                  <span className="block h-px w-3.5 bg-current" />
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
