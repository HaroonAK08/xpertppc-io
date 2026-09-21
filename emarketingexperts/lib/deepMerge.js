export function deepMerge(base, overlay) {
  if (overlay == null) return base;
  if (Array.isArray(overlay)) return overlay.slice();
  if (typeof overlay !== "object") return overlay;
  if (base == null || typeof base !== "object" || Array.isArray(base)) {
    return { ...overlay };
  }
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMerge(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
