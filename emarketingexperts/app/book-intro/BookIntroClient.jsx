"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function BookIntroClient({ data, site }) {
  const [sent, setSent] = useState(false);
  const [playing, setPlaying] = useState(null);
  const testimonials = data.testimonials || [];
  const stats = data.stats || [];
  const ctaLabel = site?.bookIntroCtaLabel || "Book Intro →";
  const k = (path) => `book-intro::${path}`;

  return (
    <div className="page-shell">
      <Header />
      <main className="book-page">
        <section className="book-intro-hero" data-section="hero">
          <div className="wrap book-intro-hero-grid">
            <div className="book-intro-copy">
              <p className="exp-sub" data-cms-key={k("eyebrow")}>{data.eyebrow}</p>
              <h1 className="exp-title book-intro-title">
                <span data-cms-key={k("title")}>{data.title}</span>
                <br />
                <span className="book-phone-line" data-cms-key={k("phone")}>{data.phone}</span>
              </h1>
              <p className="exp-body book-lead" data-cms-key={k("lead")}>{data.lead}</p>
              <Link href="#book-form" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="book-photo-band" data-section="photo">
          <div className="wrap book-photo-frame">
            <img className="book-photo" src={data.heroImage} alt="" data-cms-key={k("heroImage")} />
            <div className="book-stats">
              {stats.map((stat, i) => (
                <article
                  key={stat.label}
                  className={`book-stat ${
                    stat.tone === "dark" ? "book-stat-dark" : "book-stat-red"
                  }`}
                >
                  <span className="book-stat-icon" aria-hidden>
                    {stat.tone === "dark" ? "✦" : "◆"}
                  </span>
                  <p className="book-stat-num" data-cms-key={k(`stats.${i}.num`)}>{stat.num}</p>
                  <p className="book-stat-label" data-cms-key={k(`stats.${i}.label`)}>{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="wrap book-form-wrap"
          data-section="form"
          id="book-form"
        >
          <div className="book-form-panel">
            <p className="exp-sub">Book A Meeting</p>
            <h2 className="book-form-heading" data-cms-key={k("formHeading")}>{data.formHeading}</h2>
            {sent ? (
              <div className="book-thanks">
                <h3>Thanks — we&apos;ll be in touch shortly.</h3>
              </div>
            ) : (
              <form
                className="book-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <label className="book-field">
                  <span>Name</span>
                  <input name="name" type="text" placeholder="Your name" required />
                </label>
                <label className="book-field">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </label>
                <div className="book-field-row">
                  <label className="book-field">
                    <span>Phone</span>
                    <input name="phone" type="tel" placeholder="(949) 000-0000" />
                  </label>
                  <label className="book-field">
                    <span>Company</span>
                    <input name="company" type="text" placeholder="Company name" />
                  </label>
                </div>
                <label className="book-field">
                  <span>How can we help?</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Goals, timeline, current marketing setup…"
                  />
                </label>
                <button type="submit" className="btn btn-red" data-cms-key="site::bookIntroCtaLabel">
                  {ctaLabel}
                </button>
              </form>
            )}
            <p className="book-form-note">
              Or email{" "}
              <a href="mailto:hello@emarketingexperts.com">
                hello@emarketingexperts.com
              </a>
            </p>
          </div>

          <aside className="book-aside">
            <p className="exp-sub">Testimonials</p>
            <h2 className="exp-title-md">
              What our clients
              <br />
              say about us.
            </h2>
            <div className="book-video-stack">
              {testimonials.map((v) => (
                <div key={v.id} className="book-video-card">
                  {playing === v.id ? (
                    <div className="book-video-frame">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="book-testimonial-media"
                      style={{ backgroundImage: `url(${v.poster})` }}
                      onClick={() => setPlaying(v.id)}
                      aria-label={`Play ${v.label}`}
                    >
                      <span className="book-play" aria-hidden>
                        ▶
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
