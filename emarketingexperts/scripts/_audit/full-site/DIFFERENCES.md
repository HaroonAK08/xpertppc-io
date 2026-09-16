# FULL-SITE VISUAL DIFFERENCES

**Status: FINAL reconstruction pass implemented. `npm run build` green. Pipeline: `scripts/_audit/pixel-reconstruction/`.**

## Implemented this pass

- [x] Pixel-reconstruction pipeline (`run.mjs`) — multi-viewport capture, metrics JSON, pixelmatch diffs/overlays, `REPORT.md`
- [x] Shared Ohio/Elementor tokens: `--max: 1344px`, `--side: 6vh`, header `12vh`, title scale, body `1.025rem`
- [x] Homepage capabilities rebuilt: heading `42%`, photo/panel `58%|42%` side-by-side (no absolute overlay), asset `oh__demo1__1.jpeg`, **12** partner logos
- [x] Homepage hero: `5.2vw` / `0.9em`, CTA spacer `50px`, flex-end copy column
- [x] Expertise approach `50%|50%`, phone margin `0 22% 0 0`, mobile tokens at `≤767` (wave/band stay `70vh`)
- [x] Collab columns `50%|50%`
- [x] Promo: 11 YouTube embeds, band rhythm, section padding; book-intro counters/copy matched to ref
- [x] All 14 routes static-build successfully

## Remaining blockers (missing assets only)

See `MISSING-ASSETS.md`:

- Blue-Vacation phone PNGs (medical / hospitality / legal) → runtime fallback `1.png`
- Yacht `pacific-avalon-yacht-charters.jpg`; plumbers `5-Star` + `branded-cover`
- Promo client logos (~25 filenames) — wall uses available logos
- Book poster `Screenshot-2025-04-02-at-2.08.22AM.png`
- Promo page CSS `post-226480` blocked — spacer sizes defaulted to Elementor `50px`

## Notes on pixelDiff scores

Hero viewport diffs vs `truth/` / `compare/ref__*` include **intentional rebrand** (`alchemy` → `emarketing experts`) and some mislabeled truth shots (e.g. `truth/home-services.png` is homepage services). Treat section metrics + overlays as primary; scores are secondary.
