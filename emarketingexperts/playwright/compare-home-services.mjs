import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REF_HTML = path.join(ROOT, "_ref/pages/home-services-full.html");
const OUT = path.join(ROOT, "scripts/_audit/compare");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "d-1440", width: 1440, height: 900 },
  { name: "d-1920", width: 1920, height: 1080 },
  { name: "d-1366", width: 1366, height: 768 },
  { name: "t-1024", width: 1024, height: 1366 },
  { name: "t-768", width: 768, height: 1024 },
  { name: "m-390", width: 390, height: 844 },
  { name: "m-375", width: 375, height: 812 },
  { name: "m-430", width: 430, height: 932 },
];

function buildReferenceHtml() {
  let html = fs.readFileSync(REF_HTML, "utf8");
  html = html.replace(/<link[^>]+rel=['"]stylesheet['"][^>]*>/gi, "");
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

  const localCssLinks = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/_ref/css/style.css">
<link rel="stylesheet" href="/_ref/css/post-278.css">
<link rel="stylesheet" href="/_ref/css/post-235.css">
<style id="ref-force">
  .elementor-invisible { visibility: visible !important; opacity: 1 !important; }
  .elementor-invisible.elementor-animation-fadeInUp,
  [data-settings*="fadeInUp"] { animation: none !important; transform: none !important; }
  html, body { margin: 0; background: #fff; }
</style>
`;
  html = html.replace("</head>", localCssLinks + "</head>");

  const remaps = [
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/1\.png/g,
      "/images/1.png",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/background\.png/g,
      "/images/background.png",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2020\/03\/oh__img92\.jpg/g,
      "/images/oh__img92.jpg",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2020\/03\/oh__img102-min\.jpg/g,
      "/images/yt-2bB-n8siBPE.jpg",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/google-ads-certified[^"'\s]*/g,
      "/images/google-ads-certified.jpg",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/microsoft-advertiser-partner[^"'\s]*/g,
      "/images/microsoft-advertiser-partner.png",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/meta-partner\.png\.webp/g,
      "/images/meta-partner.png.webp",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/Partner-AC-logo\.png/g,
      "/images/Partner-AC-logo.png",
    ],
    [
      /https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/Screenshot-2025-04-01-at-11\.26\.10[^"'\s]*/g,
      "/images/call-log-screenshot.png",
    ],
  ];
  for (const [re, to] of remaps) html = html.replace(re, to);
  return html;
}

function contentType(p) {
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".js")) return "application/javascript";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".html")) return "text/html";
  return "application/octet-stream";
}

function startRefServer(html) {
  const refPagePath = path.join(OUT, "reference-home-services.html");
  fs.writeFileSync(refPagePath, html);

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (
      url === "/" ||
      url === "/home-services/" ||
      url === "/home-services"
    ) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(refPagePath));
      return;
    }
    const candidates = [
      path.join(ROOT, url.replace(/^\//, "")),
      path.join(ROOT, "public", url.replace(/^\//, "")),
    ];
    for (const fp of candidates) {
      if (
        fp.startsWith(ROOT) &&
        fs.existsSync(fp) &&
        fs.statSync(fp).isFile()
      ) {
        res.writeHead(200, { "Content-Type": contentType(fp) });
        res.end(fs.readFileSync(fp));
        return;
      }
    }
    res.writeHead(404);
    res.end("missing " + url);
  });

  return new Promise((resolve) => {
    server.listen(3010, "127.0.0.1", () => resolve(server));
  });
}

async function measurePage(page) {
  return page.evaluate(() => {
    const headings = [...document.querySelectorAll("h1,h2,h3")]
      .slice(0, 24)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName,
          text: el.innerText.slice(0, 90).replace(/\s+/g, " "),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          fontFamily: cs.fontFamily.split(",")[0].replace(/['"]/g, ""),
          w: Math.round(r.width),
          top: Math.round(r.top + window.scrollY),
        };
      });

    const sections = [
      "Expertise",
      "Capabilities",
      "Approach",
      "Statistics",
      "How we help",
      "The bottom line",
      "Be brave",
    ].map((label) => {
      const el = [...document.querySelectorAll("p,span,div,h2,h3")].find((n) =>
        (n.innerText || "").trim().startsWith(label)
      );
      if (!el) return { label, found: false };
      const r = el.getBoundingClientRect();
      return {
        label,
        found: true,
        top: Math.round(r.top + window.scrollY),
      };
    });

    return {
      title: document.title,
      scrollH: document.documentElement.scrollHeight,
      headings,
      sections,
    };
  });
}

async function capture(browser, label, baseUrl) {
  const results = { label, viewports: {} };
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    try {
      await page.goto(baseUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(1200);
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        document.querySelectorAll(".exp-anim").forEach((n) => n.classList.add("in"));
      });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(OUT, `${label}__${vp.name}__full.png`),
        fullPage: true,
      });
      await page.screenshot({
        path: path.join(OUT, `${label}__${vp.name}__hero.png`),
        fullPage: false,
      });
      if (vp.name === "d-1440") {
        results.metrics = await measurePage(page);
        fs.writeFileSync(
          path.join(OUT, `${label}__metrics.json`),
          JSON.stringify(results.metrics, null, 2)
        );
      }
      results.viewports[vp.name] = { ok: true, errors: errors.slice(0, 8) };
      console.log(label, vp.name, "ok");
    } catch (e) {
      results.viewports[vp.name] = { ok: false, error: String(e).slice(0, 300) };
      console.log(label, vp.name, "FAIL", e.message.slice(0, 160));
    }
    await page.close();
  }
  return results;
}

async function tryLive(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  try {
    const res = await page.goto("https://alchemypaidmedia.com/home-services/", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(2500);
    const title = await page.title();
    await page.screenshot({ path: path.join(OUT, "live-attempt.png") });
    const status = {
      status: res && res.status(),
      title,
      url: page.url(),
      blocked: /403|Forbidden|Robot|Just a moment/i.test(title),
    };
    fs.writeFileSync(
      path.join(OUT, "live-status.json"),
      JSON.stringify(status, null, 2)
    );
    console.log("LIVE", status);
    return status;
  } catch (e) {
    const status = { error: String(e).slice(0, 300), blocked: true };
    fs.writeFileSync(
      path.join(OUT, "live-status.json"),
      JSON.stringify(status, null, 2)
    );
    return status;
  } finally {
    await page.close();
  }
}

async function main() {
  const html = buildReferenceHtml();
  const server = await startRefServer(html);
  console.log("ref server http://127.0.0.1:3010/home-services/");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const live = await tryLive(browser);
  const ref = await capture(
    browser,
    "ref",
    "http://127.0.0.1:3010/home-services/"
  );
  const local = await capture(
    browser,
    "local",
    "http://127.0.0.1:3002/home-services"
  );

  const summary = {
    live,
    note: live.blocked
      ? "Live Alchemy blocked by Cloudflare; comparing against scraped HTML+CSS render on :3010"
      : "Live Alchemy reachable",
    refScrollH: ref.metrics?.scrollH,
    localScrollH: local.metrics?.scrollH,
    refSections: ref.metrics?.sections,
    localSections: local.metrics?.sections,
    refHeadings: ref.metrics?.headings,
    localHeadings: local.metrics?.headings,
  };
  fs.writeFileSync(
    path.join(OUT, "summary.json"),
    JSON.stringify(summary, null, 2)
  );

  await browser.close();
  server.close();
  console.log("wrote", path.join(OUT, "summary.json"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
