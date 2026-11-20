import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
import { content } from "../data/content";
import { usePlayer } from "../lib/player";

/**
 * WhatsApp pill: appears after the hero, steps aside from the Contact section onward
 * (which has its own WhatsApp button) and while a reel is playing.
 */
export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  const { isOpen } = usePlayer();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const contact = document.getElementById("contact");
    const beforeContact = !contact || contact.getBoundingClientRect().top > window.innerHeight * 0.6;
    setShow(y > window.innerHeight * 0.9 && beforeContact);
  });

  return (
    <AnimatePresence>
      {show && !isOpen && (
        <motion.a
          href={`https://wa.me/${content.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Zoomify Media on WhatsApp"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-white/10 bg-graphite/90 p-2 text-chalk shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur md:bottom-7 md:right-7 md:pr-5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25d366] text-black transition-transform duration-500 group-hover:rotate-12">
            <FaWhatsapp size={20} />
          </span>
          <span className="hidden text-[14px] font-medium md:inline">Chat with us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
