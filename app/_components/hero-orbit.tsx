"use client";

import { useEffect, useRef } from "react";

/**
 * HeroOrbit is an authentic 3D Rutherford/Bohr atomic engine:
 * - 3 inclined elliptical orbital planes intersecting in 3D space.
 * - Glowing electrons revolving smoothly along each distinct orbit path.
 * - Central pulsating nucleus with ambient breathing aura.
 * - Real-time gyroscopic tilting responding to cursor coordinates with spring physics.
 */
export default function HeroOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nucleusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    let targetRx = 0;
    let targetRy = 0;
    let currentRx = 0;
    let currentRy = 0;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);

      targetRy = Math.max(-20, Math.min(20, dx * 18));
      targetRx = Math.max(-20, Math.min(20, -dy * 18));
    };

    const onPointerLeave = () => {
      targetRx = 0;
      targetRy = 0;
    };

    const loop = () => {
      currentRx += (targetRx - currentRx) * 0.08;
      currentRy += (targetRy - currentRy) * 0.08;

      el.style.transform = `perspective(1000px) rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  const onNucleusClick = () => {
    const core = nucleusRef.current;
    if (!core) return;
    core.style.transform = "scale(0.85)";
    setTimeout(() => {
      core.style.transform = "scale(1.12)";
      setTimeout(() => {
        core.style.transform = "";
      }, 220);
    }, 120);
  };

  return (
    <div
      ref={containerRef}
      className="orbit-living"
      aria-hidden="true"
      data-reveal="scale"
      data-reveal-delay="160"
    >
      <div className="atom-system">
        {/* Orbital Plane 1: -32deg tilt */}
        <div className="atom-plane plane-1">
          <div className="atom-ellipse">
            <div className="electron-revolver rev-1">
              <span className="electron-dot electron-lime" />
            </div>
          </div>
        </div>

        {/* Orbital Plane 2: +38deg tilt */}
        <div className="atom-plane plane-2">
          <div className="atom-ellipse">
            <div className="electron-revolver rev-2">
              <span className="electron-dot electron-purple" />
            </div>
          </div>
        </div>

        {/* Orbital Plane 3: 92deg vertical tilt */}
        <div className="atom-plane plane-3">
          <div className="atom-ellipse">
            <div className="electron-revolver rev-3">
              <span className="electron-dot electron-white" />
            </div>
          </div>
        </div>

        {/* Central Atomic Nucleus */}
        <div
          ref={nucleusRef}
          className="atom-nucleus"
          onClick={onNucleusClick}
          title="Click to pulse the atomic core"
        >
          <div className="nucleus-aura" />
          <div className="nucleus-core">
            <span>Y</span>
          </div>
        </div>

        {/* Floating Editorial Badges */}
        <div className="atom-tag tag-a levitate-float">
          <span>thinking<br />out loud</span>
        </div>
        <div className="atom-tag tag-b levitate-float-delayed">
          <span>est. 2026</span>
        </div>
      </div>
    </div>
  );
}
