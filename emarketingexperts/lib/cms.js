import { promises as fs } from "fs";
import path from "path";
import { pages as defaultPages, nav as defaultNav } from "@/data/site";
import { expertise } from "@/data/expertise";
import { deepMerge } from "@/lib/deepMerge";

const STORE_PATH = path.join(process.cwd(), "data", "cms-store.json");

export const PAGE_META = [
  { id: "home", label: "Homepage", kind: "home" },
  { id: "book-intro", label: "Book Intro", kind: "book" },
  { id: "nav", label: "Navigation Menu", kind: "nav" },
  {
    id: "marketing-agency-in-orange-county",
    label: "Start for Free (Promo)",
    kind: "page",
  },
  {
    id: "500000-attendees-to-the-fair-in-10-weekends",
    label: "Fair Case Study",
    kind: "page",
  },
  {
    id: "luxury-yacht-ppc-case-study",
    label: "Yacht Case Study",
    kind: "page",
  },
  { id: "plumbers-google-ads", label: "Plumbers Case Study", kind: "page" },
  { id: "home-services", label: "Home Services", kind: "page" },
  { id: "medical", label: "Healthcare", kind: "page" },
  { id: "hospitality", label: "Hospitality", kind: "page" },
  { id: "legal", label: "Legal", kind: "page" },
  { id: "search-engine-marketing", label: "Paid Search", kind: "page" },
  { id: "brand-awareness", label: "Paid Social", kind: "page" },
  { id: "seo", label: "SEO", kind: "page" },
  { id: "brand-films", label: "Video Marketing", kind: "page" },
  { id: "site", label: "Site Settings & Footer", kind: "site" },
  { id: "privacy", label: "Privacy Policy", kind: "page" },
  { id: "terms", label: "Terms of Service", kind: "page" },
];

function defaultHome() {
  return {
    eyebrow: "The #1 performance marketing agency in OC.",
    titleLine1: "Drive revenue",
    titleLine2: "to your business with paid ads.",
    caseStudyLabel: "Luxury Yacht PPC Case Study",
    caseStudyHref: "/luxury-yacht-ppc-case-study",
    blobImage: "/images/oh__demo1__1.png",
    bandImage: "/images/oh__img92.jpg",
    alchemyTerm: "al·che·my",
    alchemyPhonetic: "/ˈalkəmē/",
    alchemyBody:
      "a seemingly magical process of transformation, creation, or combination.",
    servicesKicker: "Services",
    servicesTitle:
      "We're a team of digital alchemists who are excited about turning paid media into revenue.",
  };
}

function defaultBook() {
  return {
    eyebrow: "Be brave, say hello.",
    title: "Book A Meeting",
    phone: "949.322.0387",
    lead: "The first step to exceeding your marketing goals is booking this meeting. We'll talk about your existing pain points and assess how our strategy can help you generate revenue. (Also, things like scope, pricing, you know the drill.)",
    heroImage: "/images/oh__img120.jpg",
    formHeading: "Tell us about your business.",
    stats: [
      { num: "100+", label: "happy clients", tone: "red" },
      { num: "125+", label: "million in generated revenue", tone: "dark" },
    ],
    testimonials: [
      {
        id: "i-JZ8CATjfc",
        poster: "/images/state-fair-entertainment.jpg",
        label: "State Fair Entertainment",
      },
      {
        id: "7j7ZqKJznik",
        poster: "/images/kempt-image.jpeg",
        label: "KEMPT Testimonial",
      },
      {
        id: "puGJjihZdz0",
        poster: "/images/hs-run-meeting.jpg",
        label: "Disruptive Drinkware Testimonial",
      },
    ],
  };
}

function defaultSite() {
  return {
    brandName: "emarketing experts performance marketing agency",
    phone: "949.322.0387",
    email: "hello@emarketingexperts.com",
    footerInstaUrl: "https://www.instagram.com/",
    footerCity: "Newport Beach",
    footerAddress:
      "eMarketing Experts\nNewport Beach,\nCalifornia\nUnited States",
    footerBookBlurb: "Interested in working with us?",
    footerCopyrightName: "eMarketing Experts",
    footerCopyrightSuffix: "Made with passion.",
    footerPrivacyLabel: "Privacy & Cookie Policy",
    footerTermsLabel: "Terms of Service",
  };
}

export function getDefaults() {
  const pages = structuredClone(defaultPages);
  for (const [slug, data] of Object.entries(expertise)) {
    pages[slug] = structuredClone(data);
  }
  return {
    version: 1,
    home: defaultHome(),
    bookIntro: defaultBook(),
    site: defaultSite(),
    nav: structuredClone(defaultNav),
    pages,
  };
}

async function readStoreFile() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function getContent() {
  const defaults = getDefaults();
  const stored = await readStoreFile();
  return deepMerge(defaults, stored);
}

export async function getPageContent(slug) {
  const content = await getContent();
  if (slug === "home") return content.home;
  if (slug === "book-intro") return content.bookIntro;
  if (slug === "site") return content.site;
  if (slug === "nav") return content.nav;
  return content.pages?.[slug] || null;
}

export async function saveContentSection(sectionId, sectionData) {
  const stored = await readStoreFile();
  const next = { ...stored, updatedAt: new Date().toISOString() };

  if (sectionId === "home") next.home = sectionData;
  else if (sectionId === "book-intro") next.bookIntro = sectionData;
  else if (sectionId === "site") next.site = sectionData;
  else if (sectionId === "nav") next.nav = sectionData;
  else {
    next.pages = { ...(stored.pages || {}), [sectionId]: sectionData };
  }

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
  return getContent();
}

export async function resetContentSection(sectionId) {
  const stored = await readStoreFile();
  const next = { ...stored, updatedAt: new Date().toISOString() };
  if (sectionId === "home") delete next.home;
  else if (sectionId === "book-intro") delete next.bookIntro;
  else if (sectionId === "site") delete next.site;
  else if (sectionId === "nav") delete next.nav;
  else if (next.pages) {
    delete next.pages[sectionId];
    if (!Object.keys(next.pages).length) delete next.pages;
  }
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
  return getContent();
}
