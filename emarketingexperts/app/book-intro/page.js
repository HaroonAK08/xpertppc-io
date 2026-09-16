"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const TESTIMONIALS = [
  {
    id: "i-JZ8CATjfc",
    poster: "/images/state-fair-entertainment.jpg",
    label: "State Fair Entertainment",
  },
  {
    id: "7j7ZqKJznik",
    poster: "/images/kempt-image.jpeg",
    label: "KEMPT Testimonial",
  },
  {
    id: "puGJjihZdz0",
    poster: "/images/hs-run-meeting.jpg",
    label: "Disruptive Drinkware Testimonial",
  },
];

export default function BookIntroPage() {
  const [sent, setSent] = useState(false);
  const [playing, setPlaying] = useState(null);

  return (
    <div className="page-shell">
      <Header />
      <main className="book-page">
        <section className="book-intro-hero" data-section="hero">
          <div className="wrap book-intro-hero-grid">
            <div className="book-intro-copy">
              <p className="exp-sub">Be brave, say hello.</p>
              <h1 className="exp-title book-intro-title">
                Book A Meeting
                <br />
                <span className="book-phone-line">949.322.0387</span>
              </h1>
              <p className="exp-body book-lead">
                The first step to exceeding your marketing goals is booking this
                meeting. We&apos;ll talk about your existing pain points and assess
                how our strategy can help you generate revenue. (Also, things like
                scope, pricing, you know the drill.)
              </p>
              <Link href="#book-form" className="btn btn-red">
                Book Intro →
              </Link>
            </div>
          </div>
        </section>

        <section className="book-photo-band" data-section="photo">
          <div className="wrap book-photo-frame">
            <img
              className="book-photo"
              src="/images/oh__img120.jpg"
              alt=""
              onError={(e) => {
                e.currentTarget.src =
                  "https://alchemypaidmedia.com/wp-content/uploads/2019/11/oh__img120.jpg";
              }}
            />
            <div className="book-stats">
              <article className="book-stat book-stat-red">
                <span className="book-stat-icon" aria-hidden>
                  ◆
                </span>
                <p className="book-stat-num">100+</p>
                <p className="book-stat-label">happy clients</p>
              </article>
              <article className="book-stat book-stat-dark">
                <span className="book-stat-icon" aria-hidden>
                  ✦
                </span>
                <p className="book-stat-num">125+</p>
                <p className="book-stat-label">million in generated revenue</p>
              </article>
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
            <h2 className="book-form-heading">Tell us about your business.</h2>
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
                <button type="submit" className="btn btn-red">
                  Book Intro →
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
              {TESTIMONIALS.map((v) => (
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
