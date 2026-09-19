"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

// "dun dun dunnnnnn" — 3 beat moments (in ms)
// Beat 1 (DUN)  : ~300ms  → "R" punches in
// Beat 2 (DUN)  : ~900ms  → "ISHI" crashes in
// Beat 3 (DUNNN): ~1500ms → "FLIX" slams in + full glow sustained
// Fade out      : ~3800ms

export default function RishiflixIntro({ onComplete }: Props) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Which groups are visible
  const [beat1, setBeat1] = useState(false); // "R"
  const [beat2, setBeat2] = useState(false); // "ISHI"
  const [beat3, setBeat3] = useState(false); // "FLIX"
  const [pulse, setPulse] = useState(false); // sustained glow pulse on beat 3
  const [fadeOut, setFadeOut] = useState(false);

  // Flash overlay that fires on each beat
  const [flashClass, setFlashClass] = useState("");

  function triggerFlash(intensity: "soft" | "hard") {
    setFlashClass(`rf-flash-${intensity}`);
    setTimeout(() => setFlashClass(""), 300);
  }

  useEffect(() => {
    // Play audio — inside the sign-in submit chain so autoplay is allowed
    const audio = new Audio("/dun-dun-dun.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Beat 1 — DUN (~300ms)
    timers.push(setTimeout(() => {
      setBeat1(true);
      triggerFlash("soft");
    }, 300));

    // Beat 2 — DUN (~900ms)
    timers.push(setTimeout(() => {
      setBeat2(true);
      triggerFlash("soft");
    }, 900));

    // Beat 3 — DUNNNNN (~1500ms)
    timers.push(setTimeout(() => {
      setBeat3(true);
      triggerFlash("hard");
    }, 1500));

    // Sustained glow pulse kicks in right after beat 3
    timers.push(setTimeout(() => setPulse(true), 1600));

    // Start fade out
    timers.push(setTimeout(() => setFadeOut(true), 3400));

    // Unmount
    timers.push(setTimeout(() => onCompleteRef.current(), 4100));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`rf-stage ${fadeOut ? "rf-stage--out" : ""}`}>

      {/* Beat flash overlay */}
      {flashClass && <div className={`rf-flash ${flashClass}`} />}

      {/* Red radial background — blooms on beat 3 */}
      <div className={`rf-bloom ${beat3 ? "rf-bloom--on" : ""}`} />

      {/* Wordmark — three groups slam in on each beat */}
      <div className={`rf-wordmark ${pulse ? "rf-wordmark--pulse" : ""}`}>

        {/* Beat 1 — "R" */}
        <span className={`rf-group rf-group--1 ${beat1 ? "rf-group--visible" : ""}`}>
          R
        </span>

        {/* Beat 2 — "ISHI" */}
        <span className={`rf-group rf-group--2 ${beat2 ? "rf-group--visible" : ""}`}>
          ISHI
        </span>

        {/* Beat 3 — "FLIX" */}
        <span className={`rf-group rf-group--3 ${beat3 ? "rf-group--visible" : ""}`}>
          FLIX
        </span>

      </div>

      {/* Scanline texture for cinematic feel */}
      <div className="rf-scanlines" />
    </div>
  );
}
