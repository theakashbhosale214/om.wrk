import { useSyncExternalStore } from "react";

// One shared 1-second ticker, so every clock on the page flips at the same instant.
let now = Date.now();
const listeners = new Set();
let timer = null;

function subscribe(listener) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => now, () => now);
}

const withSeconds = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const noSeconds = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatIST = (ms, seconds = true) =>
  (seconds ? withSeconds : noSeconds).format(ms);
