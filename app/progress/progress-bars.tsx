"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ProgressGroup } from "../_content/site";

function clamp(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

function AnimatedCounter({
  target,
  started,
  duration = 1200,
}: {
  target: number;
  started: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setCount(target));
      return () => cancelAnimationFrame(id);
    }

    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve for elegant acceleration & settle
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(ease * target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [started, target, duration]);

  return <span data-count>{started ? count : 0}%</span>;
}

export default function ProgressBars({
  groups,
  summaryLabel,
}: {
  groups: ProgressGroup[];
  summaryLabel: string;
}) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setStarted(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const overall = groups.length
    ? Math.round(
        groups.reduce((total, group) => total + clamp(group.value), 0) /
          groups.length,
      )
    : 0;

  return (
    <div className="progress-board" ref={ref}>
      <div
        className={`progress-overall${started ? " is-started" : ""}`}
        data-spotlight
        data-reveal="scale"
      >
        <div className="progress-overall-head">
          <span>{summaryLabel}</span>
          <b>
            <AnimatedCounter target={overall} started={started} duration={1400} />
          </b>
        </div>
        <div className="bar-track">
          <div
            className={`bar-fill bar-fill-overall${started ? " is-started" : ""}`}
            style={{ "--bar-target": `${overall}%` } as CSSProperties}
          />
        </div>
      </div>
      <div className="progress-list">
        {groups.map((group, index) => {
          const value = clamp(group.value);
          return (
            <article
              className="progress-row"
              key={group.id || index}
              data-reveal
              data-reveal-delay={index * 80}
              data-spotlight
            >
              <div className="progress-head">
                <h2>{group.label}</h2>
                <b>
                  <AnimatedCounter
                    target={value}
                    started={started}
                    duration={1100 + index * 100}
                  />
                </b>
              </div>
              <div
                className="bar-track"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${group.label}: ${value}%`}
              >
                <div
                  className={`bar-fill${started ? " is-started" : ""}`}
                  style={
                    {
                      "--bar-target": `${value}%`,
                      transitionDelay: `${index * 110}ms`,
                    } as CSSProperties
                  }
                />
              </div>
              <p className="progress-goal">{group.goal}</p>
              <p className="progress-note">{group.note}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
