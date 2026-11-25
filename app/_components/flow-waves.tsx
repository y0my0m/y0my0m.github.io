"use client";

import { useEffect, useRef } from "react";

type Wave = { base: number; amplitude: number; wavelength: number; speed: number; phase: number; color: string; width: number };

/** A quiet, pointer-reactive wave field that never participates in layout. */
export default function FlowWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0; let height = 0; let dpr = 1; let frame = 0; let pointer = 0.5; let pointerTarget = 0.5;
    const waves: Wave[] = [
      { base: 0.22, amplitude: 18, wavelength: 470, speed: 0.00028, phase: 0.2, color: "118,84,255", width: 1.2 },
      { base: 0.39, amplitude: 25, wavelength: 620, speed: -0.0002, phase: 2.1, color: "199,255,61", width: 1 },
      { base: 0.58, amplitude: 32, wavelength: 760, speed: 0.00016, phase: 4.2, color: "118,84,255", width: 1.4 },
      { base: 0.78, amplitude: 20, wavelength: 520, speed: -0.00024, phase: 1.4, color: "199,255,61", width: 0.9 },
    ];
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr)); canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => { pointerTarget = Math.max(0, Math.min(1, event.clientX / Math.max(width, 1))); };
    const draw = (now: number) => {
      pointer += (pointerTarget - pointer) * 0.035; context.clearRect(0, 0, width, height); context.lineCap = "round";
      for (const wave of waves) {
        const breath = 1 + Math.sin(now * 0.00045 + wave.phase) * 0.08; const center = height * wave.base; const drift = (pointer - 0.5) * 24;
        context.beginPath();
        for (let x = -24; x <= width + 24; x += 18) {
          const phase = (x + drift) / wave.wavelength * Math.PI * 2 + now * wave.speed + wave.phase;
          const y = center + Math.sin(phase) * wave.amplitude * breath + Math.sin(phase * 0.47 + wave.phase) * wave.amplitude * 0.22;
          if (x === -24) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(${wave.color}, ${reduced.matches ? 0.08 : 0.16})`; context.lineWidth = wave.width; context.stroke();
      }
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize, { passive: true }); window.addEventListener("pointermove", move, { passive: true });
    if (reduced.matches) draw(0); else frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);

  return <canvas ref={canvasRef} className="flow-waves" aria-hidden="true" />;
}
