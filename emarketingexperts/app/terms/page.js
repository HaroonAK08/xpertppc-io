import PageShell from "@/components/PageShell";

export const metadata = { title: "Terms of Service | eMarketing Experts" };

export default function Page() {
  return (
    <PageShell eyebrow="Legal" title="Terms of Service" lead="Terms for using this website." cta={false}>
      <div className="stat-card">
        <p>
          Content on this site is for general information. Case study metrics describe
          historical client results and are not guarantees of future performance.
          Engagement terms are defined in a separate client agreement.
        </p>
      </div>
    </PageShell>
  );
}
