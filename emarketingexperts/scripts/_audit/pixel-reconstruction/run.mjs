#!/usr/bin/env node
/**
 * Pixel-reconstruction pipeline: capture local routes, compare to reference
 * screenshots when available, extract DOM/computed metrics, write reports.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const OUT = path.join(ROOT, "scripts/_audit/pixel-reconstruction");
const LOCAL = "http://127.0.0.1:3002";

const VIEWPORTS = [
  { name: "d-1920", w: 1920, h: 1080 },
  { name: "d-1440", w: 1440, h: 900 },
  { name: "d-1366", w: 1366, h: 768 },
  { name: "d-1280", w: 1280, h: 800 },
  { name: "t-1024", w: 1024, h: 1366 },
  { name: "t-768", w: 768, h: 1024 },
  { name: "m-430", w: 430, h: 932 },
  { name: "m-390", w: 390, h: 844 },
  { name: "m-375", w: 375, h: 812 },
];

const ROUTES = [
  { route: "/", slug: "home" },
  { route: "/home-services/", slug: "home-services" },
  { route: "/medical/", slug: "medical" },
  { route: "/hospitality/", slug: "hospitality" },
  { route: "/legal/", slug: "legal" },
  { route: "/search-engine-marketing/", slug: "sem" },
  { route: "/brand-awareness/", slug: "brand-awareness" },
  { route: "/seo/", slug: "seo" },
  { route: "/brand-films/", slug: "brand-films" },
  { route: "/marketing-agency-in-orange-county/", slug: "promo" },
  { route: "/500000-attendees-to-the-fair-in-10-weekends/", slug: "fair" },
  { route: "/luxury-yacht-ppc-case-study/", slug: "yacht" },
  { route: "/plumbers-google-ads/", slug: "plumb" },
  { route: "/book-intro/", slug: "book-intro" },
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function diffPng(refPath, localPath, outDiff, outOverlay) {
  if (!fs.existsSync(refPath) || !fs.existsSync(localPath)) return null;
  const refMeta = await sharp(refPath).metadata();
  const locMeta = await sharp(localPath).metadata();
  const w = Math.min(refMeta.width, locMeta.width);
  const h = Math.min(refMeta.height, locMeta.height);
  const ref = PNG.sync.read(
    await sharp(refPath).resize(w, h, { fit: "fill" }).png().toBuffer()
  );
  const loc = PNG.sync.read(
    await sharp(localPath).resize(w, h, { fit: "fill" }).png().toBuffer()
  );
  const diff = new PNG({ width: w, height: h });
  const mismatch = pixelmatch(ref.data, loc.data, diff.data, w, h, {
    threshold: 0.12,
    includeAA: true,
  });
  fs.writeFileSync(outDiff, PNG.sync.write(diff));
  const overlay = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const hot =
      Math.abs(ref.data[o] - loc.data[o]) +
        Math.abs(ref.data[o + 1] - loc.data[o + 1]) +
        Math.abs(ref.data[o + 2] - loc.data[o + 2]) >
      40;
    if (hot) {
      overlay[o] = 255;
      overlay[o + 1] = 40;
      overlay[o + 2] = 40;
      overlay[o + 3] = 255;
    } else {
      overlay[o] = Math.round((ref.data[o] + loc.data[o]) / 2);
      overlay[o + 1] = Math.round((ref.data[o + 1] + loc.data[o + 1]) / 2);
      overlay[o + 2] = Math.round((ref.data[o + 2] + loc.data[o + 2]) / 2);
      overlay[o + 3] = 255;
    }
  }
  await sharp(overlay, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(outOverlay);
  return {
    mismatch,
    total: w * h,
    pct: +((mismatch / (w * h)) * 100).toFixed(2),
    w,
    h,
  };
}

async function extractMetrics(page) {
  return page.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        class: (el.className || "").toString().slice(0, 120),
        section: el.getAttribute("data-section"),
        text: (el.innerText || "").slice(0, 80).replace(/\s+/g, " "),
        box: {
          x: +r.x.toFixed(1),
          y: +(r.top + window.scrollY).toFixed(1),
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
        },
        style: {
          fontFamily: s.fontFamily.split(",")[0].replace(/"/g, ""),
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          color: s.color,
          background: s.backgroundColor,
          padding: s.padding,
          margin: s.margin,
          display: s.display,
          position: s.position,
          maxWidth: s.maxWidth,
          width: s.width,
          gap: s.gap,
          opacity: s.opacity,
        },
      };
    };
    const sectionNodes = [
      ...document.querySelectorAll(
        "header.site-header, main > section, main > div.band-photo-wrap, main > .exp-wave, main > .exp-band, main > .promo-band, footer.footer, .site-footer"
      ),
    ];
    const sections = sectionNodes.map((el, i) => {
      const p = pick(el);
      p.index = i;
      p.section =
        el.getAttribute("data-section") ||
        el.className?.toString?.().split(/\s+/).slice(0, 3).join(".") ||
        el.tagName;
      return p;
    });
    const headers = [
      ...document.querySelectorAll("h1, h2, h3.exp-title-md, .exp-title, .cap-top h2, .hero-copy h1"),
    ]
      .slice(0, 16)
      .map(pick);
    const imgs = [...document.querySelectorAll("img")].slice(0, 40).map((img) => ({
      src: (img.currentSrc || img.src || "").replace(location.origin, ""),
      natW: img.naturalWidth,
      natH: img.naturalHeight,
      box: (() => {
        const r = img.getBoundingClientRect();
        return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
      })(),
      objectFit: getComputedStyle(img).objectFit,
    }));
    const iframes = [...document.querySelectorAll("iframe")].map((f) => ({
      src: f.src,
      box: (() => {
        const r = f.getBoundingClientRect();
        return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
      })(),
    }));
    const max = getComputedStyle(document.documentElement).getPropertyValue("--max").trim();
    const side = getComputedStyle(document.documentElement).getPropertyValue("--side").trim();
    return {
      url: location.pathname,
      scrollHeight: document.documentElement.scrollHeight,
      max,
      side,
      sections,
      headers,
      imgs,
      iframes,
      title: document.title,
    };
  });
}

function findRefShot(slug, vpName, kind = "hero") {
  const cands = [
    path.join(ROOT, `scripts/_audit/full-site/reference/${slug}/${vpName}.png`),
    path.join(ROOT, `scripts/_audit/compare/ref__${vpName}__${kind === "full" ? "full" : "hero"}.png`),
    path.join(ROOT, `scripts/_audit/compare/ref__${vpName}__full.png`),
    path.join(ROOT, `scripts/_audit/${slug}__orig.png`),
    path.join(ROOT, `scripts/_audit/truth/${slug}.png`),
    path.join(ROOT, `scripts/_audit/staging-live/${slug}__viewport.png`),
    path.join(ROOT, `scripts/_audit/full-site/reference/home/hero-truth.png`),
  ];
  if (slug === "home-services") {
    cands.unshift(
      path.join(ROOT, "scripts/_audit/compare/ref__d-1440__hero.png"),
      path.join(ROOT, "scripts/_audit/truth/home-services.png")
    );
  }
  if (slug === "home") {
    cands.unshift(path.join(ROOT, "scripts/_audit/truth/home-hero.png"));
  }
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}

async function main() {
  const only = process.argv.includes("--quick")
    ? ROUTES.filter((r) =>
        ["home", "home-services", "promo", "book-intro", "fair"].includes(r.slug)
      )
    : ROUTES;
  const vps = process.argv.includes("--quick")
    ? VIEWPORTS.filter((v) => ["d-1440", "m-390"].includes(v.name))
    : VIEWPORTS;
  const fullPage = process.argv.includes("--full");

  ensureDir(OUT);
  const report = { generatedAt: new Date().toISOString(), routes: [] };

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  for (const { route, slug } of only) {
    const routeDir = path.join(OUT, slug);
    ensureDir(routeDir);
    const routeReport = { route, slug, viewports: [], metrics: null };
    console.log("\n==", route);

    for (const vp of vps) {
      const page = await browser.newPage({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
      });
      const localPng = path.join(routeDir, `${vp.name}-local.png`);
      const localFull = path.join(routeDir, `${vp.name}-local-full.png`);
      try {
        await page.goto(LOCAL + route, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.waitForTimeout(700);
        await page.evaluate(() => {
          document.querySelectorAll(".exp-anim").forEach((n) => n.classList.add("in"));
          document
            .querySelectorAll('[style*="opacity: 0"], .elementor-invisible')
            .forEach((n) => {
              n.style.opacity = "1";
              n.style.transform = "none";
            });
        });
        await page.screenshot({ path: localPng, fullPage: false });
        if (fullPage || vp.name === "d-1440") {
          await page.screenshot({ path: localFull, fullPage: true });
        }
        if (vp.name === "d-1440") {
          routeReport.metrics = await extractMetrics(page);
          fs.writeFileSync(
            path.join(routeDir, "metrics.json"),
            JSON.stringify(routeReport.metrics, null, 2)
          );
        }
        const refPng = findRefShot(slug, vp.name, "hero");
        let diffInfo = null;
        if (refPng) {
          const diffP = path.join(routeDir, `${vp.name}-diff.png`);
          const ovP = path.join(routeDir, `${vp.name}-overlay.png`);
          // copy ref next to local for manual inspection
          fs.copyFileSync(refPng, path.join(routeDir, `${vp.name}-ref.png`));
          diffInfo = await diffPng(refPng, localPng, diffP, ovP);
        }
        routeReport.viewports.push({
          viewport: vp.name,
          local: localPng,
          ref: refPng,
          diff: diffInfo,
          scrollHeight: await page.evaluate(
            () => document.documentElement.scrollHeight
          ),
          yt: await page.locator('iframe[src*="youtube"]').count(),
        });
        console.log(
          " ",
          vp.name,
          "h=" + routeReport.viewports.at(-1).scrollHeight,
          "yt=" + routeReport.viewports.at(-1).yt,
          diffInfo ? `diff=${diffInfo.pct}%` : "no-ref",
          "sections=" + (routeReport.metrics?.sections?.length ?? "-")
        );
      } catch (e) {
        routeReport.viewports.push({
          viewport: vp.name,
          error: String(e).slice(0, 200),
        });
        console.log(" ", vp.name, "ERR", String(e).slice(0, 100));
      }
      await page.close();
    }
    report.routes.push(routeReport);
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "REPORT.json"), JSON.stringify(report, null, 2));
  let md = `# Pixel reconstruction report\n\nGenerated ${report.generatedAt}\n\n`;
  for (const r of report.routes) {
    const vp1440 = r.viewports.find((v) => v.viewport === "d-1440");
    md += `## ${r.route}\n`;
    md += `- scrollHeight@1440: ${vp1440?.scrollHeight ?? r.metrics?.scrollHeight ?? "?"}\n`;
    md += `- --max: ${r.metrics?.max ?? "?"}\n`;
    md += `- sections: ${(r.metrics?.sections || []).map((s) => s.section).join(" → ")}\n`;
    md += `- yt: ${vp1440?.yt ?? "?"}\n`;
    for (const v of r.viewports) {
      if (v.diff) md += `- ${v.viewport} pixelDiff: **${v.diff.pct}%**\n`;
      if (v.error) md += `- ${v.viewport} ERROR: ${v.error}\n`;
    }
    md += "\n";
  }
  fs.writeFileSync(path.join(OUT, "REPORT.md"), md);
  console.log("\nWrote", path.join(OUT, "REPORT.json"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
