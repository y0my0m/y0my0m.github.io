import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSiteContent } from "./_content/site";
import CursorStyle from "./_components/cursor-style";
import MusicPlayer from "./_components/music-player";
import MotionRoot from "./_components/motion-root";
import Noise from "./_components/noise";
import CursorSpotlight from "./_components/cursor-spotlight";
import LivingCanvas from "./_components/living-canvas";
import FlowWaves from "./_components/flow-waves";
import ScrollIndicator from "./_components/scroll-indicator";
import BuildCrewController from "./_components/build-crew-controller";
import FirstVisitLoader from "./_components/first-visit-loader";

// Runs before the browser paints, so the shell can appear cleanly while the
// crew and the visible loading layer take over the first-load choreography.
//
// It also decides whether the motion layer is allowed. `data-motion="on"` lets
// CSS hold reveal/split elements hidden until anime.js animates them in, so
// there is never a flash of un-animated content. Reduced-motion visitors get
// "off" and see everything at once, and the <noscript> style is the safety net
// for anyone with JavaScript disabled.
const introGate = `(function(){try{
var k="yom-intro-seen";
var reduced=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
var studio=location.pathname.startsWith("/studio");
document.documentElement.setAttribute("data-intro",(studio||reduced)?"off":"on");
document.documentElement.setAttribute("data-motion",reduced?"off":"on");
}catch(e){document.documentElement.setAttribute("data-intro","off");document.documentElement.setAttribute("data-motion","off");}})();`;

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();
  return { title: site.homeTitle, description: site.homeDescription };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { extras, pictures } = await getSiteContent();
  const volume = Math.min(100, Math.max(0, Number(extras.musicVolume) || 0)) / 100;
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
        {extras.musicTracks.map((track) => <link key={track} rel="preload" as="audio" href={track} />)}
        {pictures.items.filter((picture) => picture.image).map((picture) => <link key={picture.image} rel="preload" as="image" href={picture.image} />)}
        {/* Multiplayer build-crew cursor loading animation */}
        <Script
          id="build-crew"
          src="/build-crew.js"
          strategy="beforeInteractive"
          data-start="manual"
          data-targets="h1, .hero-copy, .hero-orbit, .entry, .note-card, .about-card, .progress-board, .frame"
          data-agents={String(Math.min(12, Math.max(1, Math.round(Number(extras.buildCrewAgents) || 6))))}
          data-names="Yom,Atlas,Nova,Cipher,Echo,Builder"
          data-colors="#c7ff3d,#7654ff,#ff5470,#00e5ff,#ffd166,#8338ec"
          data-speed={String(Math.min(4, Math.max(0.25, Number(extras.buildCrewSpeed) || 0.65)))}
          data-safety="5000"
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-reveal],[data-split]{opacity:1!important}",
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollIndicator />
        <Noise />
        <FlowWaves />
        <LivingCanvas />
        <CursorSpotlight />
        <CursorStyle style={extras.cursor} color={extras.cursorColor} />
        <MotionRoot />
        <BuildCrewController />
        <FirstVisitLoader wordmark="YOM." />
        {children}
        {extras.musicTracks.length ? <MusicPlayer tracks={extras.musicTracks} label={extras.musicLabel} volume={volume} /> : null}
      </body>
    </html>
  );
}
