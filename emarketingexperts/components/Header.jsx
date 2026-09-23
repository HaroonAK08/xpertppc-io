"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { nav as defaultNav } from "@/data/site";

const SITE_FALLBACK = {
  brandName: "emarketing experts performance marketing agency",
  logoImage: "/images/emarketing-experts-logo.png",
  socialInstagram: "https://www.instagram.com/",
  socialFacebook: "https://www.facebook.com/",
  socialLinkedin: "https://www.linkedin.com/",
  whatsappNumber: "923009682964",
  whatsappMessage:
    "Hi, I'd like to learn more about eMarketing Experts' digital marketing services.",
  whatsappLabel: "Let's talk strategy",
};

function buildPrimaryNav(nav) {
  return [
    { href: "/", label: nav.homeLabel, num: "01", cmsKey: "nav::homeLabel" },
    {
      href: "#",
      label: nav.expertiseLabel,
      num: "02",
      cmsKey: "nav::expertiseLabel",
      children: nav.expertise,
      childKeyPrefix: "expertise",
    },
    {
      href: "#",
      label: nav.capabilitiesLabel,
      num: "03",
      cmsKey: "nav::capabilitiesLabel",
      children: nav.capabilities,
      childKeyPrefix: "capabilities",
    },
    {
      href: "/marketing-agency-in-orange-county",
      label: nav.startFreeLabel,
      num: "04",
      cmsKey: "nav::startFreeLabel",
    },
    {
      href: "#",
      label: nav.casesLabel,
      num: "05",
      cmsKey: "nav::casesLabel",
      children: nav.cases,
      childKeyPrefix: "cases",
    },
    { href: "/book-intro", label: nav.bookIntroLabel, num: "06", cmsKey: "nav::bookIntroLabel" },
  ];
}

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(defaultNav);
  const [site, setSite] = useState(SITE_FALLBACK);

  useEffect(() => {
    fetch("/api/content?section=nav")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setNav({ ...defaultNav, ...json.data });
      })
      .catch(() => {});
    fetch("/api/content?section=site")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setSite({ ...SITE_FALLBACK, ...json.data });
      })
      .catch(() => {});
  }, []);

  const primaryNav = useMemo(() => buildPrimaryNav(nav), [nav]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const whatsappHref = site.whatsappNumber
    ? `https://api.whatsapp.com/send/?phone=${site.whatsappNumber}&text=${encodeURIComponent(site.whatsappMessage || "")}`
    : null;

  const isActive = (item) => {
    if (item.href === "/") return pathname === "/";
    if (item.children) {
      return item.children.some(
        (c) => pathname === c.href || pathname.startsWith(c.href + "/")
      );
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <>
      <aside className="theme-rail" aria-label="Theme">
        <div
          className={`color-switcher${theme === "dark" ? " dark" : ""}`}
          role="group"
          aria-label="Theme"
        >
          <button
            type="button"
            className="color-switcher-item dark"
            aria-label="Dark"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            <span className="caption">Dark</span>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M14.5 10.2A6.2 6.2 0 0 1 7.8 3.5 6.5 6.5 0 1 0 14.5 10.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="color-switcher-item light"
            aria-label="Light"
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            <span className="caption">Light</span>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
              <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M9 1.5V3M9 15v1.5M1.5 9H3M15 9h1.5M3.7 3.7l1.1 1.1M13.2 13.2l1.1 1.1M13.2 4.8l1.1-1.1M3.7 14.3l1.1-1.1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      <div className="right-rail">
        <span>Follow Us</span>
        <span>—</span>
        <a href={site.socialInstagram} target="_blank" rel="noreferrer" data-cms-key="site::socialInstagram">
          Ig.
        </a>
        <span>/</span>
        <a href={site.socialFacebook} target="_blank" rel="noreferrer" data-cms-key="site::socialFacebook">
          Fb.
        </a>
        <span>/</span>
        <a href={site.socialLinkedin} target="_blank" rel="noreferrer" data-cms-key="site::socialLinkedin">
          Lk.
        </a>
      </div>

      {whatsappHref ? (
        <a
          className="whatsapp-float"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          data-cms-key="site::whatsappNumber"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.96 9.96 0 0 0 12.02 22C17.52 22 22 17.52 22 12S17.52 2 12.02 2Zm0 18.1c-1.6 0-3.1-.43-4.4-1.2l-.32-.18-3.02.79.8-2.94-.2-.3a8.1 8.1 0 0 1-1.24-4.27c0-4.49 3.65-8.14 8.14-8.14 2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.75c0 4.49-3.65 8.1-8.09 8.1Zm4.47-6.06c-.24-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.24-.64.8-.78.97-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.28Z" />
          </svg>
          <span>{site.whatsappLabel}</span>
        </a>
      ) : null}

      <header className="site-header">
        <div className="header-inner">
          <Link
            href="/"
            className="brand"
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.logoImage}
              alt={site.brandName}
              className="brand-logo"
              data-cms-key="site::logoImage"
            />
          </Link>

          <nav className="nav">
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label} className="nav-item nav-drop">
                  <span className="num">{item.num}</span>
                  <button
                    type="button"
                    className={isActive(item) ? "active" : undefined}
                    aria-haspopup="true"
                    data-cms-key={item.cmsKey}
                  >
                    {item.label}
                  </button>
                  <div className="drop">
                    <div className="drop-inner">
                      {item.children.map((child, i) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          data-cms-key={`nav::${item.childKeyPrefix}.${i}.label`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive(item) ? "active" : ""}`}
                  data-cms-key={item.cmsKey}
                >
                  <span className="num">{item.num}</span>
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </nav>

          <button
            type="button"
            className="mobile-toggle"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>

        <div className={`wrap mobile-nav ${open ? "open" : ""}`}>
          {primaryNav.map((item) =>
            item.children ? (
              item.children.map((child, i) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  data-cms-key={`nav::${item.childKeyPrefix}.${i}.label`}
                >
                  {child.label}
                </Link>
              ))
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                data-cms-key={item.cmsKey}
              >
                {item.num} {item.label}
              </Link>
            )
          )}
        </div>
      </header>
    </>
  );
}
