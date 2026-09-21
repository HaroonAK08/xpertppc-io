# eMarketing Experts

Clone of [Alchemy Paid Media](https://alchemypaidmedia.com/) with matching routes and scraped page content.

## Run

```bash
cd emarketingexperts
npm install
npm run dev
```

Open http://localhost:3002

## Website Editor (private)

Password-gated CMS for editing text, images, and videos. Saves publish to the live site.

1. Copy `.env.example` to `.env.local` and set `CMS_ADMIN_PASSWORD` + `CMS_ADMIN_SECRET`
2. Open http://localhost:3002/admin/login
3. Default local password (if unset): `changeme`

| Path | Purpose |
|---|---|
| `/admin/login` | Sign in |
| `/admin` | Section list |
| `/admin/edit/[section]` | Edit page content / media / videos |

Uploads go to `public/uploads/`. Overrides are stored in `data/cms-store.json` (gitignored).

## Routes (matched to Alchemy)

| Section | Path |
|---|---|
| Home | `/` |
| Home Services | `/home-services` |
| Healthcare | `/medical` |
| Hospitality | `/hospitality` |
| Legal | `/legal` |
| Paid Search | `/search-engine-marketing` |
| Paid Social | `/brand-awareness` |
| SEO | `/seo` |
| Video Marketing | `/brand-films` |
| Start for Free | `/marketing-agency-in-orange-county` |
| Fair Meta Ads | `/500000-attendees-to-the-fair-in-10-weekends` |
| Yacht PPC | `/luxury-yacht-ppc-case-study` |
| Plumbing | `/plumbers-google-ads` |
| Book Intro | `/book-intro` |
