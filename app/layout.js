import "./tailwind.css";
import "./v2.css";
import "./extra.css";
import { PT_Serif, Instrument_Serif, Montserrat, Plus_Jakarta_Sans, Caveat } from "next/font/google";

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-heading",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
});

export const metadata = {
  title: "XpertPPC — High-Performance PPC Ads for Growing Brands",
  description:
    "XpertPPC runs Google, Meta, TikTok, Amazon, LinkedIn and Microsoft Ads with clear reporting, free audits, and campaigns built for ROAS.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${ptSerif.variable} ${instrument.variable} ${montserrat.variable} ${jakarta.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
