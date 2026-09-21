"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [meta, setMeta] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setMeta(data.meta || []);
        setUpdatedAt(data.updatedAt || null);
      })
      .catch((err) => setError(err.message));
  }, []);

  const groups = {
    Core: meta.filter((m) => ["home", "book-intro", "site"].includes(m.id)),
    "Case Studies": meta.filter((m) =>
      [
        "500000-attendees-to-the-fair-in-10-weekends",
        "luxury-yacht-ppc-case-study",
        "plumbers-google-ads",
        "marketing-agency-in-orange-county",
      ].includes(m.id)
    ),
    Expertise: meta.filter((m) =>
      ["home-services", "medical", "hospitality", "legal"].includes(m.id)
    ),
    Capabilities: meta.filter((m) =>
      ["search-engine-marketing", "brand-awareness", "seo", "brand-films"].includes(
        m.id
      )
    ),
  };

  return (
    <div className="cms-wrap">
      <div className="cms-hero">
        <div>
          <p className="cms-kicker">Editorial</p>
          <h1>Edit website content</h1>
          <p className="cms-muted">
            Change text, images, and videos here. Saves apply to the live site
            immediately. Visitors cannot access this area.
          </p>
        </div>
        {updatedAt ? (
          <p className="cms-pill">Last save {new Date(updatedAt).toLocaleString()}</p>
        ) : (
          <p className="cms-pill">Using default content</p>
        )}
      </div>
      {error ? <div className="cms-error">{error}</div> : null}
      {Object.entries(groups).map(([title, items]) =>
        items.length ? (
          <section key={title} className="cms-section">
            <h2>{title}</h2>
            <div className="cms-card-grid">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/edit/${item.id}`}
                  className="cms-card"
                >
                  <strong>{item.label}</strong>
                  <span>{item.id}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
