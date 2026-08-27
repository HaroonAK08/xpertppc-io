"use client";

import Link from "next/link";
import { useSiteEffects } from "./useSiteEffects";
import BrandLogo from "./BrandLogo";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LegalPage({ title, lede, prose }) {
  useSiteEffects();
  return (
    <div className="v2-root">
      <div className="v2-aurora" aria-hidden="true" />
      <header>
        <nav className="v2-nav" aria-label="Primary">
          <Link aria-label="XpertPPC home" className="logo-hover inline-flex items-center shrink-0" href="/">
            <BrandLogo />
          </Link>
          <div className="hidden md:flex flex-1 items-center justify-center gap-7">
            <Link href="/#case-studies" className="v2-nav-link">Case Studies</Link>
            <Link href="/#why-us" className="v2-nav-link">Why Us</Link>
            <Link href="/#process" className="v2-nav-link">Our Process</Link>
            <Link href="/#testimonials" className="v2-nav-link hidden lg:inline-block">Testimonials</Link>
            <Link href="/#faqs" className="v2-nav-link hidden lg:inline-block">FAQs</Link>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block">
              <Link href="/#book" className="v2-btn-primary v2-btn-primary--sm">
                Let’s Talk
                <Arrow />
              </Link>
            </span>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded="false"
              aria-controls="v2-mobile-menu"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/45"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <main className="legal-page">
        <div className="container-page max-w-3xl mx-auto">
          <p className="v2-eyebrow">{title}</p>
          <h1 className="v2-h2 mt-3">{title}</h1>
          <p className="v2-lede mt-4">{lede}</p>
          <div className="legal-prose mt-10" dangerouslySetInnerHTML={{ __html: prose }} />
        </div>
      </main>
      <footer className="v2-veil relative" style={{ borderTop: "1px solid rgba(255,255,255,0.7)" }}>
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-y-10 md:grid-cols-4 md:gap-x-12">
            <Link aria-label="XpertPPC home" href="/">
              <BrandLogo size="footer" />
            </Link>
            <div>
              <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--v2-ink-faint)]">Company</h3>
              <ul className="space-y-3.5">
                <li><Link href="/#why-us" className="v2-nav-link">About</Link></li>
                <li><Link href="/#process" className="v2-nav-link">How It Works</Link></li>
                <li><Link href="/#portfolio" className="v2-nav-link">Portfolio</Link></li>
                <li><Link href="/#testimonials" className="v2-nav-link">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--v2-ink-faint)]">Legal</h3>
              <ul className="space-y-3.5">
                <li><Link className="v2-nav-link" href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link className="v2-nav-link" href="/terms-and-conditions">Terms & Conditions</Link></li>
                <li><Link className="v2-nav-link" href="/cookie-policy">Cookie Policy</Link></li>
                <li><Link className="v2-nav-link" href="/results-disclaimer">Results Disclaimer</Link></li>
                <li><Link className="v2-nav-link" href="/refund-and-cancellation-policy">Refund And Cancellation Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-6 text-center" style={{ borderColor: "var(--v2-glass-edge)" }}>
            <span className="v2-colophon">© 2026 XpertPPC — All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
