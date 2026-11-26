"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./site-chrome";

export default function FooterNext({ links }: { links: NavLink[] }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const current = Math.max(0, links.findIndex((link) => link.href === pathname));
  const next = links[(current + 1) % links.length];
  return <Link className="footer-next" href={next.href}>Next: {next.label} <b>→</b></Link>;
}
