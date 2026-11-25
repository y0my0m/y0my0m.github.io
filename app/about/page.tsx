import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../_components/site-chrome";
import { getSiteContent } from "../_content/site";

export const metadata: Metadata = { title: "About | YOM.", description: "A little about Yom." };

export default async function AboutPage() {
  const { about, site } = await getSiteContent();
  return <PageShell site={site}><section className="page-intro wrap"><p className="eyebrow" data-reveal><span /> {about.eyebrow}</p><h1 data-reveal data-reveal-delay="90">{about.headlineStart} <em className="shiny-text">{about.headlineEmphasis}</em> {about.headlineEnd}</h1><p data-reveal data-reveal-delay="180">{about.intro}</p></section><section className="about wrap about-page"><div className="about-card" data-reveal="scale" data-tilt="5" data-spotlight><div className="about-aside"><div className="portrait"><div className="portrait-sun" /><span>Y</span></div></div><div className="about-copy"><h2>{about.cardTitle}</h2><p>{about.body}</p><Link className="text-link" href="/contact" data-magnetic="6">{about.contactLabel} <b>↗</b></Link></div></div></section></PageShell>;
}
