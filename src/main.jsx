import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Show the intro curtain once per browser session, and never to reduced-motion users.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let seenIntro = false;
try {
  seenIntro = sessionStorage.getItem("zm-intro") === "1";
  sessionStorage.setItem("zm-intro", "1");
} catch {
  // storage blocked — just show the intro
}
const showIntro = !reduceMotion && !seenIntro;
document.documentElement.style.setProperty("--intro-delay", showIntro ? "1.2s" : "0.2s");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App showIntro={showIntro} />
  </StrictMode>
);
