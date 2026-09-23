"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Runs only inside the admin editor's live-preview iframe (?cmsEdit=1).
// Lets clicking any labeled element in the preview jump straight to its
// field in the edit form on the left, instead of hunting for it by hand.
export default function CmsInspector() {
  const searchParams = useSearchParams();
  const active = searchParams.get("cmsEdit") === "1";

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined" || window.self === window.top) return;

    const style = document.createElement("style");
    style.textContent = `
      [data-cms-key] { cursor: pointer; }
      [data-cms-key]:hover { outline: 2px dashed #d90a2c; outline-offset: 2px; }
      [data-cms-key].cms-inspect-active { outline: 2px solid #d90a2c; outline-offset: 2px; }
    `;
    document.head.appendChild(style);

    function onClick(e) {
      const target = e.target.closest("[data-cms-key]");
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      document
        .querySelectorAll(".cms-inspect-active")
        .forEach((n) => n.classList.remove("cms-inspect-active"));
      target.classList.add("cms-inspect-active");

      const raw = target.getAttribute("data-cms-key");
      if (!raw) return;
      const sep = raw.indexOf("::");
      const section = sep === -1 ? null : raw.slice(0, sep);
      const key = sep === -1 ? raw : raw.slice(sep + 2);
      window.parent.postMessage(
        { type: "cms-inspect-select", section, key },
        window.location.origin
      );
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      style.remove();
    };
  }, [active]);

  return null;
}
