import type { Metadata } from "next";
import { PageShell } from "../_components/site-chrome";
import { getSiteContent } from "../_content/site";
import CopyEmail from "../_components/copy-email";

export const metadata: Metadata = { title: "Contact | YOM.", description: "Get in touch with Yom." };

export default async function ContactPage() {
  const { contact, site } = await getSiteContent();
  return (
    <PageShell site={site}>
      <section className="page-intro wrap contact-page">
        <p className="eyebrow" data-reveal>
          <span /> {contact.eyebrow}
        </p>
        <h1 data-reveal data-reveal-delay="90">
          {contact.headlineStart}{" "}
          <em className="shiny-text">{contact.headlineEmphasis}</em>{" "}
          {contact.headlineEnd}
        </h1>
        <p data-reveal data-reveal-delay="180">
          {contact.intro}
        </p>
        <div data-reveal data-reveal-delay="240">
          <CopyEmail email={contact.email} />
        </div>
      </section>
    </PageShell>
  );
}
