"use client";

import { useState } from "react";

const FALLBACK_ITEMS = [
  {
    title: "Qualified Lead Conversion Tracking",
    body: "Value-based conversions in GA4, GTM, and CallRail are our elixir of sustainable, scalable success.",
  },
  {
    title: "Transparent KPI Reports",
    body: "Along with daily pulse checks on all paid media accounts, we provide KPI reports Clientside plus real time reporting dashboards to make optimizations in real time.",
  },
  {
    title: "Real Revenue Analysis",
    body: "We include real revenue sales reports in all of our data driven decisions, not just surface level clicks and likes.",
  },
];

export default function CapAccordion({ items }) {
  const [open, setOpen] = useState(0);
  const list = items?.length ? items : FALLBACK_ITEMS;

  return (
    <div className="cap-accordion">
      {list.map((item, i) => {
        const active = open === i;
        return (
          <div
            key={item.title}
            className={`cap-acc-item${active ? " active" : ""}`}
          >
            <button
              type="button"
              className="cap-acc-btn"
              aria-expanded={active}
              onClick={() => setOpen(active ? -1 : i)}
            >
              <span className={`cap-acc-icon${active ? " is-open" : ""}`} aria-hidden />
              <span className="cap-acc-title" data-cms-key={`home::accordionItems.${i}.title`}>
                {item.title}
              </span>
            </button>
            {active ? (
              <div className="cap-acc-body" data-cms-key={`home::accordionItems.${i}.body`}>
                {item.body}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
