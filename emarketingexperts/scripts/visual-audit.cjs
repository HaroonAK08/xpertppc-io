const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "_audit");
const VIEW = { width: 1440, height: 900 };
const ORIGIN = "https://alchemypaidmedia.com";
const LOCAL = "http://127.0.0.1:3002";

const routes = [
  { id: "home", orig: "/", local: "/" },
  { id: "home-services", orig: "/home-services/", local: "/home-services" },
  { id: "medical", orig: "/medical/", local: "/medical" },
  { id: "hospitality", orig: "/hospitality/", local: "/hospitality" },
  { id: "legal", orig: "/legal/", local: "/legal" },
  { id: "sem", orig: "/search-engine-marketing/", local: "/search-engine-marketing" },
  { id: "brand-awareness", orig: "/brand-awareness/", local: "/brand-awareness" },
  { id: "seo", orig: "/seo/", local: "/seo" },
  { id: "brand-films", orig: "/brand-films/", local: "/brand-films" },
  {
    id: "start-free",
    orig: "/marketing-agency-in-orange-county/",
    local: "/marketing-agency-in-orange-county",
  },
  { id: "book-intro", orig: "/book-intro/", local: "/book-intro" },
  {
    id: "case-fair",
    orig: "/500000-attendees-to-the-fair-in-10-weekends/",
    local: "/500000-attendees-to-the-fair-in-10-weekends",
  },
  {
    id: "case-yacht",
    orig: "/luxury-yacht-ppc-case-study/",
    local: "/luxury-yacht-ppc-case-study",
  },
  { id: "case-plumb", orig: "/plumbers-google-ads/", local: "/plumbers-google-ads" },
];

async function shot(page, url, file) {
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  // dismiss cookie/consent if any
  try {
    await page.locator("text=Accept").first().click({ timeout: 1500 });
  } catch {}
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: file, fullPage: false });
  const full = file.replace(".png", "-full.png");
  await page.screenshot({ path: full, fullPage: true });
  return res ? res.status() : 0;
}

async function metrics(page) {
  return page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    const h1 = document.querySelector("h1");
    const h1s = h1 ? getComputedStyle(h1) : null;
    const btn = document.querySelector(".btn-red, .btn-primary, a.btn, .ohio-widget.button a, .button");
    const btns = btn ? getComputedStyle(btn) : null;
    const main = document.querySelector("main") || document.body;
    return {
      bodyBg: cs.backgroundColor,
      bodyColor: cs.color,
      bodyFont: cs.fontFamily,
      h1Size: h1s?.fontSize || null,
      h1Weight: h1s?.fontWeight || null,
      h1LH: h1s?.lineHeight || null,
      h1Track: h1s?.letterSpacing || null,
      h1Text: h1?.innerText?.slice(0, 120) || null,
      btnBg: btns?.backgroundColor || null,
      btnRadius: btns?.borderRadius || null,
      btnPad: btns ? `${btns.paddingTop} ${btns.paddingRight}` : null,
      scrollH: document.documentElement.scrollHeight,
      mainW: main.getBoundingClientRect().width,
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEW,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const report = [];

  for (const r of routes) {
    const row = { id: r.id };
    try {
      row.origStatus = await shot(
        page,
        ORIGIN + r.orig,
        path.join(OUT, `${r.id}__orig.png`)
      );
      row.origMetrics = await metrics(page);
    } catch (e) {
      row.origError = String(e.message || e);
    }
    try {
      row.localStatus = await shot(
        page,
        LOCAL + r.local,
        path.join(OUT, `${r.id}__local.png`)
      );
      row.localMetrics = await metrics(page);
    } catch (e) {
      row.localError = String(e.message || e);
    }
    report.push(row);
    console.log(
      r.id,
      "orig",
      row.origStatus || row.origError,
      "local",
      row.localStatus || row.localError
    );
  }

  fs.writeFileSync(path.join(OUT, "metrics.json"), JSON.stringify(report, null, 2));
  await browser.close();
  console.log("done", OUT);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
