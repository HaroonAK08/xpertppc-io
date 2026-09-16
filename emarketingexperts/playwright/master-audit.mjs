import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const AUDIT = path.join(ROOT, "scripts/_audit");
const REF_DIR = path.join(AUDIT, "reference");
const LOCAL_DIR = path.join(AUDIT, "local");
const DIFF_DIR = path.join(AUDIT, "diff");

const LOCAL_BASE = process.env.LOCAL_BASE || "http://127.0.0.1:3002";
const LIVE_BASE = "https://alchemypaidmedia.com";

const ROUTES = [
  { route: "/", slug: "home", pageType: "home", refFile: "home.html", postCss: ["post-227308.css", "post-278.css"] },
  { route: "/home-services/", slug: "home-services", pageType: "expertise", refFile: "home-services-full.html", postCss: ["post-235.css", "post-278.css"] },
  // Page-specific Elementor CSS blocked by Cloudflare; post-235 is the closest downloaded expertise template CSS.
  { route: "/medical/", slug: "medical", pageType: "expertise", refFile: "medical.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227391 blocked)" },
  { route: "/hospitality/", slug: "hospitality", pageType: "expertise", refFile: "hospitality.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227578 blocked)" },
  { route: "/legal/", slug: "legal", pageType: "expertise", refFile: "legal.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227571 blocked)" },
  { route: "/search-engine-marketing/", slug: "search-engine-marketing", pageType: "capabilities", refFile: "search-engine-marketing.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227587 blocked)" },
  { route: "/brand-awareness/", slug: "brand-awareness", pageType: "capabilities", refFile: "brand-awareness.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227598 blocked)" },
  { route: "/seo/", slug: "seo", pageType: "capabilities", refFile: "seo.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227609 blocked)" },
  { route: "/brand-films/", slug: "brand-films", pageType: "capabilities", refFile: "brand-films.html", postCss: ["post-235.css", "post-278.css"], cssNote: "using post-235 stand-in (227604 blocked)" },
  { route: "/marketing-agency-in-orange-county/", slug: "marketing-agency-in-orange-county", pageType: "promo", refFile: "marketing-agency-in-orange-county.html", postCss: ["post-227308.css", "post-278.css"], cssNote: "page CSS 226480 blocked; home CSS partial stand-in" },
  { route: "/500000-attendees-to-the-fair-in-10-weekends/", slug: "500000-attendees-to-the-fair-in-10-weekends", pageType: "case", refFile: "500000-attendees-to-the-fair-in-10-weekends.html", postCss: ["post-235.css", "post-278.css"], cssNote: "227648 blocked" },
  { route: "/luxury-yacht-ppc-case-study/", slug: "luxury-yacht-ppc-case-study", pageType: "case", refFile: "luxury-yacht-ppc-case-study.html", postCss: ["post-235.css", "post-278.css"], cssNote: "227629 blocked" },
  { route: "/plumbers-google-ads/", slug: "plumbers-google-ads", pageType: "case", refFile: "plumbers-google-ads.html", postCss: ["post-235.css", "post-278.css"], cssNote: "227655 blocked" },
  { route: "/book-intro/", slug: "book-intro", pageType: "book-intro", refFile: "book-intro.html", postCss: ["post-235.css", "post-278.css"], cssNote: "227485 blocked" },
];

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
  { name: "1366", width: 1366, height: 768 },
  { name: "1024", width: 1024, height: 1366 },
  { name: "768", width: 768, height: 1024 },
  { name: "430", width: 430, height: 932 },
  { name: "390", width: 390, height: 844 },
  { name: "375", width: 375, height: 812 },
];

const QUICK = process.argv.includes("--quick");
const ACTIVE_VIEWPORTS = QUICK
  ? VIEWPORTS.filter((v) => ["1440", "768", "390"].includes(v.name))
  : VIEWPORTS;

const IMAGE_REMAPS = [
  [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/[^"'\s]+/g, (m) => {
    const base = path.basename(m.split("?")[0]);
    const localCandidates = [
      path.join(ROOT, "public/images", base),
      path.join(ROOT, "public/images", base.replace(/-\d+x\d+(\.\w+)$/, "$1")),
    ];
    for (const c of localCandidates) {
      if (fs.existsSync(c)) return "/images/" + path.basename(c);
    }
    return m;
  }],
];

function ensureDirs() {
  for (const d of [AUDIT, REF_DIR, LOCAL_DIR, DIFF_DIR]) fs.mkdirSync(d, { recursive: true });
  for (const r of ROUTES) {
    for (const d of [REF_DIR, LOCAL_DIR, DIFF_DIR]) {
      fs.mkdirSync(path.join(d, r.slug), { recursive: true });
    }
  }
}

function buildRefHtml(routeCfg) {
  const fp = path.join(ROOT, "_ref/pages", routeCfg.refFile);
  if (!fs.existsSync(fp)) return null;
  let html = fs.readFileSync(fp, "utf8");
  html = html.replace(/<link[^>]+rel=['"]stylesheet['"][^>]*>/gi, "");
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

  const cssLinks = [
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`,
    `<link rel="stylesheet" href="/_ref/css/extra/frontend.min.css">`,
    `<link rel="stylesheet" href="/_ref/css/extra/ohio-style.css">`,
    `<link rel="stylesheet" href="/_ref/css/style.css">`,
    `<link rel="stylesheet" href="/_ref/css/elementor-polyfill.css">`,
    ...routeCfg.postCss.map((c) => `<link rel="stylesheet" href="/_ref/css/${c}">`),
    `<style>
      .elementor-invisible { visibility: visible !important; opacity: 1 !important; }
      .elementor-invisible.elementor-animation-fadeInUp,
      [data-settings*="fadeInUp"] { animation: none !important; transform: none !important; }
      html, body { margin: 0; background: #fff; overflow-x: hidden; max-width: 100vw; }
      .ohio-sticky-nav, .clb-popup, .cursor, .page-loader { display: none !important; }
    </style>`,
  ].join("\n");
  html = html.replace("</head>", cssLinks + "</head>");

  for (const [re, to] of IMAGE_REMAPS) {
    html = typeof to === "function" ? html.replace(re, to) : html.replace(re, to);
  }
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
  if (p.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function startRefServer(pages) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (pages[url]) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(pages[url]);
      return;
    }
    const candidates = [
      path.join(ROOT, url.replace(/^\//, "")),
      path.join(ROOT, "public", url.replace(/^\//, "")),
    ];
    for (const fp of candidates) {
      if (fp.startsWith(ROOT) && fs.existsSync(fp) && fs.statSync(fp).isFile()) {
        res.writeHead(200, { "Content-Type": contentType(fp) });
        res.end(fs.readFileSync(fp));
        return;
      }
    }
    res.writeHead(404);
    res.end("not found");
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function waitStable(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  }).catch(() => {});
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(300);
}

async function pixelDiff(aBuf, bBuf) {
  const aMeta = await sharp(aBuf).metadata();
  const bMeta = await sharp(bBuf).metadata();
  const w = Math.min(aMeta.width, bMeta.width);
  const h = Math.min(aMeta.height, bMeta.height);
  const a = await sharp(aBuf).extract({ left: 0, top: 0, width: w, height: h }).ensureAlpha().raw().toBuffer();
  const b = await sharp(bBuf).extract({ left: 0, top: 0, width: w, height: h }).ensureAlpha().raw().toBuffer();
  const out = Buffer.alloc(w * h * 4);
  let diff = 0;
  const total = w * h;
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const dr = Math.abs(a[o] - b[o]);
    const dg = Math.abs(a[o + 1] - b[o + 1]);
    const db = Math.abs(a[o + 2] - b[o + 2]);
    const changed = dr + dg + db > 60;
    if (changed) {
      diff++;
      out[o] = 255;
      out[o + 1] = 40;
      out[o + 2] = 40;
      out[o + 3] = 255;
    } else {
      out[o] = Math.round((a[o] + b[o]) / 2);
      out[o + 1] = Math.round((a[o + 1] + b[o + 1]) / 2);
      out[o + 2] = Math.round((a[o + 2] + b[o + 2]) / 2);
      out[o + 3] = 255;
    }
  }
  const png = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  return {
    pct: total ? (diff / total) * 100 : 100,
    png,
    widthMismatch: aMeta.width !== bMeta.width || aMeta.height !== bMeta.height,
    aSize: { w: aMeta.width, h: aMeta.height },
    bSize: { w: bMeta.width, h: bMeta.height },
  };
}

async function probeLive(browser) {
  const page = await browser.newPage();
  try {
    const res = await page.goto(LIVE_BASE + "/", {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });
    const status = res?.status() || 0;
    const body = await page.content();
    const blocked =
      status === 403 ||
      /sgcaptcha|cf-browser-verification|Just a moment|Attention Required/i.test(body);
    await page.close();
    return { accessible: !blocked && status >= 200 && status < 400, status, blocked };
  } catch (e) {
    await page.close().catch(() => {});
    return { accessible: false, status: 0, blocked: true, error: String(e.message || e) };
  }
}

async function capturePage(page, url, outPath, viewportWidth) {
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await waitStable(page);
  await page.addStyleTag({
    content: `html,body{overflow-x:hidden!important;max-width:100vw!important;} .ohio-sticky-nav,.clb-popup,.cursor,.page-loader{display:none!important;}`,
  }).catch(() => {});
  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      title: document.title,
      h1: h1 ? h1.innerText.replace(/\s+/g, " ").trim() : "",
      height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      width: document.documentElement.clientWidth,
    };
  });
  const clipH = Math.min(Math.max(metrics.height, 1), 20000);
  await page.screenshot({
    path: outPath,
    clip: { x: 0, y: 0, width: viewportWidth, height: clipH },
  });
  return { status: res?.status() || 0, ...metrics };
}

async function main() {
  ensureDirs();
  const pages = {};
  for (const r of ROUTES) {
    const html = buildRefHtml(r);
    if (!html) {
      console.warn("Missing ref HTML for", r.slug);
      continue;
    }
    pages[r.route] = html;
    pages[r.route.replace(/\/$/, "")] = html;
    if (r.route === "/") pages["/"] = html;
  }

  const { server, port } = await startRefServer(pages);
  const REF_BASE = `http://127.0.0.1:${port}`;
  console.log("Ref server", REF_BASE);
  console.log("Viewports", ACTIVE_VIEWPORTS.map((v) => v.name).join(", "));

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const live = await probeLive(browser);
  console.log("Live Alchemy:", live);

  const report = {
    generatedAt: new Date().toISOString(),
    liveReference: live,
    referenceFallback: "scraped _ref/pages HTML + _ref/css (Cloudflare-safe)",
    viewports: ACTIVE_VIEWPORTS.map((v) => v.name),
    routes: [],
  };

  for (const r of ROUTES) {
    console.log("\n===", r.route);
    const routeReport = {
      route: r.route,
      slug: r.slug,
      pageType: r.pageType,
      referenceStatus: pages[r.route] ? "scraped-html-ok" : "missing",
      localStatus: "unknown",
      desktopStatus: "pending",
      tabletStatus: "pending",
      mobileStatus: "pending",
      interactionStatus: "not-fully-tested",
      assetStatus: "partial",
      knownDifferences: [],
      finalVerificationStatus: "incomplete",
      viewports: {},
    };

    for (const vp of ACTIVE_VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const refPath = path.join(REF_DIR, r.slug, `${vp.name}.png`);
      const localPath = path.join(LOCAL_DIR, r.slug, `${vp.name}.png`);
      const diffPath = path.join(DIFF_DIR, r.slug, `${vp.name}.png`);

      let refMeta = null;
      let localMeta = null;
      let diffPct = null;

      try {
        if (pages[r.route]) {
          refMeta = await capturePage(page, REF_BASE + r.route, refPath, vp.width);
        } else {
          routeReport.knownDifferences.push(`Missing reference HTML: ${r.refFile}`);
        }
      } catch (e) {
        routeReport.knownDifferences.push(`Ref capture ${vp.name}: ${e.message}`);
      }

      try {
        localMeta = await capturePage(page, LOCAL_BASE + r.route, localPath, vp.width);
        if (localMeta.status >= 200 && localMeta.status < 400) routeReport.localStatus = "ok";
        else routeReport.localStatus = `http-${localMeta.status}`;
      } catch (e) {
        routeReport.localStatus = "error";
        routeReport.knownDifferences.push(`Local capture ${vp.name}: ${e.message}`);
      }

      if (fs.existsSync(refPath) && fs.existsSync(localPath)) {
        try {
          const d = await pixelDiff(fs.readFileSync(refPath), fs.readFileSync(localPath));
          fs.writeFileSync(diffPath, d.png);
          diffPct = Number(d.pct.toFixed(2));
          if (d.widthMismatch) {
            routeReport.knownDifferences.push(
              `${vp.name}: size mismatch ref ${d.aSize.w}x${d.aSize.h} vs local ${d.bSize.w}x${d.bSize.h}`
            );
          }
          if (diffPct > 12) {
            routeReport.knownDifferences.push(`${vp.name}: high visual diff ${diffPct}%`);
          }
        } catch (e) {
          routeReport.knownDifferences.push(`Diff ${vp.name}: ${e.message}`);
        }
      }

      if (refMeta?.h1 && localMeta?.h1 && refMeta.h1 !== localMeta.h1) {
        // book-intro and branded renames may differ intentionally
        if (!/alchemy|eMarketing/i.test(refMeta.h1 + localMeta.h1) || refMeta.h1.length > 8) {
          if (normalize(refMeta.h1) !== normalize(localMeta.h1)) {
            routeReport.knownDifferences.push(
              `${vp.name}: H1 mismatch ref="${refMeta.h1}" local="${localMeta.h1}"`
            );
          }
        }
      }

      routeReport.viewports[vp.name] = {
        diffPct,
        refH1: refMeta?.h1 || null,
        localH1: localMeta?.h1 || null,
        refHeight: refMeta?.height || null,
        localHeight: localMeta?.height || null,
      };
      await context.close();
      console.log(
        `  ${vp.name}: diff=${diffPct ?? "n/a"}% h=${localMeta?.height ?? "?"} vs ref ${refMeta?.height ?? "?"}`
      );
    }

    const d1440 = routeReport.viewports["1440"]?.diffPct;
    const d768 = routeReport.viewports["768"]?.diffPct;
    const d390 = routeReport.viewports["390"]?.diffPct;
    routeReport.desktopStatus = statusFromDiff(d1440);
    routeReport.tabletStatus = statusFromDiff(d768);
    routeReport.mobileStatus = statusFromDiff(d390);

    if (r.cssNote) {
      routeReport.knownDifferences.push(`Reference CSS: ${r.cssNote}`);
    }
    if (r.pageType === "case" || r.pageType === "promo" || r.pageType === "book-intro") {
      routeReport.knownDifferences.push(
        "Template fidelity: still incomplete vs full Elementor reference (missing page CSS + sections)"
      );
    }
    if (r.pageType === "capabilities" && r.slug !== "search-engine-marketing") {
      routeReport.knownDifferences.push(
        "Capability pages share ExpertisePage shell; verify section order against Elementor per route"
      );
    }

    const hardFails = routeReport.knownDifferences.filter((x) =>
      /high visual diff|H1 mismatch|Missing reference|Template fidelity/i.test(x)
    );
    routeReport.finalVerificationStatus =
      hardFails.length === 0 &&
      routeReport.desktopStatus === "close" &&
      routeReport.tabletStatus !== "fail" &&
      routeReport.mobileStatus !== "fail"
        ? "pass-with-caveats"
        : hardFails.length > 2 || routeReport.desktopStatus === "fail"
          ? "fail"
          : "needs-work";

    report.routes.push(routeReport);
  }

  await browser.close();
  server.close();

  fs.writeFileSync(path.join(AUDIT, "master-report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(AUDIT, "master-report.md"), toMarkdown(report));
  console.log("\nWrote scripts/_audit/master-report.md");
  console.log("Wrote scripts/_audit/master-report.json");
}

function normalize(s) {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function statusFromDiff(pct) {
  if (pct == null) return "unknown";
  if (pct < 8) return "close";
  if (pct < 18) return "needs-work";
  return "fail";
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Master visual audit report");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Live reference access");
  lines.push("");
  lines.push(`- Accessible: **${report.liveReference.accessible}**`);
  lines.push(`- Status: ${report.liveReference.status}`);
  lines.push(`- Blocked: ${report.liveReference.blocked}`);
  lines.push(`- Fallback: ${report.referenceFallback}`);
  lines.push("");
  lines.push(`Viewports audited: ${report.viewports.join(", ")}`);
  lines.push("");
  lines.push("| Route | Type | Desktop | Tablet | Mobile | Final | Top issues |");
  lines.push("|-------|------|---------|--------|--------|-------|------------|");
  for (const r of report.routes) {
    const issues = r.knownDifferences.slice(0, 2).join("; ").replace(/\|/g, "/") || "—";
    lines.push(
      `| ${r.route} | ${r.pageType} | ${r.desktopStatus} | ${r.tabletStatus} | ${r.mobileStatus} | ${r.finalVerificationStatus} | ${issues} |`
    );
  }
  lines.push("");
  lines.push("## Per-route notes");
  lines.push("");
  for (const r of report.routes) {
    lines.push(`### ${r.route}`);
    lines.push("");
    lines.push(`- Page type: ${r.pageType}`);
    lines.push(`- Reference: ${r.referenceStatus}`);
    lines.push(`- Local: ${r.localStatus}`);
    lines.push(`- Final: **${r.finalVerificationStatus}**`);
    const vp = r.viewports["1440"];
    if (vp) {
      lines.push(
        `- 1440 diff: ${vp.diffPct}% | heights local ${vp.localHeight} / ref ${vp.refHeight}`
      );
      lines.push(`- H1 local: ${vp.localH1 || "(none)"}`);
      lines.push(`- H1 ref: ${vp.refH1 || "(none)"}`);
    }
    if (r.knownDifferences.length) {
      lines.push("- Known differences:");
      for (const d of r.knownDifferences) lines.push(`  - ${d}`);
    }
    lines.push("");
  }
  lines.push("## Commands");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run audit:site          # full 8 viewports × 14 routes");
  lines.push("npm run audit:site:quick    # 1440 + 768 + 390 only");
  lines.push("```");
  lines.push("");
  lines.push(
    "Diff images: `scripts/_audit/diff/<slug>/<viewport>.png` (red = pixel mismatch). Page height alone is not used as a pass criteria."
  );
  return lines.join("\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
