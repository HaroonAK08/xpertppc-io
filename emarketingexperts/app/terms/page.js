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
  const sections = data?.sections || [];

  return (
    <PageShell
      eyebrow={data?.eyebrow}
      title={data?.title}
      lead={data?.lead}
      cta={false}
      cmsPrefix={SLUG}
    >
      {data?.effectiveDate ? (
        <p className="legal-effective-date" data-cms-key={`${SLUG}::effectiveDate`}>
          Effective date: {data.effectiveDate}
        </p>
      ) : null}
      {data?.intro ? (
        <div className="stat-card legal-intro">
          <p data-cms-key={`${SLUG}::intro`}>{data.intro}</p>
        </div>
      ) : null}
      <div className="legal-sections">
        {sections.map((section, i) => (
          <div key={i} className="stat-card">
            <h3 data-cms-key={`${SLUG}::sections.${i}.heading`}>{section.heading}</h3>
            <p data-cms-key={`${SLUG}::sections.${i}.body`}>
              {String(section.body || "")
                .split("\n")
                .map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 ? <br /> : null}
                  </span>
                ))}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
