import Link from "next/link";
import { SiteFooter, SiteHeader } from "./_components/site-chrome";
import Aurora from "./_components/aurora";
import HeroOrbit from "./_components/hero-orbit";
import { getSiteContent } from "./_content/site";

export default async function Home() {
  const content = await getSiteContent();
  return (
    <main className="site-shell">
      <Aurora />
      <SiteHeader site={content.site} />

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow" data-reveal><span /> {content.home.eyebrow}</p>
          <h1 data-split>{content.home.headlineStart} <em className="shiny-text">{content.home.headlineEmphasis}</em> {content.home.headlineEnd}</h1>
          <p className="intro" data-reveal data-reveal-delay="120">{content.home.intro}</p>
          <div className="hero-actions" data-reveal data-reveal-delay="220">
            <Link className="button button-solid" href="/writing" data-magnetic="10">Read the latest <b>↘</b></Link>
            <Link className="button button-quiet" href="/about" data-magnetic="10">A little about me <b>→</b></Link>
          </div>
        </div>
        <HeroOrbit />
      </section>

      <section className="ticker" aria-label="Topics"><div className="ticker-track">{[...content.home.topics, ...content.home.topics, ...content.home.topics].map((tag, index) => <span key={index}>{tag} <b>✦</b></span>)}</div></section>

      <section className="writing wrap" id="writing">
        <div className="section-head" data-reveal><div><p className="eyebrow"><span /> {content.home.writingLabel}</p><h2>{content.home.writingStart} <em className="shiny-text">{content.home.writingEmphasis}</em></h2></div><Link className="text-link" href="/writing" data-magnetic="6">{content.home.archiveLabel} <b>↗</b></Link></div>
        <div className="entry-list">{content.entries.map((entry, index) => (
          <article className="entry" key={entry.number} data-reveal data-reveal-delay={index * 90} data-spotlight>
            <div className="entry-number">{entry.number}</div>
            <div className="entry-main"><div className="entry-meta"><span>{entry.date}</span><b>{entry.category}</b></div><h3>{entry.title}</h3><p>{entry.excerpt}</p></div>
            <Link className="entry-arrow" href="/writing" aria-label={"Read " + entry.title} data-magnetic="8">↗</Link>
          </article>
        ))}</div>
      </section>

      <section className="about wrap" data-reveal="scale"><div className="about-card" data-spotlight data-tilt="4">
        <div className="about-aside"><p className="eyebrow"><span /> {content.about.eyebrow}</p><div className="portrait" data-tilt="8"><div className="portrait-sun" /><span>Y</span></div></div>
        <div className="about-copy"><h2>{content.about.headlineStart} <em className="shiny-text">{content.about.headlineEmphasis}</em> {content.about.headlineEnd}</h2><p>{content.about.intro}</p><Link className="text-link" href="/contact" data-magnetic="6">Say hello <b>↗</b></Link></div>
      </div></section>
      <SiteFooter site={content.site} />
    </main>
  );
}