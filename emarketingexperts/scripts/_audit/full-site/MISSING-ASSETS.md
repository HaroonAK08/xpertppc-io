# Missing reference assets

Cloudflare blocks live `wp-content/uploads` fetches (HTTP 202 captcha HTML).  
Wayback CDX returned 0 hits / 503 for these filenames.  
Exhaustive repo search (`find` + content search across `_ref/`, `public/`, `scripts/`, HTML/CSS/JSON) found **no local copies**.

## Expertise phones (Medical / Hospitality / Legal)

| Reference asset | Expected local | Referenced in | Element depends on |
|-----------------|----------------|---------------|--------------------|
| `Blue-Vacation-Calling-Phone-Screen-Instagram-Post.png` | `public/images/Blue-Vacation-Calling-Phone-Screen-Instagram-Post.png` | `_ref/pages/content.json`, medical HTML | `/medical/` approach phone |
| `Blue-Vacation-Calling-Phone-Screen-Instagram-Post-MVA-2.png` | `public/images/…-MVA-2.png` | hospitality HTML | `/hospitality/` approach phone |
| `Blue-Vacation-Calling-Phone-Screen-Instagram-Post-MVA.png` | `public/images/…-MVA.png` | legal HTML | `/legal/` approach phone |

**Why unrecovered:** Not in project tree; live uploads captcha; Wayback 404/503; medical/hosp/legal `*__orig-full.png` are CSS-less HTML (~white) — no pixels to crop.

**Runtime:** `ApproachPhone` falls back to `/images/1.png` when these 404. Dropping exact files into `public/images/` activates them automatically via `expertise.js` paths.

## Case study graphics

| Reference asset | Referenced in | Element |
|-----------------|---------------|---------|
| `pacific-avalon-yacht-charters.jpg` | yacht case HTML | Yacht cover / media |
| `HornblowerCompetition.png` | yacht case HTML | CDN Cloudflare-blocked; page uses Alchemy URL with local crop fallback |
| `5-Star-Review-Graphic.png` | plumbers HTML | Review graphic |
| `branded-cover-page.png` | plumbers HTML | Cover image |
| `Screenshot-2025-04-01-at-11.26.10 PM.png` | home-services / promo | Full-res upload blocked; promo uses local `Screenshot-2025-04-01-at-11.26.10-PM-1920x824.png` (user-provided capture) |
| `Screenshot-2025-03-30-at-5.12.08 PM.png` | promo HTML | Promo hero right-column street photo |

**Runtime:** Promo hero uses cropped staging fallback `public/images/promo-hero-street.png` until the exact upload is recovered.
| `Screenshot-2025-04-02-at-2.08.22 AM.png` | book-intro HTML | Video overlay poster |

## Promo client logos (missing locally)

`vh-logo.png`, `cryotherm-logo.png`, `dc-logo.png`, `ss-logo-1.png`, `bb-logo.png`, `uy-white.png`, `bc-logo.png`, `cn-logo-better.png`, `h-logo.png`, `sa-logo.png`, `CLJ_LOGO_400x400-white.png`, `egc-white.png`, `um-logo.png`, `tc-logo.png`, `pc-logo.png`, `ir-logo.png`, `cc-logo.png`, `lc-logo.png`, `kmg-logo.png`, `pr-logo.png`, `eve-logo-white.png`, `ce-logo.png`, `aj-logo.png`, `ntre-logo.png`, `rl.png`, `cropped-DD-new-logo.png`

Available logos are used in the Our Clients wall.

## Recovery

Export blocked files via an authenticated browser session into `public/images/` using the exact filenames above, then re-run visual QA. Do not stop other implementation work while waiting.
