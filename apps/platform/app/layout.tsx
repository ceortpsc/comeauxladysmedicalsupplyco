import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@comeaux/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: BRAND.name, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  keywords: ["medical supplies", "nursing supplies", "CNA training", "medication aide", "Texas nurses", "healthcare LMS"],
  robots: { index: true, follow: true }
};

const nav = [
  ["Store", "/store"],
  ["Academy", "/academy"],
  ["LMS", "/lms"],
  ["Dashboard", "/dashboard"]
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <Link href="/" className="brandLink">
            <img src="/brand/logo.svg" width="52" height="52" alt="Comeaux Lady's Medical Supply Co. logo" />
            <span><strong>{BRAND.name}</strong><small>{BRAND.tagline}</small></span>
          </Link>
          <nav>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        </header>
        <main>{children}</main>
        <footer><strong>{BRAND.name}</strong><span>Medical supply commerce • healthcare education • clinic onboarding</span><small>© {new Date().getFullYear()} Comeaux Lady's Medical Supply Co. Educational and regulatory workflows require applicable approvals before conferment or state submission.</small></footer>
      </body>
    </html>
  );
}
