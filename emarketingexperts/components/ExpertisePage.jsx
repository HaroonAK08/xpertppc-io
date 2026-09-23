"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import YoutubeBackground from "@/components/YoutubeBackground";

function TitleWithMark({ title, mark }) {
  if (!mark || !title.includes(mark)) return title;
  const i = title.indexOf(mark);
  return (
    <>
      {title.slice(0, i)}
      <span className="exp-mark">{mark}</span>
      {title.slice(i + mark.length)}
    </>
  );
}

function ApproachPhone({ src, fallback = "/images/1.png" }) {
  const [current, setCurrent] = useState(src);
  useEffect(() => {
    setCurrent(src);
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth > 0) setCurrent(src);
    };
    img.onerror = () => {
      if (!cancelled) setCurrent(fallback);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, fallback]);
  return (
    <img
      src={current}
      alt=""
      onError={(e) => {
        if (e.currentTarget.src.includes(fallback)) return;
        e.currentTarget.src = fallback;
      }}
    />
  );
}

function boldLead(line, lead) {
  if (!lead || !line.startsWith(lead)) return line;
  return (
    <>
      <strong>{lead}</strong>
      {line.slice(lead.length)}
    </>
  );
}

function boldTail(line, tail) {
  if (!tail || !line.includes(tail)) return line;
  const i = line.indexOf(tail);
  return (
    <>
      {line.slice(0, i)}
      <strong>{tail}</strong>
      {line.slice(i + tail.length)}
    </>
  );
}

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll(".exp-anim")];
    const reveal = (el) => el.classList.add("in");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 40) reveal(n);
      else io.observe(n);
    });
    return () => io.disconnect();
  }, []);
  return ref;
}

function CapCard({ point, cmsKey }) {
  return (
    <article className="exp-cap-col exp-card exp-anim">
      <p className="exp-sub">{point.num}.</p>
      <h3
        style={{ whiteSpace: "pre-line" }}
        data-cms-key={cmsKey ? `${cmsKey}.title` : undefined}
      >
        {point.title}
      </h3>
      {point.body.map((line, i) => (
        <p
          key={line}
          data-cms-key={cmsKey ? `${cmsKey}.body.${i}` : undefined}
        >
          {i === point.body.length - 1 && point.boldLast
            ? boldTail(line, point.boldLast)
            : line}
        </p>
      ))}
    </article>
  );
}

export default function ExpertisePage({ data, site, slug }) {
  const [open, setOpen] = useState(0);
  const pageRef = useFadeIn();
  if (!data) return null;

  const ctaLabel = site?.bookIntroCtaLabel || "Book Intro →";
  const k = (path) => `${slug}::${path}`;

  // Prefer page-specific phone; fall back only when asset file is absent locally.
  const phone = data.phoneImage || "/images/1.png";
  const callLog = data.callLog || "/images/call-log-screenshot.png";
  const bandVideoId = data.bandVideoId || "2bB-n8siBPE";
  const finalePhoto = data.finaleImage || "/images/oh__img92.jpg";
  const helpPartners = data.helpPartners || [
    "/images/microsoft-advertiser-partner.png",
    "/images/meta-partner.png.webp",
    "/images/Partner-AC-logo.png",
  ];
  const googleBadge = data.googleBadge || "/images/google-ads-certified.jpg";
  const waveBg = data.waveImage || "/images/background.png?v=2";
  const ctaTitle = data.ctaTitle || (
    <>
      Ready to
      <br />
      work with us?
    </>
  );

  const showWave = data.showWave !== false;
  const showApproach = data.showApproach !== false;
  const showStats = data.showStats !== false;
  const showHelp = data.showHelp !== false;
  const showBand = data.showBand !== false;
  const showMid = showApproach || showStats || showHelp;

  const [p1, p2, p3, p4] = data.points || [];
  const extra = data.extraCapSection;
  const tags = data.tags || [];

  return (
    <div className="page-shell" ref={pageRef}>
      <Header />
      <main className="exp-page">
        {/* Hero — Elementor 6b76ed3 */}
        <section className="exp-hero" data-section="hero">
          <div className="wrap">
            <div className="exp-hero-inner exp-anim">
              <p className="exp-sub" data-cms-key={k("eyebrow")}>{data.eyebrow}</p>
              <h1 className="exp-title" data-cms-key={k("title")}>
                <TitleWithMark title={data.title} mark={data.highlight} />
              </h1>
              <div className="exp-hero-spacer" aria-hidden />
              <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* Capabilities — Elementor 7353728e: 2 flex rows, left borders only */}
        <section className="exp-cap" data-section="capabilities">
          <div className="wrap">
            <div className="exp-cap-row">
              <div className="exp-cap-col exp-cap-intro exp-anim">
                <p className="exp-sub" data-cms-key={k("capLabel")}>{data.capLabel}</p>
                <h2 className="exp-title-md" data-cms-key={k("capTitle")}>{data.capTitle}</h2>
              </div>
              {p1 ? <CapCard point={p1} cmsKey={k("points.0")} /> : null}
              {p2 ? <CapCard point={p2} cmsKey={k("points.1")} /> : null}
            </div>

            <div className="exp-cap-row">
              <div className="exp-cap-col exp-cap-tags exp-anim">
                {tags.length ? (
                  <h2 className="exp-stack">
                    {tags.map((tag, i) => (
                      <span key={tag} data-cms-key={k(`tags.${i}`)}>
                        {tag}
                        <br />
                      </span>
                    ))}
                  </h2>
                ) : null}
              </div>
              {p3 ? <CapCard point={p3} cmsKey={k("points.2")} /> : null}
              {p4 ? <CapCard point={p4} cmsKey={k("points.3")} /> : null}
            </div>
          </div>
        </section>

        {/* Extra capability grid (SEM Streamline block, etc.) */}
        {extra ? (
          <section className="exp-cap exp-cap-extra" data-section="capabilities-extra">
            <div className="wrap">
              <div className="exp-cap-extra-head exp-anim">
                <p className="exp-sub" data-cms-key={k("extraCapSection.label")}>
                  {extra.label || data.capLabel}
                </p>
                <h2 className="exp-title-md" data-cms-key={k("extraCapSection.title")}>
                  {extra.title}
                </h2>
              </div>
              <div
                className={`exp-cap-extra-grid exp-cap-extra-grid-${Math.min(extra.points.length, 5)}`}
              >
                {extra.points.map((point, i) => (
                  <CapCard
                    key={`${point.num}-${point.title}`}
                    point={point}
                    cmsKey={k(`extraCapSection.points.${i}`)}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Wave spacer — Elementor e5677ff */}
        {showWave ? (
          <div
            className="exp-wave"
            data-section="wave"
            aria-hidden
            style={{ backgroundImage: `url(${waveBg})` }}
          />
        ) : null}

        {/* Approach + Statistics + How we help — Elementor 4f408fda */}
        {showMid ? (
        <section className="exp-mid" data-section="approach-stats-help">
          {showApproach ? (
          <div className="wrap exp-approach-row" data-section="approach">
            <div className="exp-approach-copy exp-anim">
              <p className="exp-sub" data-cms-key={k("approach.label")}>{data.approach.label}</p>
              <h2 className="exp-title-md" data-cms-key={k("approach.title")}>{data.approach.title}</h2>
              {data.approach.body.map((line, i) => (
                <p key={line} className="exp-body" data-cms-key={k(`approach.body.${i}`)}>
                  {i === 0
                    ? boldLead(
                        line,
                        line.startsWith("It's")
                          ? "It's actually pretty simple."
                          : "It’s actually pretty simple."
                      )
                    : line}
                </p>
              ))}
              <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                {ctaLabel}
              </Link>
            </div>
            <div className="exp-approach-media exp-anim">
              <ApproachPhone src={phone} />
            </div>
          </div>
          ) : null}

          {showStats ? (
          <div className="wrap exp-stats-row" data-section="statistics">
            <div className="exp-anim">
              <p className="exp-sub">Statistics</p>
              <h2 className="exp-title-md" data-cms-key={k("stats")}>{data.stats}</h2>
            </div>
            <div className="exp-call-log exp-anim">
              <img src={callLog} alt="Call log chart" />
            </div>
          </div>
          ) : null}

          {showApproach && showStats && showHelp ? (
            <div className="exp-divider" aria-hidden />
          ) : null}

          {showHelp ? (
          <div className="wrap exp-help-row" data-section="how-we-help">
            <div className="exp-help-left exp-anim">
              <p className="exp-sub" data-cms-key={k("howWeHelp.label")}>{data.howWeHelp.label}</p>
              <h2 className="exp-stack">
                {data.howWeHelp.services.map((s, i) => (
                  <span key={s} data-cms-key={k(`howWeHelp.services.${i}`)}>
                    {s}
                    <br />
                  </span>
                ))}
              </h2>
              <div className="exp-help-google">
                <img src={googleBadge} alt="Google Partner" />
              </div>
            </div>

            <div className="exp-help-mid exp-anim">
              {helpPartners.map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>

            <div className="exp-help-copy exp-anim">
              {data.howWeHelp.body.map((line, i) => (
                <p key={line} className="exp-body" data-cms-key={k(`howWeHelp.body.${i}`)}>
                  {boldTail(
                    line,
                    data.howWeHelp.boldTail ||
                      "At eMarketing Experts, we deliver leads."
                  )}
                </p>
              ))}
              <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                {ctaLabel}
              </Link>
            </div>
          </div>
          ) : null}
        </section>
        ) : null}

        {showBand ? <YoutubeBackground videoId={bandVideoId} /> : null}

        {/* Finale — Elementor 7d6e3b69 */}
        <section className="exp-finale" data-section="finale">
          <div className="wrap exp-finale-top exp-anim">
            <p className="exp-sub">The bottom line.</p>
            <h2 className="exp-title-md" data-cms-key={k("bottom")}>{data.bottom}</h2>
          </div>

          <div className="exp-finale-split">
            <div
              className="exp-finale-photo exp-anim"
              style={{ backgroundImage: `url(${finalePhoto})` }}
              role="img"
              aria-label=""
            />
            <aside className="exp-finale-panel exp-anim">
              <h3>Run your best business.</h3>
              <div className="exp-acc">
                {data.runBusiness.map((item, idx) => {
                  const active = open === idx;
                  return (
                    <div
                      key={item.title}
                      className={`exp-acc-item${active ? " open" : ""}`}
                    >
                      <button
                        type="button"
                        className="exp-acc-btn"
                        aria-expanded={active}
                        onClick={() => setOpen(active ? -1 : idx)}
                      >
                        <span data-cms-key={k(`runBusiness.${idx}.title`)}>{item.title}</span>
                        <span className="exp-acc-icon" aria-hidden>
                          {active ? "—" : "+"}
                        </span>
                      </button>
                      {active ? (
                        <p className="exp-acc-body" data-cms-key={k(`runBusiness.${idx}.body`)}>
                          {item.boldMark
                            ? (() => {
                                const m = item.boldMark;
                                const i = item.body.indexOf(m);
                                if (i < 0) return item.body;
                                return (
                                  <>
                                    {item.body.slice(0, i)}
                                    <strong>{m}</strong>
                                    {item.body.slice(i + m.length)}
                                  </>
                                );
                              })()
                            : item.body}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>

        <section className="collab exp-collab" data-section="cta">
          <div className="collab-inner exp-anim">
            <div>
              <p className="label">Be brave, say hi.</p>
              <h2 data-cms-key={k("ctaTitle")}>{ctaTitle}</h2>
            </div>
            <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
              {ctaLabel}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
