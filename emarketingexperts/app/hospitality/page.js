import ExpertisePage from "@/components/ExpertisePage";
import { expertise } from "@/data/expertise";

const data = expertise["hospitality"];

export const metadata = {
  title: `${data.title} | eMarketing Experts`,
  description: data.capTitle,
};

export default function Page() {
  return <ExpertisePage data={data} />;
}
