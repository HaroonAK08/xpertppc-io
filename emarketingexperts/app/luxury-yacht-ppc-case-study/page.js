import InnerPage from "@/components/InnerPage";
import { pages } from "@/data/site";

const data = pages["luxury-yacht-ppc-case-study"];

export const metadata = {
  title: `${data.title.split(".")[0]} | eMarketing Experts`,
  description: data.lead || data.title,
};

export default function Page() {
  return <InnerPage data={data} />;
}
