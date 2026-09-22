import PageShell from "@/components/PageShell";
import { getPageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const SLUG = "terms";

export async function generateMetadata() {
  const data = await getPageContent(SLUG);
  return { title: `${data?.title || "Terms of Service"} | eMarketing Experts` };
}

export default async function Page() {
  const data = await getPageContent(SLUG);
  return (
    <PageShell eyebrow={data?.eyebrow} title={data?.title} lead={data?.lead} cta={false}>
      <div className="stat-card">
        <p>{data?.body}</p>
      </div>
    </PageShell>
  );
}
