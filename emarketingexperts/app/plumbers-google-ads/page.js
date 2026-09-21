import InnerPage from "@/components/InnerPage";
import { getPageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const SLUG = "plumbers-google-ads";

export async function generateMetadata() {
  const data = await getPageContent(SLUG);
  return {
    title: `${(data?.title || "Case Study").split(".")[0]} | eMarketing Experts`,
    description: data?.lead || data?.title || "",
  };
}

export default async function Page() {
  const data = await getPageContent(SLUG);
  return <InnerPage data={data} />;
}
