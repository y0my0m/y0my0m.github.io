import type { Metadata } from "next";
import { PageShell } from "../_components/site-chrome";
import { getSiteContent } from "../_content/site";
import GameBoard from "./game-board";

export const metadata: Metadata = { title: "Game | YOM.", description: "A tiny snowball challenge hidden inside YOM." };

export default async function GamePage() {
  const { site } = await getSiteContent();
  return <PageShell site={site}><section className="page-intro wrap"><p className="eyebrow" data-reveal><span /> Undertales / challenge</p><h1 data-reveal data-reveal-delay="90">Win the <em className="shiny-text">ball game.</em></h1><p data-reveal data-reveal-delay="180">A small snowy recreation of the hardest challenge: move carefully, push the ball, and find the flag.</p><p className="game-credit">Inspired by Aaraiz Kashif.</p></section><GameBoard /></PageShell>;
}
