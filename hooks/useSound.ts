"use client";

import { useCallback } from "react";

export function useSound() {
  const play = useCallback((src: string, volume = 1) => {
    try {
      const audio = new Audio(src);
      audio.volume = Math.min(1, Math.max(0, volume));
      // Browsers require a user gesture before playing — calling this inside
      // a click/submit handler satisfies that requirement.
      audio.play().catch(() => {
        // Autoplay blocked — silently ignore (no crash)
      });
    } catch {
      // Audio API not available (e.g. SSR) — silently ignore
    }
  }, []);

  return { play };
}
