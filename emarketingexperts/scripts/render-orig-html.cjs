const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const REF = path.join(__dirname, "..", "_ref", "pages");
const OUT = path.join(__dirname, "_audit");
const VIEW = { width: 1440, height: 900 };

const pages = [
  ["home", "home-fresh.html", "home.html"],
  ["home-services", "home-services-full.html", "home-services.html"],
  ["medical", "medical.html"],
  ["hospitality", "hospitality.html"],
  ["legal", "legal.html"],
  ["sem", "search-engine-marketing.html"],
  ["brand-awareness", "brand-awareness.html"],
  ["seo", "seo.html"],
  ["brand-films", "brand-films.html"],
  ["start-free", "marketing-agency-in-orange-county.html"],
  ["book-intro", "book-intro.html"],
  ["case-fair", "500000-attendees-to-the-fair-in-10-weekends.html"],
  ["case-yacht", "luxury-yacht-ppc-case-study.html"],
  ["case-plumb", "plumbers-google-ads.html"],
];

function pickFile(names) {
  for (const n of names) {
    const p = path.join(REF, n);
    if (fs.existsSync(p) && fs.statSync(p).size > 20000) return p;
  }
  return null;
}

function prepareHtml(raw) {
  let html = raw;
  // strip wayback/scripts that break
  html = html.replace(/https:\/\/web\.archive\.org\/web\/\d+(?:im_|cs_|js_|if_)?\//g, "");
  if (!/<base\s/i.test(html)) {
    html = html.replace(
      /<head([^>]*)>/i,
      '<head$1><base href="https://alchemypaidmedia.com/">'
    );
  }
  // force light scheme
  html = html.replace(/data-theme="[^"]*"/g, 'data-theme="light"');
  html = html.replace(/class="([^"]*dark-scheme[^"]*)"/, (m, c) =>
    `class="${c.replace(/dark-scheme/g, "light-scheme")}"`
  );
  return html;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();
  // allow alchemy assets
  page.route("**/*", (route) => route.continue());

  for (const [id, ...names] of pages) {
    const file = pickFile(names);
    if (!file) {
      console.log(id, "NOFILE");
      continue;
    }
    const raw = fs.readFileSync(file, "utf8");
    const html = prepareHtml(raw);
    await page.setContent(html, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(4000);
    // hide cursor/admin overlays if any
    await page.addStyleTag({
      content: `
      #wpadminbar, .scroll-top, .clb-popup { display:none !important; }
      html, body { overflow-x: hidden !important; }
    `,
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const out = path.join(OUT, `${id}__orig.png`);
    await page.screenshot({ path: out, fullPage: false });
    await page.screenshot({
      path: path.join(OUT, `${id}__orig-full.png`),
      fullPage: true,
    });
    const size = fs.statSync(out).size;
    const title = await page.title();
    console.log(id, "size", size, title.slice(0, 50));
  }

  // also recapture local home-services for compare
  await page.goto("http://127.0.0.1:3002/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "home__local.png") });
  await page.goto("http://127.0.0.1:3002/home-services", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "home-services__local.png") });
  await page.screenshot({
    path: path.join(OUT, "home-services__local-full.png"),
    fullPage: true,
  });

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
