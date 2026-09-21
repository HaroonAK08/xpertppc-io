import "./admin.css";
import AdminChrome from "./AdminChrome";

export const metadata = {
  title: "Website Editor | eMarketing Experts",
};

export default function AdminLayout({ children }) {
  return <AdminChrome>{children}</AdminChrome>;
}
