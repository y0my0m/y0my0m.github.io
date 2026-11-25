import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteContent } from "../_content/site";
import MobileMenu from "./mobile-menu";
import Aurora from "./aurora";

export type NavLink = { href: string; label: string };

export function navLinks(site: SiteContent["site"]): NavLink[] {
  return [
    { href: "/", label: site.navHome },
    { href: "/writing", label: site.navWriting },
    { href: "/pictures", label: site.navPictures },
    { href: "/progress", label: site.navProgress },
    { href: "/extras", label: site.navExtras ?? "Extras" },
    { href: "/about", label: site.navAbout },
    { href: "/contact", label: site.navContact },
  ];
}

export function SiteHeader({ site }: { site: SiteContent["site"] }) {
  return (
    <nav className="nav wrap" aria-label="Main navigation">
      <Link className="wordmark" href="/" aria-label={`${site.name} home`} data-magnetic="4">
        {site.name}
      </Link>
      <div className="nav-links">
        {navLinks(site).map((link) => (
          <Link key={link.href} href={link.href} data-magnetic="3">
            {link.label}
          </Link>
        ))}
      </div>
      <Link className="signal nav-signal" href="/writing" data-magnetic="4">
        <span className="signal-dot-wrap" aria-hidden="true">
          <span className="signal-ping" />
          <i />
        </span>
        <span data-scramble>{site.signal}</span>
      </Link>
      <MobileMenu items={navLinks(site)} name={site.name} />
    </nav>
  );
}

export function SiteFooter({ site }: { site: SiteContent["site"] }) {
  return <footer className="footer wrap"><Link className="wordmark" href="/">{site.name}</Link><nav className="footer-links" aria-label="Footer navigation"><Link href="/writing">Writing</Link><Link href="/pictures">Pictures</Link><Link href="/progress">Progress</Link><Link href="/extras">Extras</Link><Link href="/contact">Contact</Link></nav><p>{site.footerTagline}</p><p>{site.footerCopyright}</p></footer>;
}

export function PageShell({ children, site }: { children: ReactNode; site: SiteContent["site"] }) {
  return <main className="site-shell"><Aurora /><SiteHeader site={site} />{children}<SiteFooter site={site} /></main>;
}
