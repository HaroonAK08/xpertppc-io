const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "_audit");
const VIEW = { width: 1440, height: 900 };
const LOCAL = "http://127.0.0.1:3002";

const routes = [
  { id: "home", local: "/" },
  { id: "home-services", local: "/home-services" },
  { id: "medical", local: "/medical" },
  { id: "hospitality", local: "/hospitality" },
  { id: "legal", local: "/legal" },
  { id: "sem", local: "/search-engine-marketing" },
  { id: "brand-awareness", local: "/brand-awareness" },
  { id: "seo", local: "/seo" },
  { id: "brand-films", local: "/brand-films" },
  { id: "start-free", local: "/marketing-agency-in-orange-county" },
  { id: "book-intro", local: "/book-intro" },
  { id: "case-fair", local: "/500000-attendees-to-the-fair-in-10-weekends" },
  { id: "case-yacht", local: "/luxury-yacht-ppc-case-study" },
  { id: "case-plumb", local: "/plumbers-google-ads" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const r of routes) {
    await page.goto(LOCAL + r.local, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, `${r.id}__local.png`) });
    await page.screenshot({
      path: path.join(OUT, `${r.id}__local-full.png`),
      fullPage: true,
    });
    console.log("ok", r.id);
  }

  // homepage section crops
  await page.goto(LOCAL + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  for (const [sel, name] of [
    [".hero", "home__local-hero"],
    [".services", "home__local-services"],
    [".capabilities", "home__local-caps"],
    [".cap-split", "home__local-cap-split"],
    [".collab", "home__local-collab"],
    ["footer", "home__local-footer"],
  ]) {
    await page.evaluate((s) => {
      document.querySelector(s)?.scrollIntoView({ block: "start" });
    }, sel);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  }

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
