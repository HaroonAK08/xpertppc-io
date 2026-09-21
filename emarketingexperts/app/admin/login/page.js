import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata = { title: "Admin Login | eMarketing Experts" };

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="cms-boot">
          <div className="cms-boot-card">Loading…</div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
