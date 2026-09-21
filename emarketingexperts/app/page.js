import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapAccordion from "@/components/CapAccordion";
import { getPageContent } from "@/lib/cms";

const servicesLeft = [
  {
    label: "Paid Media",
    title: "Performance, Awareness, CRO",
    body: "Acquire more customers. Be found everywhere. Increase your conversions.",
  },
  {
    label: "Production",
    title: "Strategic Brand Films",
    body: "Our in-house agency film team shoots strategic brand films to lower CPA and increase ROAS.",
  },
];

const servicesRight = [
  {
    label: "Brand Development",
    title: "Website Development, Branding, Positioning",
    body: "Get a conversion-optimized website. Award-winning design.",
  },
  {
    label: "SEO",
    title: "Earned and Owned",
    body: "Dominate the search engines locally with backlink juice and reviews to get 5 Mile Famous.",
  },
];

const partners = [
  "/images/aaa6d172-f2a0-4f56-9310-85b636829ae8.png",
  "/images/microsoft-advertiser-partner.png",
  "/images/Partner-AC-logo.png",
  "/images/58368546-1795-4031-b53c-5fe6030114e2.png",
  "/images/CR-Agency-Partner-Logo.png",
  "/images/zapier-partner-logo-1.jpg",
  "/images/housecall-pro-logo-vector.png",
  "/images/GTM-LOGO.png",
  "/images/Toast_logo.svg_.png",
  "/images/GA4_Logo.jpg",
  "/images/ServiceTitan_logo.svg_.png",
  "/images/lead-prosper-logo.png.webp",
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const home = await getPageContent("home");

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="hero">
          <div className="hero-row">
            <div className="hero-copy">
              <p className="eyebrow">{home.eyebrow}</p>
              <h1>
                {home.titleLine1}{" "}
                <br className="hero-br" />
                {home.titleLine2}
              </h1>
              <div className="hero-actions">
                <Link href={home.caseStudyHref} className="btn-text">
                  {home.caseStudyLabel}
                </Link>
                <Link href="/book-intro" className="btn btn-red">
                  Book Intro →
                </Link>
              </div>
            </div>
            <div aria-hidden />
            <div className="hero-visual">
              <div className="blob">
                <img src={home.blobImage} alt="" />
              </div>
              <div className="alchemy-def">
                <p className="alchemy-def-term">
                  {home.alchemyTerm} <span>{home.alchemyPhonetic}</span>{" "}
                  <em>noun</em>
                </p>
                <h5 className="alchemy-def-body">{home.alchemyBody}</h5>
              </div>
            </div>
          </div>
        </section>

        <section className="services">
          <div className="services-row">
            <div className="services-intro">
              <p className="section-kicker">{home.servicesKicker}</p>
              <span className="heading-divider" aria-hidden />
              <h2>{home.servicesTitle}</h2>
              <Link href="/book-intro" className="btn btn-red">
                Book Intro →
              </Link>
            </div>
            <div aria-hidden />
            <div className="service-col">
              {servicesLeft.map((item) => (
                <article key={item.label} className="service-cell">
                  <p className="label">{item.label}</p>
                  <span className="heading-divider" aria-hidden />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <div className="service-col">
              {servicesRight.map((item) => (
                <article key={item.label} className="service-cell">
                  <p className="label">{item.label}</p>
                  <span className="heading-divider" aria-hidden />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="band-photo-wrap">
          <img src={home.bandImage} alt="" />
        </div>

        <section className="capabilities">
          <div className="cap-top">
            <div>
              <p className="section-kicker">Capabilities</p>
              <span className="heading-divider" aria-hidden />
              <h2>
                Multiplying ad dollars into business revenue. Part science, part
                magic, all real.
              </h2>
            </div>
            <div aria-hidden />
          </div>

          <div className="cap-split">
            <div className="cap-photo-col">
              <div className="cap-photo" role="img" aria-label="" />
            </div>
            <aside className="cap-panel">
              <h3>We drive revenue with data-driven decisions.</h3>
              <CapAccordion />
            </aside>
          </div>

          <div className="partners">
            {partners.map((src) => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        </section>

        <section className="collab">
          <div className="collab-inner">
            <div>
              <p className="label">Collaboration</p>
              <h2>
                Ready to drive revenue?
                <br />
                Book an intro.
              </h2>
            </div>
            <Link href="/book-intro" className="btn btn-red">
              Book Intro →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
