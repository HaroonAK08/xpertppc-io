import ExpertisePage from "@/components/ExpertisePage";
import { getPageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const SLUG = "search-engine-marketing";

export async function generateMetadata() {
  const data = await getPageContent(SLUG);
  return {
    title: `${data?.title || "Expertise"} | eMarketing Experts`,
    description: data?.capTitle || data?.lead || data?.title || "",
  };
}

export default async function Page() {
  const data = await getPageContent(SLUG);
  return <ExpertisePage data={data} />;
}
