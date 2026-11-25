"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate, set, stagger, splitText, scrambleText } from "animejs";

/**
 * MotionRoot is the single anime.js orchestrator for the whole site. It is
 * mounted once in the root layout and re-runs whenever the route changes, so
 * every page gets the same motion language:
 *
 *   [data-split]            — heading whose words rise into view behind a clip
 *   [data-reveal]           — element that fades / slides in when scrolled to
 *   [data-reveal="left"]    — variants: up (default), fade, left, right, scale
 *   [data-reveal-delay="120"] — extra delay in ms
 *   [data-scramble]         — short label that decodes itself on reveal
 *   [data-spotlight]        — card that glows toward the cursor
 *   [data-magnetic="10"]    — element that leans toward the cursor (px)
 *   [data-tilt]             — card that tilts in 3D toward the cursor
 *
 * Everything is skipped when the visitor prefers reduced motion, and the
 * pointer effects only bind on devices with a fine pointer (mouse / trackpad).
 * The initial hidden state is applied by CSS (gated on html[data-motion="on"])
 * so there is never a flash of content before the animation starts.
 */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const hasFinePointer = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(pointer: fine)").matches;

type Cleanup = () => void;

export default function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReduced()) return;

    const cleanups: Cleanup[] = [];

    /* ---------------------------------------------------------- Split headings */
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (el.dataset.motionDone === "1") return;
      el.dataset.motionDone = "1";

      let splitter: { revert: () => unknown; words: HTMLElement[] } | null = null;
      try {
        splitter = splitText(el, {
          words: { class: "w", wrap: "clip" },
          accessible: true,
        }) as unknown as { revert: () => unknown; words: HTMLElement[] };
      } catch {
        splitter = null;
      }

      const words = splitter?.words ?? [];
      if (!words.length) {
        set(el, { opacity: 1 });
        return;
      }

      // Park each word below its clip mask, reveal the block, then let the
      // words rise in sequence.
      set(words, { y: "118%" });
      set(el, { opacity: 1 });
      animate(words, {
        y: ["118%", "0%"],
        duration: 900,
        ease: "outExpo",
        delay: stagger(55),
      });

      cleanups.push(() => {
        try {
          splitter?.revert();
        } catch {
          /* node already detached by the router */
        }
      });
    });

    /* --------------------------------------------------------- Scroll reveals */
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const reveal = (el: HTMLElement) => {
      const variant = el.dataset.reveal || "up";
      const delay = Number(el.dataset.revealDelay || 0) || 0;
      const params: Record<string, unknown> = {
        opacity: [0, 1],
        duration: 760,
        ease: "outExpo",
        delay,
      };
      if (variant === "left") params.x = [-30, 0];
      else if (variant === "right") params.x = [30, 0];
      else if (variant === "scale") params.scale = [0.94, 1];
      else if (variant !== "fade") params.y = [26, 0];
      animate(el, params as Parameters<typeof animate>[1]);
    };

    if (typeof IntersectionObserver === "undefined") {
      revealEls.forEach(reveal);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      revealEls.forEach((el) => observer.observe(el));
      cleanups.push(() => observer.disconnect());
    }

    /* -------------------------------------------------------------- Scramble */
    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      if (el.dataset.motionDone === "1") return;
      el.dataset.motionDone = "1";
      const targetText = el.textContent || "";
      animate(el, {
        textContent: scrambleText({ text: targetText, chars: "uppercase" }),
        duration: 720,
        ease: "linear",
      });
      cleanups.push(() => {
        el.textContent = targetText;
      });
    });

    /* ------------------------------------------------- Fine-pointer flourishes */
    if (hasFinePointer()) {
      // Spotlight: a soft glow that follows the cursor across a card.
      document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((el) => {
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          el.style.setProperty("--my", `${event.clientY - rect.top}px`);
        };
        const leave = () => {
          el.style.removeProperty("--mx");
          el.style.removeProperty("--my");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      // Magnetic: the element leans toward the cursor, then springs home.
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const max = Number(el.dataset.magnetic || 8) || 8;
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const clamp = (value: number) => Math.max(-max, Math.min(max, value));
          animate(el, {
            x: clamp(dx * 0.18),
            y: clamp(dy * 0.22),
            duration: 320,
            ease: "outQuad",
          });
        };
        const leave = () =>
          animate(el, { x: 0, y: 0, duration: 620, ease: "outElastic(1, .55)" });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      // Tilt: a gentle 3D lean for picture frames and the portrait.
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const factor = Number(el.dataset.tilt || 7) || 7;
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          animate(el, {
            rotateY: px * factor,
            rotateX: -py * factor,
            duration: 300,
            ease: "outQuad",
          });
        };
        const leave = () =>
          animate(el, { rotateY: 0, rotateX: 0, duration: 620, ease: "outElastic(1, .5)" });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    /* --------------------------------------------------------- Tactile Ripple */
    const onDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        ".button, .text-link, .copy-button, .entry, .nav-links a, .lightbox-close",
      );
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };
    document.addEventListener("click", onDocumentClick, { passive: true });
    cleanups.push(() => document.removeEventListener("click", onDocumentClick));

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}