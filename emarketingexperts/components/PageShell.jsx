import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PageShell({
  eyebrow,
  title,
  lead,
  children,
  cta = true,
}) {
  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {lead ? <p>{lead}</p> : null}
          </div>
        </section>
        <section className="section">
          <div className="wrap">{children}</div>
        </section>
        {cta ? (
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
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
