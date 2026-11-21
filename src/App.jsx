import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Work from "./components/Work";
import Services from "./components/Services";
import Ticker from "./components/Ticker";
import Process from "./components/Process";
import Studio from "./components/Studio";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import PlayerProvider from "./components/ReelPlayer";
import { useReels } from "./lib/reels";
import { bindAnchorLinks, initSmoothScroll } from "./lib/smoothScroll";

export default function App() {
  const { reels } = useReels();

  useEffect(() => {
    const stopScroll = initSmoothScroll();
    const unbind = bindAnchorLinks();
    return () => {
      unbind();
      stopScroll();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <PlayerProvider>
        <Navbar />
        <main>
          <Hero reels={reels} />
          <Clients />
          <Work reels={reels} />
          <Ticker />
          <Services reels={reels} />
          <Process />
          <Studio />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFloat />
      </PlayerProvider>
    </MotionConfig>
  );
}
