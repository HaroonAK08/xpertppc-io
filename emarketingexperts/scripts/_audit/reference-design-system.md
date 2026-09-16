# Reference design system (Alchemy / Ohio theme)

Extracted from `_ref/css/style.css`, inline Ohio vars in scraped HTML, and Elementor `post-*.css`.

**Live site:** Cloudflare often blocks Playwright. Prefer these values + scraped HTML/CSS over guesswork.

---

## Template families

| Family | Routes | Ref Elementor posts | Local component |
|--------|--------|---------------------|-----------------|
| **Home** | `/` | `227308` | `app/page.js` |
| **Expertise** | `/home-services/`, `/medical/`, `/hospitality/`, `/legal/` | `235`, `227391`, `227578`, `227571` | `ExpertisePage` |
| **Capabilities** | `/search-engine-marketing/`, `/brand-awareness/`, `/seo/`, `/brand-films/` | `227587`, `227598`, `227609`, `227604` | Currently forced into `ExpertisePage` — **wrong for SEM shape** (extra capability blocks / 01–05) |
| **Start free** | `/marketing-agency-in-orange-county/` | `226480` | `InnerPage` type promo |
| **Case study** | fair / yacht / plumbers | `227648`, `227629`, `227655` | `InnerPage` type case — **far from Elementor** |
| **Book intro** | `/book-intro/` | `227485` | Custom form page |

Shared chrome on all pages: Header, Footer, left theme rail, Follow Us rail, Scroll to top.

---

## Colors

| Token | Value | Notes |
|-------|-------|-------|
| Primary / brand | `#d90a2c` | `--clb-color-primary`, WP brand |
| Primary soft | `rgba(217,10,44,0.5)` | highlight underline |
| Ink | `#111013` / site uses `#101014` | near-black titles |
| Muted | `#82838c` | subtitles, body secondary |
| Soft section bg | `#88888910` | capabilities / finale panel / footer tint |
| Border | `#635D6FA6` | column rules, dividers |
| Dark CTA bg | `#101014` | collab band |
| Button radius | `8px` / `0.35rem` | `--clb-button-border-radius` |

Local CSS variables should stay aligned: `--red`, `--ink`, `--muted`, `--line-soft`.

---

## Typography

| Role | Family | Weight | Size | Line-height | Letter-spacing |
|------|--------|--------|------|-------------|----------------|
| Titles | **DM Sans** | **600** | — | — | — |
| H1 | DM Sans | 600 | `clamp(3.105rem, 4.5vw + 0.25rem, 4.5rem)` | `1` | `-0.045em` |
| H2 | DM Sans | 600 | `clamp(2.1735rem, 3.15vw + 0.25rem, 3.15rem)` | `1.05` | `-0.04em` |
| H3 | DM Sans | 600 | `clamp(2rem, 2.205vw + 0.25rem, 2.205rem)` | `1.1` | `-0.035em` |
| H4 (cards) | DM Sans | 600 | `clamp(1.5rem, 1.5435vw + 0.25rem, 1.5435rem)` | `1.2` | `-0.03em` |
| Body | Inter / system | 400 | `1.025rem` | `1.6` | — |
| Subtitle | DM Sans | 500 | `0.9em` | inherit | — |
| Nav | DM Sans / Inter | 600 | ~15px | — | — |
| Buttons | DM Sans | 600 | ~15px | — | — |

**Do not use weight 700 for Ohio titles.**

---

## Layout

| Token | Value |
|-------|-------|
| Container max | **1344px** (`--clb-container-width`) — local often used 1300px |
| Header height | **12vh** (`--clb-header-height`) |
| Sticky header | **9vh** |
| Side gutter | ~`6vh` / `clamp(18px, 3vw, 40px)` |
| Soft section padding | often `10vh` top/bottom |
| Expertise hero | `24vh 0 10vh` (mobile bottom `6vh`) |
| Cap section | bg `#88888910`, row gap `8vh`, card pad `0 30px 0 50px`, left border only |
| Wave / video band | `min-height: 70vh` |
| Finale split | photo **58%** / panel **42%**, panel pad `10vh 0 10vh 8vh` |
| Breakpoints | Elementor mobile **≤767**; tablet rules from `768` |

---

## Components

### Header
- Sticky, min-height 12vh
- Lowercase text logo
- Numbered nav `01`–`06` above labels
- Active / current in primary red
- Dropdowns for Expertise, Capabilities, Case Studies
- Mobile hamburger ≤1100 local / Elementor mobile ≤767

### Side rails
- Left: Light/Dark switcher + “Scroll to top” vertical
- Right: “Follow Us — Ig. / Fb. / Lk.” vertical fixed

### Buttons
- Primary red fill, white text, radius 8px, height ~2.75rem–48px
- Label pattern: `Book Intro →`

### Highlighted text
- Gradient underline `rgba(217,10,44,0.5)`, size `100% 17%`, position ~`0 88%`
- Ohio AOS can animate `background-size`

### Footer
- Soft bg `#88888910`
- 3 columns: Insta + brand title | Newport Beach | Book Intro + email
- Copyright row with Privacy | Terms

### Animations
- Elementor `fadeInUp` on headings/containers, delays often `200`
- Do not invent extra motion

---

## Expertise page section order (shared)

1. Hero (eyebrow Expertise + H1 + highlight + CTA)
2. Capabilities grid (intro + 01/02 / tags + 03/04)
3. Wave background spacer 70vh
4. Approach + phone image
5. Statistics + call log image
6. Divider
7. How we help (services stack + partners + copy)
8. YouTube background band
9. Bottom line + finale photo/accordion
10. Dark CTA “Be brave, say hi.”
11. Footer

---

## Capabilities page differences (SEM example)

Not identical to Expertise:

- Hero eyebrow is **Capabilities** (not Expertise)
- Multiple capability grids (Ads Management + Streamline…)
- Stacked service names in hero/tags: Google Ads / LSA / Microsoft Ads
- Extra `01.`–`05.` block before Approach

Local must stop forcing SEM/SEO/films into a pure Expertise layout without those blocks.

---

## Case study skeleton (plumbers)

Subtitles include Problem / Result / Solution / Metrics / Strategy / Collaboration — not a generic card stack. `InnerPage` is a stub relative to Elementor.

---

## Book intro

- Eyebrow/title: “Be brave, say hello.”
- Phone `949.322.0387`
- “Book A Meeting” form
- Testimonials block present on reference

---

## Local CSS alignment targets

```css
:root {
  --ink: #111013; /* or keep #101014 if already shipped */
  --max: 1344px;
  --red: #d90a2c;
  --muted: #82838c;
  --title: "DM Sans", sans-serif;
  --radius: 8px;
}
```

Title scales for `.exp-title` / `.exp-title-md` / `.exp-card h3` must use the Ohio clamps above.
