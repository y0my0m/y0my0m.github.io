import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "../_content/site";
import { PageShell } from "../_components/site-chrome";

export const metadata: Metadata = { title: "Writing | YOM.", description: "Notes, ideas, and moments from Yom." };

export default async function WritingPage() {
  const { entries, writing, site } = await getSiteContent();
  return <PageShell site={site}><section className="page-intro wrap"><p className="eyebrow" data-reveal><span /> {writing.eyebrow}</p><h1 data-reveal data-reveal-delay="90">{writing.headlineStart} <em className="shiny-text">{writing.headlineEmphasis}</em> {writing.headlineEnd}</h1><p data-reveal data-reveal-delay="180">{writing.intro}</p></section><section className="writing wrap page-writing"><div className="entry-list">{entries.map((entry, index) => <article id={`note-${entry.number}`} className="entry" key={entry.number} data-reveal data-reveal-delay={index * 80} data-spotlight><div className="entry-number">{entry.number}</div><div className="entry-main"><div className="entry-meta"><span>{entry.date}</span><b>{entry.category}</b></div><h2>{entry.title}</h2><p>{entry.excerpt}</p></div><Link className="entry-arrow" href="/contact" aria-label={`Ask about ${entry.title}`} data-magnetic="8">↗</Link></article>)}</div><div className="writing-more" data-reveal><Link className="button button-solid" href="/p/writing/" data-magnetic="8">View more <b>↗</b></Link></div></section></PageShell>;
}
