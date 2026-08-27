export default function BrandLogo({ size = "nav" }) {
  const mark = size === "footer" ? 40 : 34;
  const text = size === "footer" ? 20 : 17;
  return (
    <span className="inline-flex items-center gap-2.5">
      <img
        src="/assets/xpertppc-icon.png"
        alt=""
        width={mark}
        height={mark}
        className="shrink-0 rounded-full object-cover"
        style={{ width: mark, height: mark }}
      />
      <span
        className="logo-word font-extrabold tracking-tight leading-none"
        style={{ fontFamily: "var(--font-heading)", fontSize: text }}
      >
        <span style={{ color: "#1D74F2" }}>XPERT</span>
        <span style={{ color: "var(--v2-ink)" }}>PPC</span>
      </span>
    </span>
  );
}
