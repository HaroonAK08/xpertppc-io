import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapAccordion from "@/components/CapAccordion";
import { getPageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const home = await getPageContent("home");
  const site = await getPageContent("site");
  const ctaLabel = site?.bookIntroCtaLabel || "Book Intro →";
  const servicesLeft = home.servicesLeft || [];
  const servicesRight = home.servicesRight || [];
  const partners = home.partners || [];

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="hero">
          <div className="hero-row">
            <div className="hero-copy">
              <p className="eyebrow" data-cms-key="home::eyebrow">{home.eyebrow}</p>
              <h1>
                <span data-cms-key="home::titleLine1">{home.titleLine1}</span>{" "}
                <br className="hero-br" />
                <span data-cms-key="home::titleLine2">{home.titleLine2}</span>
              </h1>
              <div className="hero-actions">
                <Link
                  href={home.caseStudyHref}
                  className="btn-text"
                  data-cms-key="home::caseStudyLabel"
                >
                  {home.caseStudyLabel}
                </Link>
                <Link
                  href="/book-intro"
                  className="btn btn-red"
                  data-cms-key="site::bookIntroCtaLabel"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
            <div aria-hidden />
            <div className="hero-visual">
              <div className="blob">
                <img src={home.blobImage} alt="" data-cms-key="home::blobImage" />
              </div>
              <div className="alchemy-def">
                <p className="alchemy-def-term">
                  <span data-cms-key="home::alchemyTerm">{home.alchemyTerm}</span>{" "}
                  <span data-cms-key="home::alchemyPhonetic">{home.alchemyPhonetic}</span>{" "}
                  <em>noun</em>
                </p>
                <h5 className="alchemy-def-body" data-cms-key="home::alchemyBody">
                  {home.alchemyBody}
                </h5>
              </div>
            </div>
          </div>
        </section>

        <section className="services">
          <div className="services-row">
            <div className="services-intro">
              <p className="section-kicker" data-cms-key="home::servicesKicker">
                {home.servicesKicker}
              </p>
              <span className="heading-divider" aria-hidden />
              <h2 data-cms-key="home::servicesTitle">{home.servicesTitle}</h2>
              <Link
                href="/book-intro"
                className="btn btn-red"
                data-cms-key="site::bookIntroCtaLabel"
              >
                {ctaLabel}
              </Link>
            </div>
            <div aria-hidden />
            <div className="service-col">
              {servicesLeft.map((item, i) => (
                <article key={item.label} className="service-cell">
                  <p className="label" data-cms-key={`home::servicesLeft.${i}.label`}>{item.label}</p>
                  <span className="heading-divider" aria-hidden />
                  <h3 data-cms-key={`home::servicesLeft.${i}.title`}>{item.title}</h3>
                  <p data-cms-key={`home::servicesLeft.${i}.body`}>{item.body}</p>
                </article>
              ))}
            </div>
            <div className="service-col">
              {servicesRight.map((item, i) => (
                <article key={item.label} className="service-cell">
                  <p className="label" data-cms-key={`home::servicesRight.${i}.label`}>{item.label}</p>
                  <span className="heading-divider" aria-hidden />
                  <h3 data-cms-key={`home::servicesRight.${i}.title`}>{item.title}</h3>
                  <p data-cms-key={`home::servicesRight.${i}.body`}>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="band-photo-wrap">
          <img src={home.bandImage} alt="" data-cms-key="home::bandImage" />
        </div>

        <section className="capabilities">
          <div className="cap-top">
            <div>
              <p className="section-kicker" data-cms-key="home::capabilitiesKicker">
                {home.capabilitiesKicker}
              </p>
              <span className="heading-divider" aria-hidden />
              <h2 data-cms-key="home::capabilitiesTitle">{home.capabilitiesTitle}</h2>
            </div>
            <div aria-hidden />
          </div>

          <div className="cap-split">
            <div className="cap-photo-col">
              <div
                className="cap-photo"
                role="img"
                aria-label=""
                data-cms-key="home::capPhotoImage"
                style={home.capPhotoImage ? { backgroundImage: `url(${home.capPhotoImage})` } : undefined}
              />
            </div>
            <aside className="cap-panel">
              <h3 data-cms-key="home::capPanelTitle">{home.capPanelTitle}</h3>
              <CapAccordion items={home.accordionItems} />
            </aside>
          </div>

          <div className="partners">
            {partners.map((src, i) => (
              <img key={src} src={src} alt="" data-cms-key={`home::partners.${i}`} />
            ))}
          </div>
        </section>

        <section className="collab">
          <div className="collab-inner">
            <div>
              <p className="label">Collaboration</p>
              <h2>
                <span data-cms-key="home::collabTitleLine1">{home.collabTitleLine1}</span>
                <br />
                <span data-cms-key="home::collabTitleLine2">{home.collabTitleLine2}</span>
              </h2>
            </div>
            <Link
              href="/book-intro"
              className="btn btn-red"
              data-cms-key="site::bookIntroCtaLabel"
            >
              {ctaLabel}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
