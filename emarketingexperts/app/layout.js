import "./globals.css";

export const metadata = {
  title: "eMarketing Experts — Drive revenue with paid ads",
  description:
    "Performance marketing agency specializing in paid search, paid social, SEO, and video marketing. Book an intro.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
