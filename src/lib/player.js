import { createContext, useContext } from "react";

/** Shared full-screen reel player. `open(list, index)` from anywhere on the page. */
export const PlayerContext = createContext({ open: () => {} });
export const usePlayer = () => useContext(PlayerContext);
