import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-col">
          <p className="footer-insta">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Insta</strong>
            </a>
          </p>
          <h3 className="footer-brand">
            emarketing experts performance marketing agency
          </h3>
        </div>
        <div className="footer-col">
          <h3 className="footer-title">Newport Beach</h3>
          <p>
            <strong>eMarketing Experts</strong>
            <br />
            Newport Beach,
            <br />
            California
            <br />
            United States
          </p>
        </div>
        <div className="footer-col">
          <h3 className="footer-title">Book Intro</h3>
          <p>
            Interested in working with us?
            <br />
            <strong>
              <a
                className="footer-email"
                href="mailto:hello@emarketingexperts.com"
              >
                hello@emarketingexperts.com
              </a>
            </strong>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrap footer-bottom-inner">
          <span>
            © {new Date().getFullYear()}, eMarketing Experts. Made with passion.
          </span>
          <span>
            <Link href="/privacy">Privacy & Cookie Policy</Link>
            {" | "}
            <Link href="/terms">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
