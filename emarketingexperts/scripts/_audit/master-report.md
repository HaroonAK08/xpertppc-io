# Master visual audit report

Generated: 2026-09-15T17:57:26.649Z

## Executive status (honest)

| Metric | Value |
|--------|-------|
| Routes audited | **14 / 14** |
| Fully pixel-complete | **0** |
| Routes still with known differences | **14** |
| Desktop (1440) | mostly `needs-work` (~8–17% pixel diff) — not pass |
| Tablet (768) | `needs-work` / `fail` |
| Mobile (390) | mostly `fail` / high diff |
| Live Alchemy Playwright | **blocked** (Cloudflare) |
| Reference fallback | scraped `_ref/pages` + `_ref/css` (page-specific Elementor CSS mostly **not downloadable**) |

Closest desktop routes right now: brand-awareness (~8.4%), book-intro (~8.7%), SEM (~9.9%), home-services (~10.4%).  
Largest structural gaps: promo landing (~5k vs ~19k px), case studies (~3.7k vs ~6–7k px), SEO/films (ref page CSS missing → collapsed ref render).  
Home height gap narrowed (~4187 vs ~4602 @1440 after hero/band fixes) but pixel diff still ~19%.

**Do not treat height proximity or a single viewport as completion.**

## Live reference access

- Accessible: **false**
- Status: 0
- Blocked: true
- Fallback: scraped _ref/pages HTML + _ref/css (Cloudflare-safe)

Viewports audited: 1440, 768, 390

| Route | Type | Desktop | Tablet | Mobile | Final | Top issues |
|-------|------|---------|--------|--------|-------|------------|
| / | home | needs-work | fail | fail | fail | 1440: high visual diff 16.9%; 768: high visual diff 28.8% |
| /home-services/ | expertise | needs-work | needs-work | needs-work | needs-work | 768: high visual diff 12.95%; 390: high visual diff 16.67% |
| /medical/ | expertise | needs-work | fail | fail | needs-work | 768: high visual diff 18.43%; 390: high visual diff 20.74% |
| /hospitality/ | expertise | needs-work | needs-work | fail | needs-work | 768: high visual diff 17.91%; 390: high visual diff 21.13% |
| /legal/ | expertise | needs-work | needs-work | fail | needs-work | 768: high visual diff 17.31%; 390: high visual diff 21.43% |
| /search-engine-marketing/ | capabilities | needs-work | needs-work | fail | needs-work | 768: high visual diff 13.95%; 390: high visual diff 19.5% |
| /brand-awareness/ | capabilities | needs-work | needs-work | fail | needs-work | 768: high visual diff 13.96%; 390: high visual diff 18.77% |
| /seo/ | capabilities | needs-work | needs-work | needs-work | needs-work | 768: high visual diff 15.14%; 390: high visual diff 17.98% |
| /brand-films/ | capabilities | needs-work | needs-work | fail | needs-work | 768: high visual diff 14.12%; 390: high visual diff 19.62% |
| /marketing-agency-in-orange-county/ | promo | needs-work | needs-work | fail | fail | 768: high visual diff 13.38%; 390: high visual diff 20.83% |
| /500000-attendees-to-the-fair-in-10-weekends/ | case | needs-work | needs-work | fail | fail | 1440: high visual diff 14.65%; 768: high visual diff 17.52% |
| /luxury-yacht-ppc-case-study/ | case | needs-work | needs-work | fail | fail | 768: high visual diff 12.85%; 390: high visual diff 21.78% |
| /plumbers-google-ads/ | case | needs-work | needs-work | fail | fail | 768: high visual diff 12.25%; 390: high visual diff 22.05% |
| /book-intro/ | book-intro | needs-work | needs-work | needs-work | needs-work | 768: high visual diff 12.99%; Reference CSS: 227485 blocked |

## Per-route notes

### /

- Page type: home
- Reference: scraped-html-ok
- Local: ok
- Final: **fail**
- 1440 diff: 16.9% | heights local 3592 / ref 4711
- H1 local: Drive revenue to your business with paid ads.
- H1 ref: Drive revenue to your business with paid ads.
- Known differences:
  - 1440: high visual diff 16.9%
  - 768: high visual diff 28.8%
  - 390: high visual diff 38.38%

### /home-services/

- Page type: expertise
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 10.4% | heights local 6212 / ref 7350
- H1 local: Driving qualified leads to local services just like you.
- H1 ref: Driving qualified leads to local services just like you.
- Known differences:
  - 768: high visual diff 12.95%
  - 390: high visual diff 16.67%

### /medical/

- Page type: expertise
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 11.21% | heights local 6203 / ref 5846
- H1 local: Driving qualified leads to medical practices just like you.
- H1 ref: Driving qualified leads to medical practices just like you.
- Known differences:
  - 768: high visual diff 18.43%
  - 390: high visual diff 20.74%
  - Reference CSS: using post-235 stand-in (227391 blocked)

### /hospitality/

- Page type: expertise
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 11.17% | heights local 6254 / ref 5890
- H1 local: Driving new guests to hospitality brands just like you.
- H1 ref: Driving new guests to hospitality brands just like you.
- Known differences:
  - 768: high visual diff 17.91%
  - 390: high visual diff 21.13%
  - Reference CSS: using post-235 stand-in (227578 blocked)

### /legal/

- Page type: expertise
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 10.86% | heights local 6237 / ref 5941
- H1 local: Driving high value cases to law firms just like you.
- H1 ref: Driving high value cases to law firms just like you.
- Known differences:
  - 768: high visual diff 17.31%
  - 390: high visual diff 21.43%
  - Reference CSS: using post-235 stand-in (227571 blocked)

### /search-engine-marketing/

- Page type: capabilities
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 9.92% | heights local 6509 / ref 6111
- H1 local: Helping you win with Google + Microsoft Ads
- H1 ref: Helping you win with Google + Microsoft Ads
- Known differences:
  - 768: high visual diff 13.95%
  - 390: high visual diff 19.5%
  - Reference CSS: using post-235 stand-in (227587 blocked)

### /brand-awareness/

- Page type: capabilities
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 8.43% | heights local 6026 / ref 5349
- H1 local: Be found everywhere.
- H1 ref: Be found everywhere.
- Known differences:
  - 768: high visual diff 13.96%
  - 390: high visual diff 18.77%
  - Reference CSS: using post-235 stand-in (227598 blocked)
  - Capability pages share ExpertisePage shell; verify section order against Elementor per route

### /seo/

- Page type: capabilities
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 10.39% | heights local 3097 / ref 1985
- H1 local: Dominate the Search Engines
- H1 ref: Dominate the Search Engines
- Known differences:
  - 768: high visual diff 15.14%
  - 390: high visual diff 17.98%
  - Reference CSS: using post-235 stand-in (227609 blocked)
  - Capability pages share ExpertisePage shell; verify section order against Elementor per route

### /brand-films/

- Page type: capabilities
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 11.38% | heights local 2924 / ref 1579
- H1 local: Tell your story with Video Marketing
- H1 ref: Tell your story with Video Marketing
- Known differences:
  - 768: high visual diff 14.12%
  - 390: high visual diff 19.62%
  - Reference CSS: using post-235 stand-in (227604 blocked)
  - Capability pages share ExpertisePage shell; verify section order against Elementor per route

### /marketing-agency-in-orange-county/

- Page type: promo
- Reference: scraped-html-ok
- Local: ok
- Final: **fail**
- 1440 diff: 9.06% | heights local 5093 / ref 19168
- H1 local: Get more customers for your business with paid ads.
- H1 ref: Get more customers for your business with paid ads.
- Known differences:
  - 768: high visual diff 13.38%
  - 390: high visual diff 20.83%
  - Reference CSS: page CSS 226480 blocked; home CSS partial stand-in
  - Template fidelity: still incomplete vs full Elementor reference (missing page CSS + sections)

### /500000-attendees-to-the-fair-in-10-weekends/

- Page type: case
- Reference: scraped-html-ok
- Local: ok
- Final: **fail**
- 1440 diff: 14.65% | heights local 3389 / ref 6415
- H1 local: New LA Fair, 500,000+ Attendees, and Meta Ads
- H1 ref: New LA Fair, 500,000+ Attendees, and Meta Ads
- Known differences:
  - 1440: high visual diff 14.65%
  - 768: high visual diff 17.52%
  - 390: high visual diff 24.4%
  - Reference CSS: 227648 blocked
  - Template fidelity: still incomplete vs full Elementor reference (missing page CSS + sections)

### /luxury-yacht-ppc-case-study/

- Page type: case
- Reference: scraped-html-ok
- Local: ok
- Final: **fail**
- 1440 diff: 9.23% | heights local 3281 / ref 6526
- H1 local: Luxury Yachts, Newport Beach, and Google Ads
- H1 ref: Luxury Yachts, Newport Beach, and Google Ads
- Known differences:
  - 768: high visual diff 12.85%
  - 390: high visual diff 21.78%
  - Reference CSS: 227629 blocked
  - Template fidelity: still incomplete vs full Elementor reference (missing page CSS + sections)

### /plumbers-google-ads/

- Page type: case
- Reference: scraped-html-ok
- Local: ok
- Final: **fail**
- 1440 diff: 9.41% | heights local 3325 / ref 7236
- H1 local: Rebranding a Plumbing Company, High CPC, and Google Ads
- H1 ref: Rebranding a Plumbing Company, High CPC, and Google Ads
- Known differences:
  - 768: high visual diff 12.25%
  - 390: high visual diff 22.05%
  - Reference CSS: 227655 blocked
  - Template fidelity: still incomplete vs full Elementor reference (missing page CSS + sections)

### /book-intro/

- Page type: book-intro
- Reference: scraped-html-ok
- Local: ok
- Final: **needs-work**
- 1440 diff: 8.69% | heights local 1766 / ref 5799
- H1 local: Be brave, say hello.
- H1 ref: (none)
- Known differences:
  - 768: high visual diff 12.99%
  - Reference CSS: 227485 blocked
  - Template fidelity: still incomplete vs full Elementor reference (missing page CSS + sections)

## Commands

```bash
npm run audit:site          # full 8 viewports × 14 routes
npm run audit:site:quick    # 1440 + 768 + 390 only
```

Diff images: `scripts/_audit/diff/<slug>/<viewport>.png` (red = pixel mismatch). Page height alone is not used as a pass criteria.