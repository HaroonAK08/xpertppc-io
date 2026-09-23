import PageShell from "@/components/PageShell";
import { getPageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const SLUG = "privacy";

export async function generateMetadata() {
  const data = await getPageContent(SLUG);
  return { title: `${data?.title || "Privacy & Cookie Policy"} | eMarketing Experts` };
}

export default async function Page() {
  const data = await getPageContent(SLUG);
  return (
    <PageShell
      eyebrow={data?.eyebrow}
      title={data?.title}
      lead={data?.lead}
      cta={false}
      cmsPrefix="privacy"
    >
      <div className="stat-card">
        <p data-cms-key="privacy::body">{data?.body}</p>
      </div>
    </PageShell>
  );
}
