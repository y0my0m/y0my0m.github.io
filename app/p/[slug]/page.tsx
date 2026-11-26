import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "../../_components/site-chrome";
import { getSiteContent } from "../../_content/site";

export async function generateStaticParams() {
  const content = await getSiteContent();
  const pages = content.pages ?? [];
  if (!pages.length) return [{ slug: "colophon" }];
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const page = (content.pages ?? []).find((p) => p.slug === slug);
  if (!page) return { title: "Page | YOM." };
  return {
    title: `${page.title} | ${content.site.name}`,
    description: page.intro,
  };
}

export default async function CustomDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getSiteContent();
  const page = (content.pages ?? []).find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <PageShell site={content.site}>
      <section className="page-intro wrap">
        <p className="eyebrow" data-reveal>
          <span /> {page.eyebrow || "Transmitted page"}
        </p>
        <h1 data-reveal data-reveal-delay="90">
          {page.headlineStart}{" "}
          <em className="shiny-text">{page.headlineEmphasis}</em>{" "}
          {page.headlineEnd}
        </h1>
        <p data-reveal data-reveal-delay="180">
          {page.intro}
        </p>
      </section>

      <section className="about wrap about-page" data-reveal="scale">
        <div className="about-card" data-spotlight data-tilt="4">
          <div className="about-copy" style={{ maxWidth: "780px" }}>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">
              {page.title}
            </h2>
            <div
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.75",
                fontSize: "16px",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {page.body}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <Link className="text-link" href={slug === "writing" ? "/writing" : "/"} data-magnetic="6">
                {slug === "writing" ? "Read all writing" : "Back to home"} <b>↗</b>
              </Link>
              <Link className="text-link" href="/contact" data-magnetic="6">
                Say hello <b>↗</b>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
