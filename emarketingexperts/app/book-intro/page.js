import BookIntroClient from "./BookIntroClient";
import { getPageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Intro | eMarketing Experts",
  description: "Book a meeting with eMarketing Experts.",
};

export default async function BookIntroPage() {
  const data = await getPageContent("book-intro");
  const site = await getPageContent("site");
  return <BookIntroClient data={data} site={site} />;
}
