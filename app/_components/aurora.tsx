"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

/**
 * A slow, drifting aurora that sits behind the page content. It replaces the
 * two static `.ambient` blobs with three soft colour fields that breathe on
 * independent loops, giving the paper background a little life without ever
 * competing with the type. Pure transform animation (GPU friendly), and it
 * stays completely still when the visitor prefers reduced motion.
 */
export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const root = ref.current;
    if (!root) return;

    const blobs = Array.from(root.querySelectorAll<HTMLElement>(".aurora-blob"));
    const animations = blobs.map((blob, index) =>
      animate(blob, {
        x: [
          { to: 46 - index * 14, duration: 7000 + index * 1500 },
          { to: -38 + index * 10, duration: 9000 - index * 800 },
          { to: 46 - index * 14, duration: 7000 + index * 1500 },
        ],
        y: [
          { to: -34 + index * 12, duration: 8000 },
          { to: 26 - index * 8, duration: 7000 },
          { to: -34 + index * 12, duration: 8000 },
        ],
        scale: [
          { to: 1.12, duration: 9000 },
          { to: 0.94, duration: 8000 },
          { to: 1.12, duration: 9000 },
        ],
        loop: true,
        ease: "inOutSine",
      }),
    );

    return () => animations.forEach((animation) => animation.revert());
  }, []);

  return (
    <div className="aurora" ref={ref} aria-hidden="true">
      <span className="aurora-blob blob-a" />
      <span className="aurora-blob blob-b" />
      <span className="aurora-blob blob-c" />
    </div>
  );
}