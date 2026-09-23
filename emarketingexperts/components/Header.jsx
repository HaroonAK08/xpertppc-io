"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { nav as defaultNav } from "@/data/site";

const SITE_FALLBACK = {
  brandName: "emarketing experts performance marketing agency",
  socialInstagram: "https://www.instagram.com/",
  socialFacebook: "https://www.facebook.com/",
  socialLinkedin: "https://www.linkedin.com/",
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

      <header className="site-header">
        <div className="header-inner">
          <Link
            href="/"
            className="brand"
            onClick={() => setOpen(false)}
            data-cms-key="site::brandName"
          >
            {site.brandName}
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
