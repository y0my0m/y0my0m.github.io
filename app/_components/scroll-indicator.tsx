"use client";

import { useEffect, useState } from "react";

/**
 * ScrollIndicator provides:
 * 1. A reading progress bar across the very top edge of the window.
 * 2. A floating Back-to-Top button that emerges gracefully when scrolled down.
 */
export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
      setProgress(ratio);
      setShowTop(scrollY > 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[99] pointer-events-none origin-left"
        style={{
          background: "linear-gradient(90deg, #7654ff 0%, #c7ff3d 100%)",
          transform: `scaleX(${progress / 100})`,
          transition: "transform 0.1s linear",
          boxShadow: "0 0 10px rgba(199, 255, 61, 0.7)",
        }}
        aria-hidden="true"
      />

      {/* Floating Back to Top Button */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 z-50 w-11 h-11 rounded-full border border-black/15 bg-paper/90 backdrop-blur-md shadow-lg flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110 hover:bg-lime hover:border-lime active:scale-95"
          style={{ background: "rgba(245, 243, 238, 0.88)" }}
          aria-label="Back to top"
          data-magnetic="6"
        >
          ↑
        </button>
      )}
    </>
  );
}
