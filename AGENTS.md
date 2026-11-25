<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# YOM. site handoff guide

This is the project map for future agents. The repository is a personal static portfolio/experimental site for Yomitha: a dark editorial interface with paper-like typography, purple/lime accents, ambient particles, optional music, and an animated loading/build sequence.

## Current project state

- Framework: Next.js `16.3.4`, React `19`, TypeScript, Tailwind CSS v4, and Anime.js `4.5`.
- Output: static export (`output: "export"`) with trailing slashes in `next.config.ts`; intended for GitHub Pages or another static host.
- Package manager: pnpm. Main commands are `pnpm dev`, `pnpm lint`, and `pnpm build`.
- Local preview: `http://localhost:3000`.
- Preserve unrelated user changes in the working tree. Never use destructive reset/checkout commands without explicit authorization.

## Route map

- `/` — hero, atom/orbit centerpiece, recent writing, topics, and about card.
- `/writing/` — writing archive from `site.json`.
- `/pictures/` — gallery and client lightbox; shows styled sample frames if no pictures are configured.
- `/progress/` — progress dashboard with animated bars.
- `/extras/` — custom-page index and experimental features.
- `/p/[slug]/` — statically generated custom routes from the `pages` array.
- `/about/` — about page.
- `/contact/` — contact page and copy-email interaction.
- `/studio/` — client-only content editor that downloads an edited `site.json`; it is not a server CMS.

## Content model

The source of truth is `app/_content/site.json`. `app/_content/site.ts` reads it on the server, fills safe defaults, and discovers audio files.

- `site`: identity, navigation labels, browser title/description, signal, and footer text.
- `home`, `writing`, `about`, `contact`: page copy and headings.
- `pictures.items`: `{ id, title, caption, context, place, date, image, tone }`. `image` is a public path; empty means a styled placeholder.
- `progress.groups`: `{ id, label, goal, value, note }`.
- `extras`: cursor mode/color, music label/volume, `buildCrewAgents`, and `buildCrewSpeed`.
- `entries`: writing items with number/date/title/excerpt/category.
- `pages`: `{ slug, title, eyebrow, headlineStart, headlineEmphasis, headlineEnd, intro, body }`, rendered at `/p/[slug]`.

Studio changes React state only. “Download changes” creates a file; the user must replace `app/_content/site.json` and commit it to publish. Do not claim Studio writes to the repository. Studio supports adding/removing entries, pictures, progress groups, and custom pages. Slugs are restricted to lowercase letters, numbers, hyphens, and underscores.

## Audio, images, and preloading

Audio is discovered from `public/audio/` at build time. Supported extensions: `.mp3`, `.m4a`, `.wav`, `.ogg`, `.aac`. Filenames are naturally sorted and URL-encoded. Do not hand-maintain audio paths in `site.json`.

`app/layout.tsx` emits preload links for discovered audio and configured picture images. `MusicPlayer` uses `preload="auto"`, but playback remains opt-in because browsers block unsolicited audio. Visible track labels must run through `decodeURIComponent` so `%20` never appears in the UI. Configured gallery images use eager loading; do not add unbounded external preloads.

## Root layout and boundaries

`app/layout.tsx` is a server component. It loads normalized content, metadata, preload hints, and the `next/script` Build Crew configuration, then mounts global client components. Browser APIs, event handlers, animation state, and local storage belong in files marked `"use client"`.

Global components include:

- `Noise`, `LivingCanvas`, `Aurora`, `CursorSpotlight`: decorative ambient layers.
- `CursorStyle`: optional dot cursor.
- `MotionRoot`: Anime.js reveals, magnetic links, tilt, spotlight, scramble text, and ripples.
- `BuildCrewController`: restarts the crew after pathname changes.
- `FirstVisitLoader`: visible loading overlay on normal full loads; Studio is excluded.
- `MusicPlayer`: optional audio player when discovered tracks exist.

## Loading and Build Crew lifecycle

The shell/background/nav render immediately. `public/build-crew.js` hides selected content targets, then agents frame and reveal them. The atomic loader completes first; it dispatches `yom:loader-done`, and the public crew starts only after that event. The crew overlay has a higher z-index so the construction remains visible.

The loader total must stay under two seconds (`HOLD_MS + FADE_MS`). The current crew safety timer is five seconds. `finish()` is the final safety path: it reveals all targets, cancels animations, removes listeners/styles/overlay, and dispatches `buildcrew:done`.

The standalone script uses the Web Animations API and reads its script tag with `document.currentScript` plus a `querySelector('script[src$="/build-crew.js"]')` fallback because Next may wrap `next/script`.

Invariants:

- The `data-targets` selector must match actual rendered targets: headings, hero copy/orbit, entries, cards, progress board, and gallery frames.
- The crew queues all targets, including below-fold content. Do not reveal below-fold targets directly through an observer.
- `BuildCrew.restart()` must reset hidden-target state on client-side route changes.
- Scroll and resize finish the run because document-coordinate measurements become stale.
- Agents fade out where they finish and are removed in `finally`; never fly them back to corners during teardown.
- If Web Animations API is unavailable or reduced motion is requested, fail open and show content immediately.
- Keep crew count bounded to 1–12 and speed bounded to a sensible range.

## Motion system

`app/_components/motion-root.tsx` reruns on pathname changes. It supports `[data-reveal]` variants (`up`, `fade`, `left`, `right`, `scale`), delay attributes, `[data-scramble]`, `[data-spotlight]`, `[data-magnetic]`, `[data-tilt]`, and click ripples. `app/globals.css` also contains ambient orbit, canvas, shiny text, levitation, progress, music, loader, and mobile-menu animations.

Respect `prefers-reduced-motion`. Use compositor-friendly opacity/transforms, avoid multiple writers fighting over the same transform, and preserve pointer/keyboard accessibility. Decorative overlays must not intercept pointer events. Coarse-pointer devices should remain fully usable.

## Navigation and Studio

Shared top/footer navigation is in `app/_components/site-chrome.tsx`. The public nav is Home, Writing, Pictures, Progress, Extras, About, Contact. Mobile navigation is in `mobile-menu.tsx`. Footer links must point to real distinct routes.

Studio navigation sections cover site, home, writing, pictures, progress, about, contact, custom pages, extras, and Build Crew. If adding a new content setting, update the TypeScript type, defaults, JSON, Studio field, layout wiring, and this document.

## Performance and device support

- Keep shell and navigation fast; asset preloads should cover known local assets only.
- Cap canvas/device-pixel-ratio work and skip decorative loops for reduced motion.
- Keep pointer effects disabled/degraded on coarse pointers.
- Test responsive breakpoints at 800px and 420px plus narrow mobile widths.
- Preserve focus-visible styling and semantic buttons/links.
- Scroll locking is reference-counted in `app/_components/scroll-lock.ts`; loader, mobile menu, and gallery lightbox must acquire/release locks instead of writing `body.style.overflow` directly.
- `FirstVisitLoader` must set `data-intro="off"` when it finishes; the CSS gate keeps body scrolling disabled while `data-intro="on"`.
- Keep audio user-initiated; never force sound autoplay.
- Avoid layout-triggering work inside pointer or animation loops.

## Verification checklist

1. Read the relevant Next guide under `node_modules/next/dist/docs/` before changing framework behavior.
2. Run `pnpm lint`.
3. Run `node --check public/build-crew.js` after editing the standalone script.
4. Run `pnpm build` and confirm expected routes are generated.
5. Preview `/`, `/writing/`, `/pictures/`, `/progress/`, `/extras/`, `/p/colophon/`, and `/studio/`.
6. Test full reload, top-nav client navigation, scroll/resize during crew animation, reduced motion, and narrow mobile layout.
7. Confirm the loader exits under two seconds, the crew starts afterward, no cursor remains in a corner, and no target remains hidden.
8. Confirm audio labels contain no `%20` and Studio remains downloadable.

## History of major changes

- Added Extras navigation and dynamic `/p/[slug]` pages.
- Added Studio editing for pages, pictures, progress, cursor, audio, and Build Crew settings.
- Added Anime.js motion, ambient canvas/aurora/noise, cursor spotlight, magnetic links, tilt, ripples, lightbox, progress animation, and mobile menu.
- Replaced manual audio paths with automatic `public/audio/` discovery.
- Added atomic loading overlay and Build Crew choreography.
- Fixed URL-encoded labels, Next synchronous-script linting, route restarts, scroll/resize drift, stranded corner cursors, missing loader mounting, script-config loss, and blank-page safety failures.
- Added local audio/image preloads to reduce interaction lag.

## Regression log and future repair notes

- **Permanent no-scroll after loading:** every FirstVisitLoader exit must set `data-intro="off"`; removing only the overlay is insufficient because the CSS gate still locks the body.
- **Competing scroll locks:** menus, lightboxes, and loaders use the reference-counted `scroll-lock.ts`; never write `body.style.overflow` directly.
- **Smooth-scroll route warnings:** this project intentionally uses `scroll-behavior: auto`; recheck Next route-transition guidance before changing it.
- **Stranded Build Crew cursors:** teardown must reveal targets and remove agents in `finally`; never fly agents back to viewport corners.
- **Missing crew configuration:** keep both `document.currentScript` and the `/build-crew.js` selector fallback because `next/script` may wrap the script.
- **Blank or half-built pages:** retain the five-second safety finish and make `finish()` fail open by revealing targets and removing overlays/listeners.
- **Loader/crew ordering:** normal pages use `data-start="manual"` and `yom:loader-done`; Studio intentionally starts immediately.
- **Encoded labels:** decode filenames exactly once at the display boundary so `%20` never appears, while route URLs remain encoded.
- **Dark mode:** it was explicitly removed; do not reintroduce theme gates or toggles without a new request.
- **Decorative animation/layout:** FlowWaves, LivingCanvas, Noise, and cursor effects must stay fixed/absolute, `pointer-events: none`, and never create scroll dimensions. Canvas resize must reset its transform instead of stacking `scale()` calls.
- **Device performance:** cap canvas DPR, stop rAF loops on unmount, and render a static visible fallback for reduced motion.

Before handing off motion changes, visually check fresh load, client navigation, scroll/resize during loading, `/studio/`, lightbox, mobile menu, reduced motion, and a narrow viewport. Earlier bugs were mostly lifecycle and visual-state bugs, so lint/build alone is not sufficient.

When uncertain, prefer a small reversible change, preserve static export, and verify the rendered route instead of trusting only TypeScript.
