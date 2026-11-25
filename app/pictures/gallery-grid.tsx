/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import type { Picture } from "../_content/site";
import { acquireScrollLock, releaseScrollLock } from "../_components/scroll-lock";

const defaultSamplePictures: Picture[] = [
  {
    id: "sample-1",
    title: "Quiet Geometry",
    caption: "Sunlight slicing through concrete shadows at dawn.",
    context: "Captured on an early morning walk through the city when the streets were silent and empty.",
    place: "Colombo, Sri Lanka",
    date: "November 2026",
    image: "",
    tone: "lime",
  },
  {
    id: "sample-2",
    title: "Neon Afterglow",
    caption: "Reflections caught in the drizzle of the midnight commute.",
    context: "Waiting for the late train home, listening to ambient tapes with cold air on the platform.",
    place: "Metro Line 03",
    date: "October 2026",
    image: "",
    tone: "purple",
  },
];

export default function GalleryGrid({ items }: { items: Picture[] }) {
  const [activeItem, setActiveItem] = useState<Picture | null>(null);
  const displayItems = items.length ? items : defaultSamplePictures;

  // ESC key handler for lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    if (activeItem) {
      window.addEventListener("keydown", onKeyDown);
      acquireScrollLock();
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      releaseScrollLock();
    };
  }, [activeItem]);

  const tone = (value: string) => (["lime", "purple", "ink"].includes(value) ? value : "lime");

  return (
    <>
      <section className="gallery wrap page-gallery">
        {displayItems.map((picture, index) => {
          const levitateClass =
            index % 3 === 0
              ? "levitate-float"
              : index % 3 === 1
                ? "levitate-float-delayed"
                : "levitate-float-slow";
          return (
            <figure
              className={`frame ${levitateClass}`}
              key={picture.id || index}
              data-reveal="scale"
              data-reveal-delay={(index % 2) * 110}
              data-tilt="6"
              data-spotlight
              onClick={() => setActiveItem(picture)}
            >
            <div className={`frame-image tone-${tone(picture.tone)}`}>
              {picture.image ? (
                <img src={picture.image} alt={picture.title} loading="eager" decoding="async" />
              ) : (
                <div className="frame-placeholder">
                  <span className="frame-mark">✦</span>
                  <p>Slot {String(index + 1).padStart(2, "0")}</p>
                  <small>{items.length ? "Custom picture frame." : "Preview frame. Click to enlarge."}</small>
                </div>
              )}
              <div className="frame-zoom-badge" aria-hidden="true">
                ↗
              </div>
            </div>
            <figcaption className="frame-caption">
              <h2>{picture.title}</h2>
              <p>{picture.caption}</p>
            </figcaption>
            <div className="context-box" data-spotlight>
              <p className="context-label">CONTEXT</p>
              <p className="context-body">{picture.context}</p>
              <div className="context-meta">
                <span>{picture.place}</span>
                <b>{picture.date}</b>
              </div>
            </div>
          </figure>
          );
        })}
      </section>

      {/* Lightbox Modal (Watermelon UI / Kokonut UI style) */}
      {activeItem && (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveItem(null);
          }}
        >
          <div className="lightbox-card" data-spotlight>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setActiveItem(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className={`lightbox-img-wrap tone-${tone(activeItem.tone)}`}>
              {activeItem.image ? (
                <img src={activeItem.image} alt={activeItem.title} />
              ) : (
                <div className="frame-placeholder py-12">
                  <span className="frame-mark text-4xl">✦</span>
                  <p className="mt-2 font-bold tracking-widest">{activeItem.title}</p>
                  <small className="opacity-75">{activeItem.place} · {activeItem.date}</small>
                </div>
              )}
            </div>
            <div className="lightbox-details">
              <h2>{activeItem.title}</h2>
              <p>{activeItem.caption}</p>
              <div className="context-box mt-4" data-spotlight>
                <p className="context-label">CONTEXT NOTE</p>
                <p className="context-body">{activeItem.context}</p>
                <div className="context-meta">
                  <span>{activeItem.place}</span>
                  <b>{activeItem.date}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
