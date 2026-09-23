"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FALLBACK = {
  brandName: "emarketing experts performance marketing agency",
  email: "hello@emarketingexperts.com",
  footerInstaUrl: "https://www.instagram.com/",
  footerCity: "Newport Beach",
  footerAddress:
    "eMarketing Experts\nNewport Beach,\nCalifornia\nUnited States",
  footerBookBlurb: "Interested in working with us?",
  footerCopyrightName: "eMarketing Experts",
  footerCopyrightSuffix: "Made with passion.",
  footerPrivacyLabel: "Privacy & Cookie Policy",
  footerTermsLabel: "Terms of Service",
};

export default function Footer() {
  const [site, setSite] = useState(FALLBACK);

  useEffect(() => {
    fetch("/api/content?section=site")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setSite({ ...FALLBACK, ...json.data });
      })
      .catch(() => {});
  }, []);

  const lines = String(site.footerAddress || "")
    .split("\n")
    .filter(Boolean);

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-col">
          <p className="footer-insta">
            <a
              href={site.footerInstaUrl}
              target="_blank"
              rel="noreferrer"
              data-cms-key="site::footerInstaUrl"
            >
              <strong>Insta</strong>
            </a>
          </p>
          <h3 className="footer-brand" data-cms-key="site::brandName">
            {site.brandName}
          </h3>
        </div>
        <div className="footer-col">
          <h3 className="footer-title" data-cms-key="site::footerCity">
            {site.footerCity}
          </h3>
          <p data-cms-key="site::footerAddress">
            {lines.map((line, i) => (
              <span key={`${line}-${i}`}>
                {i === 0 ? <strong>{line}</strong> : line}
                {i < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
        <div className="footer-col">
          <h3 className="footer-title">Book Intro</h3>
          <p>
            <span data-cms-key="site::footerBookBlurb">{site.footerBookBlurb}</span>
            <br />
            <strong>
              <a
                className="footer-email"
                href={`mailto:${site.email}`}
                data-cms-key="site::email"
              >
                {site.email}
              </a>
            </strong>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrap footer-bottom-inner">
          <span>
            © {new Date().getFullYear()},{" "}
            <span data-cms-key="site::footerCopyrightName">{site.footerCopyrightName}</span>.{" "}
            <span data-cms-key="site::footerCopyrightSuffix">{site.footerCopyrightSuffix}</span>
          </span>
          <span>
            <Link href="/privacy" data-cms-key="site::footerPrivacyLabel">
              {site.footerPrivacyLabel}
            </Link>
            {" | "}
            <Link href="/terms" data-cms-key="site::footerTermsLabel">
              {site.footerTermsLabel}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
