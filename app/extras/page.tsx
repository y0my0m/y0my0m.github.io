import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../_components/site-chrome";
import { getSiteContent } from "../_content/site";

export const metadata: Metadata = {
  title: "Extras | YOM.",
  description: "Custom transmissions, standalone pages, and experimental notes by Yom.",
};

export default async function ExtrasPage() {
  const { pages, site } = await getSiteContent();

  const customPages = pages && pages.length > 0 ? pages : [
    {
      slug: "colophon",
      title: "Colophon",
      eyebrow: "Behind the curtain",
      headlineStart: "How this corner was",
      headlineEmphasis: "crafted",
      headlineEnd: "& engineered.",
      intro: "Typefaces, motion philosophies, and the invisible architecture behind this space.",
      body: "Built with Next.js static exports, Anime.js physics, Tailwind styling, and handcrafted micro-interactions.",
    }
  ];

  return (
    <PageShell site={site}>
      <section className="page-intro wrap">
        <p className="eyebrow" data-reveal>
          <span /> Transmissions &amp; Extras
        </p>
        <h1 data-reveal data-reveal-delay="90">
          Standalone <em className="shiny-text">pages</em> &amp; artifacts.
        </h1>
        <p data-reveal data-reveal-delay="180">
          Curated custom pages, colophons, setups, and experiments created through Studio.
        </p>
      </section>

      <section className="wrap page-gallery" style={{ paddingTop: 0 }}>
        {customPages.map((page, index) => {
          const tidalClass =
            index % 3 === 0
              ? "tide-bob"
              : index % 3 === 1
                ? "tide-bob-delayed"
                : "tide-bob-slow";
          return (
            <article
              key={page.slug}
              className={`frame ${tidalClass}`}
              data-reveal="scale"
              data-reveal-delay={index * 90}
              data-tilt="5"
              data-spotlight
              style={{
                background: "rgba(36, 35, 39, 0.95)",
                color: "#f7f5ef",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      font: "800 10px/1 monospace",
                      letterSpacing: "0.14em",
                      color: "var(--lime)",
                      textTransform: "uppercase",
                    }}
                  >
                    /P/{page.slug}
                  </span>
                  <span
                    style={{
                      font: "700 9px/1 Arial, sans-serif",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                    }}
                  >
                    {page.eyebrow}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 760,
                    marginBottom: "10px",
                    lineHeight: "1.15",
                  }}
                >
                  {page.title}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.68)",
                    margin: 0,
                  }}
                >
                  {page.intro}
                </p>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  className="text-link"
                  href={`/p/${page.slug}`}
                  data-magnetic="6"
                  style={{ borderColor: "rgba(255,255,255,0.3)" }}
                >
                  Read transmission <b>↗</b>
                </Link>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--purple)",
                    fontFamily: "monospace",
                  }}
                >
                  0{index + 1}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="gallery-foot wrap" data-reveal>
        <p>Looking for the human behind these notes?</p>
        <Link className="text-link" href="/about" data-magnetic="6">
          A little about me <b>↗</b>
        </Link>
      </section>
    </PageShell>
  );
}
