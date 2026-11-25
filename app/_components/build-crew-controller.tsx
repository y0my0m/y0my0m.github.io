"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    BuildCrew?: { restart: () => void };
  }
}

/** Restarts the cinematic crew after a client-side route transition. */
export default function BuildCrewController() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => window.BuildCrew?.restart());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
