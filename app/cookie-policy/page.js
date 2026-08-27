import LegalPage from "@/components/LegalPage";
import { legalPages } from "@/lib/legal";

const data = legalPages["cookie-policy"];

export const metadata = { title: `${data.title} — XpertPPC` };

export default function Page() {
  return <LegalPage title={data.title} lede={data.lede} prose={data.prose} />;
}
