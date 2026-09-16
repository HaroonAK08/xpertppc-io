import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Prefer sharp if present; else pure PNG via playwright canvas-less pixel diff with pngjs-less approach using raw buffers from playwright

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "scripts/_audit");
const REF_DIR = path.join(OUT, "reference");
const LOCAL_DIR = path.join(OUT, "local");
const DIFF_DIR = path.join(OUT, "diff");
for (const d of [REF_DIR, LOCAL_DIR, DIFF_DIR]) fs.mkdirSync(d, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };

const SECTIONS = [
  {
    id: "01-header",
    local: "header.site-header",
    ref: "header, .header, .site-header, #masthead",
  },
  { id: "02-hero", local: '[data-section="hero"]', ref: ".elementor-element-6b76ed3" },
  {
    id: "03-capabilities",
    local: '[data-section="capabilities"]',
    ref: ".elementor-element-7353728e",
  },
  { id: "04-wave", local: '[data-section="wave"]', ref: ".elementor-element-e5677ff" },
  {
    id: "05-approach",
    local: '[data-section="approach"]',
    ref: ".elementor-element-5f8aec29",
  },
  {
    id: "06-statistics",
    local: '[data-section="statistics"]',
    ref: ".elementor-element-13714e54",
  },
  {
    id: "07-how-we-help",
    local: '[data-section="how-we-help"]',
    ref: ".elementor-element-5fd70dc7",
  },
  {
    id: "08-finale",
    local: '[data-section="finale"]',
    ref: ".elementor-element-7d6e3b69",
  },
  { id: "09-cta", local: '[data-section="cta"]', ref: ".elementor-element-18e72af" },
  { id: "10-footer", local: "footer.footer", ref: "footer, .site-footer" },
];

function buildReferenceHtml() {
  let html = fs.readFileSync(
    path.join(ROOT, "_ref/pages/home-services-full.html"),
    "utf8"
  );
  html = html.replace(/<link[^>]+rel=['"]stylesheet['"][^>]*>/gi, "");
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const inject = `
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/_ref/css/elementor-polyfill.css">
<link rel="stylesheet" href="/_ref/css/style.css">
<link rel="stylesheet" href="/_ref/css/post-278.css">
<link rel="stylesheet" href="/_ref/css/post-235.css">
<style>
  .elementor-invisible { visibility: visible !important; opacity: 1 !important; transform: none !important; animation: none !important; }
  html, body { margin: 0; background: #fff; }
  .page-container, .content-area { overflow: visible; }
  /* Apply declared --width on desktop */
  @media (min-width: 768px) {
    .elementor-element-7b2e69ce { width: 60%; }
    .elementor-element-791dfa87 { width: 40%; }
    .elementor-element-7d7964f8 { width: 58%; }
    .elementor-element-2b4bf91a { width: 42%; }
    .elementor-element-5e7d733d { width: 50%; }
    .elementor-element-74cd6a94 { width: 50%; }
  }
</style>`;
  html = html.replace("</head>", inject + "</head>");
  const remaps = [
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/1\.png/g, "/images/1.png"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/background\.png/g, "/images/background.png"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2020\/03\/oh__img92\.jpg/g, "/images/oh__img92.jpg"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2020\/03\/oh__img102-min\.jpg/g, "/images/yt-2bB-n8siBPE.jpg"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/google-ads-certified[^"'\s]*/g, "/images/google-ads-certified.jpg"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/microsoft-advertiser-partner[^"'\s]*/g, "/images/microsoft-advertiser-partner.png"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/meta-partner\.png\.webp/g, "/images/meta-partner.png.webp"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/Partner-AC-logo\.png/g, "/images/Partner-AC-logo.png"],
    [/https:\/\/alchemypaidmedia\.com\/wp-content\/uploads\/2025\/04\/Screenshot-2025-04-01-at-11\.26\.10[^"'\s]*/g, "/images/call-log-hires.jpg"],
  ];
  for (const [re, to] of remaps) html = html.replace(re, to);
  return html;
}

function contentType(p) {
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".html")) return "text/html";
  return "application/octet-stream";
}

function startRefServer(html) {
  const pagePath = path.join(DIFF_DIR, "reference-home-services.html");
  fs.writeFileSync(pagePath, html);
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/" || url.startsWith("/home-services")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(pagePath));
      return;
    }
    for (const fp of [
      path.join(ROOT, url.replace(/^\//, "")),
      path.join(ROOT, "public", url.replace(/^\//, "")),
    ]) {
      if (fp.startsWith(ROOT) && fs.existsSync(fp) && fs.statSync(fp).isFile()) {
        res.writeHead(200, { "Content-Type": contentType(fp) });
        res.end(fs.readFileSync(fp));
        return;
      }
    }
    res.writeHead(404);
    res.end("missing");
  });
  return new Promise((r) => server.listen(3010, "127.0.0.1", () => r(server)));
}

async function prep(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    document.querySelectorAll(".exp-anim").forEach((n) => n.classList.add("in"));
  });
  await page.waitForTimeout(400);
}

async function shotElement(page, selector, outPath) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return { ok: false, reason: "missing " + selector };
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(200);
  const box = await el.boundingBox();
  if (!box) return { ok: false, reason: "no box" };
  const height = Math.max(1, Math.min(box.height || 0, 4000));
  const width = Math.max(1, Math.min(box.width || VIEWPORT.width, VIEWPORT.width));
  if ((box.height || 0) < 8) {
    // empty/min-height-only nodes: capture a viewport band at element top
    const y = Math.max(0, box.y);
    await page.screenshot({
      path: outPath,
      clip: {
        x: 0,
        y,
        width: VIEWPORT.width,
        height: Math.min(VIEWPORT.height, 700),
      },
    });
    return { ok: true, box: { ...box, height: Math.min(VIEWPORT.height, 700), approx: true } };
  }
  await page.screenshot({
    path: outPath,
    clip: {
      x: Math.max(0, box.x),
      y: Math.max(0, box.y),
      width,
      height,
    },
  });
  return { ok: true, box };
}

async function overlayDiff(localPath, refPath, outPath) {
  // Use Playwright page to composite via canvas in browser
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2000 } });
  const localB64 = fs.readFileSync(localPath).toString("base64");
  const refB64 = fs.readFileSync(refPath).toString("base64");
  const result = await page.evaluate(
    async ({ localB64, refB64 }) => {
      function load(b64) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = "data:image/png;base64," + b64;
        });
      }
      const a = await load(localB64);
      const b = await load(refB64);
      const w = Math.max(a.width, b.width);
      const h = Math.max(a.height, b.height);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.drawImage(b, 0, 0);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(a, 0, 0);

      // also compute rough diff score on overlapping region
      const c2 = document.createElement("canvas");
      const ow = Math.min(a.width, b.width);
      const oh = Math.min(a.height, b.height);
      c2.width = ow;
      c2.height = oh;
      const x = c2.getContext("2d");
      x.drawImage(a, 0, 0);
      const da = x.getImageData(0, 0, ow, oh).data;
      x.clearRect(0, 0, ow, oh);
      x.drawImage(b, 0, 0);
      const db = x.getImageData(0, 0, ow, oh).data;
      let diff = 0;
      const total = ow * oh;
      for (let i = 0; i < da.length; i += 4) {
        const dr = Math.abs(da[i] - db[i]);
        const dg = Math.abs(da[i + 1] - db[i + 1]);
        const dbv = Math.abs(da[i + 2] - db[i + 2]);
        if (dr + dg + dbv > 60) diff++;
      }
      return {
        overlay: c.toDataURL("image/png"),
        diffPct: Math.round((diff / total) * 10000) / 100,
        local: { w: a.width, h: a.height },
        ref: { w: b.width, h: b.height },
      };
    },
    { localB64, refB64 }
  );
  const data = result.overlay.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(outPath, Buffer.from(data, "base64"));
  await browser.close();
  return result;
}

async function captureSide(browser, label, url, dir, selKey) {
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await prep(page);
  await page.screenshot({
    path: path.join(dir, `${label}__full.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(dir, `${label}__hero-vp.png`),
    fullPage: false,
  });

  const metrics = {};
  for (const sec of SECTIONS) {
    const selector = sec[selKey];
    if (!selector) continue;
    const out = path.join(dir, `${label}__${sec.id}.png`);
    const r = await shotElement(page, selector, out);
    metrics[sec.id] = r;
    console.log(
      label,
      sec.id,
      r.ok ? `ok ${Math.round(r.box?.height || 0)}px` : r.reason
    );
  }
  fs.writeFileSync(
    path.join(dir, `${label}__metrics.json`),
    JSON.stringify(metrics, null, 2)
  );
  await page.close();
  return metrics;
}

async function main() {
  const html = buildReferenceHtml();
  const server = await startRefServer(html);
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  console.log("capturing reference (scraped+css)…");
  await captureSide(
    browser,
    "ref",
    "http://127.0.0.1:3010/home-services/",
    REF_DIR,
    "ref"
  );
  console.log("capturing local…");
  await captureSide(
    browser,
    "local",
    "http://127.0.0.1:3002/home-services",
    LOCAL_DIR,
    "local"
  );

  const diffs = [];
  for (const sec of SECTIONS) {
    const localP = path.join(LOCAL_DIR, `local__${sec.id}.png`);
    const refP = path.join(REF_DIR, `ref__${sec.id}.png`);
    if (!fs.existsSync(localP) || !fs.existsSync(refP)) {
      diffs.push({ id: sec.id, status: "missing-shot" });
      continue;
    }
    try {
      const out = path.join(DIFF_DIR, `overlay__${sec.id}.png`);
      // inline overlay using one browser page for speed
      const page = await browser.newPage();
      const localB64 = fs.readFileSync(localP).toString("base64");
      const refB64 = fs.readFileSync(refP).toString("base64");
      const result = await page.evaluate(
        async ({ localB64, refB64 }) => {
          function load(b64) {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = "data:image/png;base64," + b64;
            });
          }
          const a = await load(localB64);
          const b = await load(refB64);
          const w = Math.max(a.width, b.width);
          const h = Math.max(a.height, b.height);
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, w, h);
          ctx.globalAlpha = 1;
          ctx.drawImage(b, 0, 0);
          ctx.globalAlpha = 0.45;
          ctx.drawImage(a, 0, 0);
          const ow = Math.min(a.width, b.width);
          const oh = Math.min(a.height, b.height);
          const c2 = document.createElement("canvas");
          c2.width = ow;
          c2.height = oh;
          const x = c2.getContext("2d");
          x.drawImage(a, 0, 0);
          const da = x.getImageData(0, 0, ow, oh).data;
          x.clearRect(0, 0, ow, oh);
          x.drawImage(b, 0, 0);
          const db = x.getImageData(0, 0, ow, oh).data;
          let diff = 0;
          const total = ow * oh;
          for (let i = 0; i < da.length; i += 4) {
            if (
              Math.abs(da[i] - db[i]) +
                Math.abs(da[i + 1] - db[i + 1]) +
                Math.abs(da[i + 2] - db[i + 2]) >
              60
            )
              diff++;
          }
          return {
            overlay: c.toDataURL("image/png"),
            diffPct: Math.round((diff / total) * 10000) / 100,
            local: { w: a.width, h: a.height },
            ref: { w: b.width, h: b.height },
          };
        },
        { localB64, refB64 }
      );
      fs.writeFileSync(
        out,
        Buffer.from(
          result.overlay.replace(/^data:image\/png;base64,/, ""),
          "base64"
        )
      );
      diffs.push({ id: sec.id, ...result, overlay: out });
      console.log(
        "diff",
        sec.id,
        result.diffPct + "%",
        `local ${result.local.w}x${result.local.h}`,
        `ref ${result.ref.w}x${result.ref.h}`
      );
      await page.close();
    } catch (e) {
      diffs.push({ id: sec.id, error: String(e).slice(0, 200) });
    }
  }

  fs.writeFileSync(
    path.join(DIFF_DIR, "section-diffs.json"),
    JSON.stringify(diffs, null, 2)
  );

  // Update score table only; keep human checklist in differences.md
  const scoreLines = [
    "",
    "## Auto score snapshot (do not treat as done)",
    "",
    `Generated: ${new Date().toISOString()} @ 1440×900`,
    "",
  ];
  for (const d of diffs) {
    if (d.diffPct != null) {
      scoreLines.push(
        `- **${d.id}** — ${d.diffPct}% — local ${d.local.w}×${d.local.h} vs ref ${d.ref.w}×${d.ref.h}`
      );
    } else {
      scoreLines.push(`- **${d.id}** — ${d.status || d.error || "issue"}`);
    }
  }
  scoreLines.push("");
  const diffMd = path.join(OUT, "compare/differences.md");
  let existing = fs.existsSync(diffMd) ? fs.readFileSync(diffMd, "utf8") : "";
  const marker = "## Auto score snapshot";
  if (existing.includes(marker)) {
    existing = existing.slice(0, existing.indexOf(marker)).trimEnd();
  }
  fs.writeFileSync(diffMd, existing + "\n" + scoreLines.join("\n"));

  await browser.close();
  server.close();
  console.log("wrote overlays + updated score snapshot in differences.md");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
