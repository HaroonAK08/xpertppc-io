import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      { source: "/expertise/home-services", destination: "/home-services", permanent: false },
      { source: "/expertise/healthcare", destination: "/medical", permanent: false },
      { source: "/expertise/hospitality", destination: "/hospitality", permanent: false },
      { source: "/expertise/legal", destination: "/legal", permanent: false },
      { source: "/capabilities/paid-search", destination: "/search-engine-marketing", permanent: false },
      { source: "/capabilities/paid-social", destination: "/brand-awareness", permanent: false },
      { source: "/capabilities/seo", destination: "/seo", permanent: false },
      { source: "/capabilities/video-marketing", destination: "/brand-films", permanent: false },
      { source: "/start-for-free", destination: "/marketing-agency-in-orange-county", permanent: false },
      { source: "/case-studies/fair-meta-ads", destination: "/500000-attendees-to-the-fair-in-10-weekends", permanent: false },
      { source: "/case-studies/luxury-yacht-ppc", destination: "/luxury-yacht-ppc-case-study", permanent: false },
      { source: "/case-studies/plumbing-rebrand", destination: "/plumbers-google-ads", permanent: false },
    ];
  },
};

export default nextConfig;
