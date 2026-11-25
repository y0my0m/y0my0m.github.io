"use client";

import { useEffect, useRef, useState } from "react";
import { acquireScrollLock, releaseScrollLock } from "./scroll-lock";

const HOLD_MS = 1400;
const FADE_MS = 450;

function introEnabled() {
  if (typeof document === "undefined") return false;
  if (document.documentElement.getAttribute("data-intro") === "off") return false;
  if (window.location.pathname.startsWith("/studio")) return false;
  return true;
}

export default function FirstVisitLoader({ wordmark }: { wordmark: string }) {
  const [phase, setPhase] = useState<"idle" | "showing" | "leaving">("idle");
  const [percent, setPercent] = useState(0);
  const locked = useRef(false);

  useEffect(() => {
    if (!introEnabled()) return;

    acquireScrollLock();
    locked.current = true;
    const start = window.setTimeout(() => setPhase("showing"), 0);

    // Smooth counter tick up to 100%
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / (HOLD_MS - 250), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setPercent(Math.round(ease * 100));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    const leaving = window.setTimeout(() => setPhase("leaving"), HOLD_MS);
    const done = window.setTimeout(() => {
      document.documentElement.setAttribute("data-intro", "off");
      setPhase("idle");
      window.dispatchEvent(new CustomEvent("yom:loader-done"));
    }, HOLD_MS + FADE_MS);

    return () => {
      document.documentElement.setAttribute("data-intro", "off");
      if (locked.current) {
        releaseScrollLock();
        locked.current = false;
      }
      cancelAnimationFrame(rafId);
      window.clearTimeout(start);
      window.clearTimeout(leaving);
      window.clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    if (phase !== "idle") return;
    if (locked.current) {
      releaseScrollLock();
      locked.current = false;
    }
  }, [phase]);

  if (phase === "idle") return null;

  const statusLabel =
    percent < 35
      ? "TUNING QUANTUM OSCILLATOR"
      : percent < 80
        ? "SYNCHRONIZING ORBITAL SIGNALS"
        : "TRANSMISSION LOCKED";

  return (
    <div
      className={`loader${phase === "leaving" ? " loader-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${wordmark}`}
    >
      <div className="loader-inner">
        {/* Cinematic 3D Atomic Nucleus */}
        <div className="loader-atom" aria-hidden="true">
          <div className="loader-plane plane-1">
            <div className="loader-ellipse">
              <span className="loader-electron" />
            </div>
          </div>
          <div className="loader-plane plane-2">
            <div className="loader-ellipse">
              <span className="loader-electron electron-purple" />
            </div>
          </div>
          <div className="loader-plane plane-3">
            <div className="loader-ellipse">
              <span className="loader-electron electron-white" />
            </div>
          </div>
          <div className="loader-core">
            <span>Y</span>
          </div>
        </div>

        <p className="loader-wordmark">{wordmark}</p>

        {/* Dynamic Percentage Meter */}
        <div className="loader-counter">
          <span>{String(percent).padStart(3, "0")}%</span>
        </div>

        {/* Segmented Neon Progress Line */}
        <div className="loader-bar" aria-hidden="true">
          <div
            className="loader-bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="loader-label">{statusLabel}</p>
      </div>
    </div>
  );
}
