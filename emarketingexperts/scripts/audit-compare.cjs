const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(__dirname, "_audit");
const VIEW = { width: 1440, height: 900 };
const LOCAL = "http://127.0.0.1:3002";

const routes = [
  { id: "home", local: "/", html: ["home-fresh.html", "home.html"], postCss: "post-227308.css" },
  { id: "home-services", local: "/home-services", html: ["home-services-full.html", "home-services.html"], postCss: "post-235.css" },
  { id: "medical", local: "/medical", html: ["medical.html"], postCss: "post-235.css" },
  { id: "hospitality", local: "/hospitality", html: ["hospitality.html"], postCss: "post-235.css" },
  { id: "legal", local: "/legal", html: ["legal.html"], postCss: "post-235.css" },
  { id: "sem", local: "/search-engine-marketing", html: ["search-engine-marketing.html"], postCss: "post-227308.css" },
  { id: "brand-awareness", local: "/brand-awareness", html: ["brand-awareness.html"], postCss: "post-227308.css" },
  { id: "seo", local: "/seo", html: ["seo.html"], postCss: "post-227308.css" },
  { id: "brand-films", local: "/brand-films", html: ["brand-films.html"], postCss: "post-227308.css" },
  { id: "start-free", local: "/marketing-agency-in-orange-county", html: ["marketing-agency-in-orange-county.html"], postCss: "post-227308.css" },
  { id: "book-intro", local: "/book-intro", html: ["book-intro.html"], postCss: "post-227308.css" },
  { id: "case-fair", local: "/500000-attendees-to-the-fair-in-10-weekends", html: ["500000-attendees-to-the-fair-in-10-weekends.html"], postCss: "post-227308.css" },
  { id: "case-yacht", local: "/luxury-yacht-ppc-case-study", html: ["luxury-yacht-ppc-case-study.html"], postCss: "post-227308.css" },
  { id: "case-plumb", local: "/plumbers-google-ads", html: ["plumbers-google-ads.html"], postCss: "post-227308.css" },
];

const ELEMENTOR_POLYFILL = `
.e-con{display:var(--display,flex);flex-direction:var(--flex-direction,row);flex-wrap:var(--flex-wrap,nowrap);justify-content:var(--justify-content,flex-start);align-items:var(--align-items,flex-start);gap:var(--gap,0);row-gap:var(--row-gap,0);column-gap:var(--column-gap,0);width:var(--width,100%);min-height:var(--min-height,auto);padding:var(--padding-top,0) var(--padding-right,0) var(--padding-bottom,0) var(--padding-left,0);margin:var(--margin-top,0) var(--margin-right,0) var(--margin-bottom,0) var(--margin-left,0);box-sizing:border-box;position:relative;}
.e-con-full{width:100%;}
.e-con-boxed{max-width:1140px;margin-inline:auto;}
.e-flex{display:flex;}
.elementor-widget-container{width:100%;}
.elementor-widget{width:100%;}
.elementor-invisible{opacity:1!important;transform:none!important;}
#wpadminbar,.scroll-top,.clb-popup,#wm-ipp-base{display:none!important;}
html,body{overflow-x:hidden!important;background:#fff!important;}
body{margin:0;}
img{max-width:100%;height:auto;}
`;

function pickHtml(names) {
  for (const n of names) {
    const p = path.join(ROOT, "_ref", "pages", n);
    if (fs.existsSync(p) && fs.statSync(p).size > 20000) return p;
  }
  return null;
}

function prepareHtml(raw, postCssName) {
  let html = raw;
  html = html.replace(/https:\/\/web\.archive\.org\/web\/\d+(?:im_|cs_|js_|if_)?\//g, "");
  html = html.replace(/data-theme="[^"]*"/g, 'data-theme="light"');
  html = html.replace(/dark-scheme/g, "light-scheme");

  // point uploads to local images by basename when possible
  html = html.replace(
    /https?:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/[^"'\\s)]+/g,
    (u) => {
      const base = path.basename(u.split("?")[0]);
      const local = path.join(ROOT, "public", "images", base);
      if (fs.existsSync(local)) return `/images/${base}`;
      // try without size suffixes
      return u;
    }
  );

  const inject = `
<link rel="stylesheet" href="/css/extra/fonts.css">
<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/post-278.css">
<link rel="stylesheet" href="/css/${postCssName}">
<style>${ELEMENTOR_POLYFILL}</style>
<base href="http://127.0.0.1:3456/">
`;
  if (!/<base\s/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>${inject}`);
  } else {
    html = html.replace(/<head([^>]*)>/i, `<head$1>${inject}`);
  }
  return html;
}

function startStaticServer() {
  const mime = {
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".html": "text/html",
  };
  return http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let file;
    if (urlPath.startsWith("/images/")) {
      file = path.join(ROOT, "public", urlPath);
    } else if (urlPath.startsWith("/css/")) {
      file = path.join(ROOT, "_ref", urlPath);
    } else if (urlPath.startsWith("/wp-content/")) {
      // map uploads basename
      const base = path.basename(urlPath);
      const candidate = path.join(ROOT, "public", "images", base);
      file = fs.existsSync(candidate) ? candidate : path.join(ROOT, "_ref", "assets", base);
    } else {
      file = path.join(ROOT, "_ref", urlPath.replace(/^\//, ""));
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end("missing");
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  }).listen(3456, "127.0.0.1");
}

async function shot(page, file, full = false) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: file, fullPage: full });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();
  const report = [];

  for (const r of routes) {
    const row = { id: r.id };
    const htmlPath = pickHtml(r.html);
    if (htmlPath) {
      try {
        const raw = fs.readFileSync(htmlPath, "utf8");
        const html = prepareHtml(raw, r.postCss);
        await page.setContent(html, { waitUntil: "load", timeout: 90000 });
        await page.waitForTimeout(2500);
        await shot(page, path.join(OUT, `${r.id}__orig.png`), false);
        await shot(page, path.join(OUT, `${r.id}__orig-full.png`), true);
        row.origOk = true;
        row.origSize = fs.statSync(path.join(OUT, `${r.id}__orig.png`)).size;
        row.origTitle = await page.title();
      } catch (e) {
        row.origError = String(e.message || e);
      }
    } else {
      row.origError = "no html";
    }

    try {
      await page.goto(LOCAL + r.local, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1200);
      await shot(page, path.join(OUT, `${r.id}__local.png`), false);
      await shot(page, path.join(OUT, `${r.id}__local-full.png`), true);
      row.localOk = true;
      row.localSize = fs.statSync(path.join(OUT, `${r.id}__local.png`)).size;
      row.localH1 = await page.locator("h1").first().textContent().catch(() => "");
    } catch (e) {
      row.localError = String(e.message || e);
    }

    report.push(row);
    console.log(
      r.id,
      "orig",
      row.origOk ? row.origSize : row.origError,
      "local",
      row.localOk ? row.localSize : row.localError
    );
  }

  // homepage section crops
  try {
    await page.goto(LOCAL + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const sections = [
      [".hero", "home__local-hero"],
      [".services", "home__local-services"],
      [".capabilities", "home__local-caps"],
      [".cap-split", "home__local-cap-split"],
      [".collab", "home__local-collab"],
      ["footer", "home__local-footer"],
    ];
    for (const [sel, name] of sections) {
      await page.evaluate((s) => {
        document.querySelector(s)?.scrollIntoView({ block: "start" });
      }, sel);
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    }
  } catch (e) {
    console.log("section crops", e.message);
  }

  fs.writeFileSync(path.join(OUT, "metrics.json"), JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
