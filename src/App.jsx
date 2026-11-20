import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import Intro from "./components/Intro";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import About from "./components/About";
import Services from "./components/Services";
import Approach from "./components/Approach";
import CallToAction from "./components/CallToAction";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { bindAnchorLinks, getLenis, initSmoothScroll } from "./lib/smoothScroll";

export default function App({ showIntro = false }) {
  const [introDone, setIntroDone] = useState(!showIntro);

  useEffect(() => {
    const stopScroll = initSmoothScroll();
    const unbind = bindAnchorLinks();
    return () => {
      unbind();
      stopScroll();
    };
  }, []);

  // Hold the page still while the intro curtain is up.
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    if (introDone) lenis.start();
    else lenis.stop();
  }, [introDone]);

  return (
    <MotionConfig reducedMotion="user">
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <About />
        <Services />
        <Approach />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </MotionConfig>
  );
}
