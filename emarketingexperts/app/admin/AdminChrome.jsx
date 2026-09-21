"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminChrome({ children }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/admin/login");

  if (isLogin) {
    return children;
  }

  return (
    <div className="cms-shell">
      <header className="cms-top">
        <div className="cms-top-inner">
          <Link href="/admin" className="cms-brand">
            Website Editor
          </Link>
          <nav className="cms-top-nav">
            <Link href="/" target="_blank" rel="noreferrer">
              View site
            </Link>
            <button
              type="button"
              className="cms-link-btn"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <div className="cms-body">{children}</div>
    </div>
  );
}
