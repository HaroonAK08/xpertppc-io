"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Collab({
  label = "Collaboration",
  title,
  body = "We’re a team of digital alchemists who are excited about turning paid media into revenue.",
  bodyKey,
  ctaLabel = "Book Intro →",
}) {
  return (
    <section className="collab case-collab" data-section="cta">
      <div className="wrap collab-inner">
        <div>
          <p className="label">{label}</p>
          <h2>
            {title || (
              <>
                Ready to drive revenue?
                <br />
                Book an intro.
              </>
            )}
          </h2>
          {body ? (
            <>
              <span className="collab-line" aria-hidden />
              <p data-cms-key={bodyKey}>{body}</p>
            </>
          ) : null}
        </div>
        <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

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

function PromoCtas({ primary, secondary = "Book Intro →", primaryHref }) {
  return (
    <div className="promo-cta-stack">
      <a href={primaryHref || "tel:9493220387"} className="btn btn-red">
        {primary}
      </a>
      <Link href="/book-intro" className="btn btn-red">
        {secondary}
      </Link>
    </div>
  );
}

const PROMO_VIDEOS = [
  "i-JZ8CATjfc",
  "7j7ZqKJznik",
  "RK5S9q-Qhb8",
  "jkZAExWT_kg",
  "puGJjihZdz0",
  "XD-tqw7b0kA",
  "PzX1f5IQuMs",
  "W3mfFnodAms",
  "Rc4CqIT7uWg",
  "HcQSvkepMC4",
];
const PROMO_CASE_VIDEO = "L5cUjx8acmg";

export default function InnerPage({ data, site, slug }) {
  if (!data) return null;

  const ctaLabel = site?.bookIntroCtaLabel || "Book Intro →";
  const k = (path) => `${slug}::${path}`;

  if (data.type === "promo") {
    const phone = data.phone || "949.322.0387";
    const clients = data.clients || [
      "/images/boudin-whte.png",
      "/images/Pacific-Avalon-Logo-white.png",
      "/images/panasonic-logo.png",
      "/images/berkeleyside-logo-white.png",
      "/images/Logo-Long-CHI.png",
      "/images/Sessions-PrimaryLogo_White-2.png",
      "/images/sfent-logo-bW-150x150-1.png",
      "/images/logo_big.png",
      "/images/core-1.png",
      "/images/logo-hummingbird.png",
      "/images/hs-logo1-1.png",
      "/images/state-fair-sunday-band-logo.jpeg",
    ];
    const videos = data.videos || PROMO_VIDEOS;

    return (
      <div className="page-shell">
        <Header />
        <main className="promo-page">
          <section className="promo-hero-white" data-section="hero">
            <div className="wrap promo-hero-grid">
              <div className="promo-hero-copy">
                <p className="promo-eyebrow" data-cms-key={k("eyebrow")}>{data.eyebrow}</p>
                <h1 className="promo-h1" data-cms-key={k("title")}>{data.title}</h1>
                <p className="promo-welcome" data-cms-key={k("lead")}>{data.lead}</p>
                <div className="promo-cta-stack promo-cta-stack-left">
                  <a href={`tel:${String(phone).replace(/\D/g, "")}`} className="btn btn-red">
                    Call {phone} →
                  </a>
                  <Link href="/book-intro" className="btn btn-red">
                    Start for Free in June →
                  </Link>
                </div>
                <p className="promo-fine">
                  Start for free in June with a signed 3 month contract starting
                  July 1, 2026.
                </p>
                <p className="promo-fine">
                  *FIRST TIME ADVERTISER SPECIAL* Get up to $3500 in free ads on
                  Google and Microsoft.
                </p>
              </div>
              <div className="promo-hero-media">
                <img
                  src="https://alchemypaidmedia.com/wp-content/uploads/2025/04/background-600x337.png"
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fb) return;
                    e.currentTarget.dataset.fb = "1";
                    e.currentTarget.src = "/images/background-600x337.png";
                  }}
                />
                <img
                  src="https://alchemypaidmedia.com/wp-content/uploads/2025/03/Screenshot-2025-03-30-at-5.12.08%E2%80%AFPM-600x376.png"
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fb) return;
                    e.currentTarget.dataset.fb = "1";
                    e.currentTarget.src = "/images/promo-hero-street.png";
                  }}
                />
              </div>
            </div>
          </section>

          <section className="promo-dark" data-section="proof">
            <div className="wrap promo-partner-row" data-section="partners">
              <div className="promo-partner-card">
                <img
                  src="/images/meta-partner.png.webp"
                  alt="Meta Business Partner"
                />
              </div>
              <div className="promo-partner-google">
                <img
                  src="/images/googleadwordscertified-white-300x169.png"
                  alt="Google Partner"
                />
              </div>
              <div className="promo-partner-ac">
                <img
                  src="/images/active-campaign-partner-white.png"
                  alt="ActiveCampaign Partner"
                />
              </div>
            </div>

            <div className="wrap promo-split promo-split-mid" data-section="book-intro-cta">
              <div className="promo-split-copy">
                <p className="promo-kicker">
                  emarketing experts performance marketing agency
                </p>
                <h2 className="promo-h2">
                  Ready to drive revenue?
                  <br />
                  Book an intro.
                </h2>
              </div>
              <PromoCtas primary={`Call ${phone} →`} />
            </div>

            <div className="wrap promo-band-copy" data-section="google-microsoft">
              <p className="promo-kicker promo-kicker-lead">
                Our agency has experience spending millions on google and
                microsoft ads.
              </p>
              <div className="promo-split promo-split-end">
                <h2 className="promo-h-xl">
                  Drive more leads, customers + revenue to your business.
                </h2>
                <PromoCtas primary={`Call the agency owner: ${phone} →`} />
              </div>
            </div>

            <div className="wrap promo-shot-stack" data-section="ads-shots">
              <img className="promo-shot" src="/images/Google-Ads.jpg" alt="" />
              <img className="promo-shot" src="/images/microsoft-ads.jpg" alt="" />
            </div>

            <div className="wrap promo-band-copy" data-section="social">
              <p className="promo-kicker promo-kicker-lead">
                Help your business be seen by more customers online.
              </p>
              <div className="promo-split promo-split-end">
                <h2 className="promo-h-xl">
                  Our agency has experience spending millions on social media.
                </h2>
                <PromoCtas primary={`Call Now ${phone} →`} />
              </div>
            </div>

            <div className="wrap promo-shot-stack">
              <img className="promo-shot" src="/images/meta-ads.jpg" alt="" />
            </div>

            <div className="wrap promo-band-copy" data-section="calls">
              <p className="promo-kicker promo-kicker-lead">We focus on real results.</p>
              <div className="promo-split promo-split-end">
                <h2 className="promo-h-xl">
                  Our agency has driven in thousands of qualified new customer
                  calls.
                </h2>
                <PromoCtas primary={`Call Now ${phone} →`} />
              </div>
            </div>

            <div className="wrap promo-shot-stack">
              <img
                className="promo-shot promo-shot-calllog"
                src="https://alchemypaidmedia.com/wp-content/uploads/2025/04/Screenshot-2025-04-01-at-11.26.10%E2%80%AFPM.png"
                alt="Call log — 3,622 calls"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "/images/Screenshot-2025-04-01-at-11.26.10-PM-1920x824.png";
                }}
              />
            </div>

            <div className="wrap promo-band-copy" data-section="clients-videos">
              <p className="promo-kicker promo-kicker-lead">Proof.</p>
              <div className="promo-split promo-split-end">
                <h2 className="promo-h-xl">Hear from real Clients.</h2>
                <PromoCtas primary={`Call now ${phone} →`} />
              </div>
            </div>

            <div className="wrap promo-video-stack">
              {videos.map((id) => (
                <div key={id} className="promo-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="Client testimonial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="wrap promo-band-copy" data-section="humble-brag">
              <p className="promo-kicker">Humble Brag.</p>
              <h2 className="promo-h-xl">
                Case Study: We drove in 500,000 attendees in 10 weeks to the
                fair.
              </h2>
              <div className="promo-split" style={{ marginTop: "3vh" }}>
                <div />
                <PromoCtas primary={`Call the agency owner: ${phone} →`} />
              </div>
              <div className="promo-video-stack" style={{ marginTop: "4vh" }}>
                <div className="promo-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${PROMO_CASE_VIDEO}`}
                    title="Fair case study video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
              <Link
                href="/500000-attendees-to-the-fair-in-10-weekends"
                className="btn btn-red"
                style={{ marginTop: "2rem", display: "inline-flex" }}
              >
                Read Case Study →
              </Link>
            </div>

            <div className="wrap promo-clients-block" data-section="clients">
              <p className="promo-kicker">experience on over 100 brands</p>
              <h2 className="promo-h2">Our Clients</h2>
              <div className="promo-client-grid">
                {clients.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
              </div>
            </div>
          </section>

          <section className="promo-finale-white" data-section="finale-cta">
            <div className="wrap">
              <h2 className="promo-finale-title">
                We can help generate revenue for your business. Call {phone} and
                get started for free in June.
              </h2>
              <div className="promo-calendly">
                <iframe
                  title="Book a consultation"
                  src="https://calendly.com/alchemyroi/15-minute-consultation?hide_gdpr_banner=1"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (data.type === "case") {
    const isCaseLayout = Boolean(data.heroImage || data.strategyResultTitle);
    const blocks = data.blocks || [];

    return (
      <div className="page-shell">
        <Header />
        <main className={`case-page${isCaseLayout ? " case-page-fair" : ""}`}>
          <section className="case-hero" data-section="hero">
            <div className="wrap case-hero-grid">
              <div className="case-hero-copy">
                <p className="exp-sub case-eyebrow" data-cms-key={k("eyebrow")}>{data.eyebrow}</p>
                <h1 className="exp-title case-hero-title" data-cms-key={k("title")}>
                  <TitleWithMark title={data.title} mark={data.highlight} />
                </h1>
                <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                  {ctaLabel}
                </Link>
              </div>
              {data.heroImage ? (
                <div className="case-hero-aside">
                  <img
                    src={data.heroImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    data-cms-key={k("heroImage")}
                    onError={(e) => {
                      const fb = data.heroImageFallback;
                      if (!fb || e.currentTarget.dataset.fb) return;
                      e.currentTarget.dataset.fb = "1";
                      e.currentTarget.src = fb;
                    }}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section className="case-story-row" data-section="story">
            <div className="wrap case-story-grid">
              <div className="case-story-copy">
                <h2 className="exp-title-md" data-cms-key={k("lead")}>{data.lead}</h2>
                <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                  {ctaLabel}
                </Link>
              </div>
              {blocks.length ? (
                <div className="case-grid">
                  {blocks.map((block, i) => (
                    <article key={block.label} className="case-cell">
                      <p className="case-cell-label" data-cms-key={k(`blocks.${i}.label`)}>{block.label}</p>
                      <h3 className="case-cell-title" data-cms-key={k(`blocks.${i}.title`)}>{block.title}</h3>
                      <p className="exp-body" data-cms-key={k(`blocks.${i}.body`)}>{block.body}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          {data.coverImage ? (
            <section className="case-cover" data-section="cover">
              <div className="wrap">
                <img
                  src={data.coverImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  data-cms-key={k("coverImage")}
                  onError={(e) => {
                    const fb = data.coverImageFallback;
                    if (!fb || e.currentTarget.dataset.fb) return;
                    e.currentTarget.dataset.fb = "1";
                    e.currentTarget.src = fb;
                  }}
                />
              </div>
            </section>
          ) : null}

          {data.videoId ? (
            <section className="case-video wrap" data-section="video">
              <div className="case-video-frame">
                <iframe
                  src={`https://www.youtube.com/embed/${data.videoId}`}
                  title="Case study video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          {!isCaseLayout && data.image ? (
            <section className="case-hero-media" data-section="media">
              <div className="wrap">
                <img
                  src={data.image}
                  alt=""
                  onError={(e) => {
                    if (e.currentTarget.dataset.fb) return;
                    e.currentTarget.dataset.fb = "1";
                    e.currentTarget.src =
                      data.imageFallback || "/images/google-ads.jpg";
                  }}
                />
              </div>
            </section>
          ) : null}

          {!isCaseLayout && data.reviewImage ? (
            <section className="case-review" data-section="review">
              <div className="wrap">
                <img
                  src={data.reviewImage}
                  alt=""
                  onError={(e) => {
                    if (e.currentTarget.dataset.fb) return;
                    e.currentTarget.dataset.fb = "1";
                    e.currentTarget.src =
                      data.reviewFallback || "/images/jDFdP23o-oh__img8.jpeg";
                  }}
                />
              </div>
            </section>
          ) : null}

          <section className="case-strategy" data-section="strategy">
            <div className="wrap">
              <p className="case-strategy-label">Strategy</p>
              <h2 className="exp-title-md case-strategy-title" data-cms-key={k("strategy")}>
                {data.strategy}
              </h2>
            </div>
            {(data.strategyImage || data.strategyResultTitle) && (
              <div className="wrap case-strategy-overlap">
                {data.strategyImage ? (
                  <img
                    className="case-strategy-photo"
                    src={data.strategyImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    data-cms-key={k("strategyImage")}
                    onError={(e) => {
                      const fb =
                        data.strategyImageFallback ||
                        "/images/HornblowerCompetition.png";
                      if (e.currentTarget.dataset.fb) return;
                      e.currentTarget.dataset.fb = "1";
                      e.currentTarget.src = fb;
                    }}
                  />
                ) : null}
                <div className="case-result-card">
                  <h3 className="case-result-title" data-cms-key={k("strategyResultTitle")}>
                    {data.strategyResultTitle}
                  </h3>
                  {data.strategyResultBody ? (
                    <p className="exp-body" data-cms-key={k("strategyResultBody")}>
                      {data.strategyResultBody}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
            {!data.strategyResultTitle && data.strategyBody ? (
              <div className="wrap">
                <p className="exp-body case-strategy-body" data-cms-key={k("strategyBody")}>
                  {data.strategyBody}
                </p>
              </div>
            ) : null}
          </section>

          {data.partners ? (
            <section className="case-partners" data-section="partners">
              <div className="wrap case-partner-grid">
                {data.partners.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
              </div>
            </section>
          ) : null}

          <Collab body={data.collabBody} bodyKey={k("collabBody")} ctaLabel={ctaLabel} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap inner-hero">
            <div>
              <p className="eyebrow" data-cms-key={k("eyebrow")}>{data.eyebrow}</p>
              <h1 data-cms-key={k("title")}>{data.title}</h1>
              {data.lead ? <p className="inner-lead" data-cms-key={k("lead")}>{data.lead}</p> : null}
              <div style={{ marginTop: 24 }}>
                <Link href="/book-intro" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap points">
            {data.points.map((point, i) => (
              <article key={point.num} className="point">
                <span className="point-num">{point.num}.</span>
                <div>
                  <h3 data-cms-key={k(`points.${i}.title`)}>{point.title}</h3>
                  <p data-cms-key={k(`points.${i}.body`)}>{point.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <Collab ctaLabel={ctaLabel} />
      </main>
      <Footer />
    </div>
  );
}
