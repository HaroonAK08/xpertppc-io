import PageShell from "@/components/PageShell";

export const metadata = { title: "Privacy & Cookie Policy | eMarketing Experts" };

export default function Page() {
  return (
    <PageShell eyebrow="Legal" title="Privacy & Cookie Policy" lead="How we handle information on this site." cta={false}>
      <div className="stat-card">
        <p>
          We collect information you submit through forms (name, email, phone, company)
          to respond to inquiries. We may use analytics cookies to understand site
          usage. Contact hello@emarketingexperts.com for privacy requests.
        </p>
      </div>
    </PageShell>
  );
}
