import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../_components/site-chrome";
import { getSiteContent } from "../_content/site";
import GalleryGrid from "./gallery-grid";

export const metadata: Metadata = { title: "Pictures | YOM.", description: "Photographs and sketches collected by Yom." };

export default async function PicturesPage() {
  const { pictures, site } = await getSiteContent();
  return (
    <PageShell site={site}>
      <section className="page-intro wrap">
        <p className="eyebrow" data-reveal>
          <span /> {pictures.eyebrow}
        </p>
        <h1 data-reveal data-reveal-delay="90">
          {pictures.headlineStart}{" "}
          <em className="shiny-text">{pictures.headlineEmphasis}</em>{" "}
          {pictures.headlineEnd}
        </h1>
        <p data-reveal data-reveal-delay="180">
          {pictures.intro}
        </p>
      </section>

      <GalleryGrid items={pictures.items} />

      <section className="gallery-foot wrap" data-reveal>
        <p>More frames are on their way.</p>
        <Link className="text-link" href="/progress" data-magnetic="6">
          See what I&rsquo;m working on <b>↗</b>
        </Link>
      </section>
    </PageShell>
  );
}
