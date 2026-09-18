import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BRAND } from "@comeaux/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: BRAND.name, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    "medical supplies",
    "nursing supplies",
    "long-term care",
    "LTC facilities",
    "CNA training",
    "medication aide",
    "healthcare LMS",
    "facility compliance",
    "business filing assistance"
  ],
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: BRAND.assets.monogram
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: BRAND.palette.purpleDeep,
  colorScheme: "light"
};

const nav = [
  ["Store", "/store"],
  ["Academy", "/academy"],
  ["Business Services", "/business-services/colorado/llc"],
  ["Integrations", "/integrations"],
  ["Handbook", "/handbook/engineering"],
  ["LMS", "/lms"],
  ["Dashboard", "/dashboard"]
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skipLink" href="#main-content">Skip to content</a>
        <header className="siteHeader">
          <Link href="/" prefetch={false} className="brandLink" aria-label={`${BRAND.name} home`}>
            <span className="brandMarkShell" aria-hidden="true">
              <img className="brandMark" src={BRAND.assets.monogram} width="56" height="56" alt="" />
            </span>
            <span className="brandText">
              <strong>Comeaux Lady&apos;s</strong>
              <small>Medical Supply Co.</small>
              <em>{BRAND.compactTagline}</em>
            </span>
          </Link>
          <nav aria-label="Primary navigation">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} prefetch={false}>{label}</Link>
            ))}
          </nav>
        </header>
        <main id="main-content">{children}</main>
        <footer className="siteFooter">
          <div className="footerBrand">
            <img src={BRAND.assets.monogram} width="64" height="64" alt="" aria-hidden="true" />
            <div><strong>{BRAND.name}</strong><span>{BRAND.tagline}</span></div>
          </div>
          <small>Medical supply commerce • healthcare education • long-term care facility support • governed administrative business services</small>
          <small>Educational, regulatory, tax, payment, credential, and business-filing workflows require applicable approvals, customer attestations, licensed-professional review when appropriate, and official external acceptance before they are represented as complete.</small>
          <small>© {new Date().getFullYear()} {BRAND.name}</small>
        </footer>
      </body>
    </html>
  );
}
