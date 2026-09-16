import ExpertisePage from "@/components/ExpertisePage";
import { expertise } from "@/data/expertise";

const data = expertise["brand-films"];

export const metadata = {
  title: `${data.title} | eMarketing Experts`,
  description: data.capTitle || data.title,
};

export default function Page() {
  return <ExpertisePage data={data} />;
}
