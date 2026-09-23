"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

// Which live page to preview for each section. Sections that aren't a
// single page (nav, site settings) preview the homepage, since that's
// where the header/footer/nav are visible.
function previewPathFor(sectionId, kind) {
  if (sectionId === "home") return "/";
  if (sectionId === "book-intro") return "/book-intro";
  if (sectionId === "nav" || sectionId === "site") return "/";
  if (kind === "page") return `/${sectionId}`;
  return "/";
}

const IMAGE_KEYS = new Set([
  "heroImage",
  "coverImage",
  "coverImageFallback",
  "strategyImage",
  "strategyImageFallback",
  "heroImageFallback",
  "blobImage",
  "image",
  "reviewImage",
  "poster",
  "waveImage",
  "phoneImage",
  "partners",
  "clients",
  "helpPartners",
]);

function isImageKey(key) {
  return (
    IMAGE_KEYS.has(key) ||
    /Image$|image$|poster|Photo|photo|logo|Logo|src$/i.test(key)
  );
}

function Field({ label, value, onChange, multiline, media, fieldPath }) {
  const upload = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    onChange(data.url);
  };

  return (
    <label
      className="cms-field"
      id={fieldPath ? `cms-field-${fieldPath}` : undefined}
      data-field-path={fieldPath || undefined}
    >
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {media ? (
        <div className="cms-media-row">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="cms-thumb" />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                await upload(file);
              } catch (err) {
                alert(err.message);
              }
            }}
          />
        </div>
      ) : null}
    </label>
  );
}

function ObjectEditor({ data, onChange, path = "" }) {
  if (data == null) return null;

  if (Array.isArray(data)) {
    return (
      <div className="cms-array">
        {data.map((item, index) => {
          const itemPath = path ? `${path}.${index}` : String(index);
          return (
            <div key={itemPath} className="cms-array-item">
              <div className="cms-array-head">
                <strong>
                  Item {index + 1}
                  {item?.label ? ` — ${item.label}` : ""}
                  {item?.title ? ` — ${item.title}` : ""}
                </strong>
                <button
                  type="button"
                  className="cms-link-btn"
                  onClick={() => onChange(data.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
              {typeof item === "string" ? (
                <Field
                  label="Value"
                  value={item}
                  fieldPath={itemPath}
                  media={isImageKey(path)}
                  onChange={(v) => {
                    const next = data.slice();
                    next[index] = v;
                    onChange(next);
                  }}
                />
              ) : (
                <ObjectEditor
                  data={item}
                  path={itemPath}
                  onChange={(v) => {
                    const next = data.slice();
                    next[index] = v;
                    onChange(next);
                  }}
                />
              )}
            </div>
          );
        })}
        <button
          type="button"
          className="cms-btn cms-btn-ghost"
          onClick={() => {
            const sample =
              typeof data[0] === "string"
                ? ""
                : data[0]
                  ? structuredClone(data[0])
                  : {};
            if (sample && typeof sample === "object") {
              Object.keys(sample).forEach((k) => {
                if (typeof sample[k] === "string") sample[k] = "";
              });
            }
            onChange([...data, sample]);
          }}
        >
          Add item
        </button>
      </div>
    );
  }

  if (typeof data !== "object") {
    return (
      <Field
        label={path || "Value"}
        value={String(data)}
        fieldPath={path}
        onChange={(v) => onChange(v)}
      />
    );
  }

  return (
    <div className="cms-fields">
      {Object.entries(data).map(([key, value]) => {
        const label = key;
        const fieldPath = path ? `${path}.${key}` : key;
        if (typeof value === "string" || typeof value === "number") {
          const str = String(value ?? "");
          const multiline = str.length > 90 || str.includes("\n");
          return (
            <Field
              key={key}
              label={label}
              value={str}
              multiline={multiline}
              media={isImageKey(key)}
              fieldPath={fieldPath}
              onChange={(v) => onChange({ ...data, [key]: v })}
            />
          );
        }
        if (typeof value === "boolean") {
          return (
            <label
              key={key}
              className="cms-field cms-check"
              id={`cms-field-${fieldPath}`}
              data-field-path={fieldPath}
            >
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) =>
                  onChange({ ...data, [key]: e.target.checked })
                }
              />
              <span>{label}</span>
            </label>
          );
        }
        if (value && typeof value === "object") {
          return (
            <details key={key} className="cms-group" open={Array.isArray(value)}>
              <summary>{label}</summary>
              <ObjectEditor
                data={value}
                path={fieldPath}
                onChange={(v) => onChange({ ...data, [key]: v })}
              />
            </details>
          );
        }
        return null;
      })}
    </div>
  );
}

// Opens every <details> ancestor of a field and scrolls/flashes it, so a
// click in the live preview lands exactly on the matching form control.
function focusField(fieldPath) {
  const el = document.getElementById(`cms-field-${fieldPath}`);
  if (!el) return false;
  let p = el.parentElement;
  while (p) {
    if (p.tagName === "DETAILS") p.open = true;
    p = p.parentElement;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("cms-field-flash");
  const input = el.querySelector("input, textarea");
  if (input) input.focus({ preventScroll: true });
  setTimeout(() => el.classList.remove("cms-field-flash"), 1600);
  return true;
}

function EditSectionPage() {
  const { section } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [meta, setMeta] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [previewTick, setPreviewTick] = useState(0);
  const skipNextAutoSave = useRef(true);
  const debounceTimer = useRef(null);
  const urlFocusHandled = useRef(false);

  const sectionId = useMemo(
    () => (Array.isArray(section) ? section[0] : section),
    [section]
  );

  const previewPath = useMemo(
    () => previewPathFor(sectionId, meta?.kind),
    [sectionId, meta]
  );

  useEffect(() => {
    if (!sectionId) return;
    setError("");
    urlFocusHandled.current = false;
    fetch(`/api/admin/content?section=${encodeURIComponent(sectionId)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        // Re-armed right before every load-triggered setData (not just once
        // before the fetch starts) so a duplicate effect invocation — e.g.
        // React StrictMode's dev-mode double-invoke — can't let a second,
        // redundant data-set slip past the guard and fire a phantom autosave.
        skipNextAutoSave.current = true;
        setMeta(json.meta);
        setData(json.data);
      })
      .catch((err) => setError(err.message));
  }, [sectionId]);

  // Jumping here from another section's preview click lands with ?focus=<path>.
  useEffect(() => {
    if (!data || urlFocusHandled.current) return;
    const focusKey = searchParams.get("focus");
    if (!focusKey) return;
    urlFocusHandled.current = true;
    const t = setTimeout(() => focusField(focusKey), 200);
    return () => clearTimeout(t);
  }, [data, searchParams]);

  // Clicking a labeled element inside the live-preview iframe selects (and
  // if needed, navigates to) the matching field in the form on the left.
  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== window.location.origin) return;
      const msg = event.data;
      if (!msg || msg.type !== "cms-inspect-select" || !msg.key) return;
      if (msg.section && msg.section !== sectionId) {
        router.push(`/admin/edit/${msg.section}?focus=${encodeURIComponent(msg.key)}`);
        return;
      }
      focusField(msg.key);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sectionId, router]);

  const persist = async ({ silent } = {}) => {
    if (silent) setAutoSaving(true);
    else setBusy(true);
    if (!silent) setStatus("");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionId, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setStatus(silent ? "Auto-saved — preview updated." : "Saved — live site updated.");
      setPreviewTick((t) => t + 1);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      if (silent) setAutoSaving(false);
      else setBusy(false);
    }
  };

  const save = () => persist({ silent: false });

  // Auto-save + refresh the live preview shortly after each edit, so the
  // right-hand panel reflects changes without needing an explicit click.
  useEffect(() => {
    if (!data) return;
    if (skipNextAutoSave.current) {
      skipNextAutoSave.current = false;
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      persist({ silent: true });
    }, 900);
    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const reset = async () => {
    if (!confirm("Reset this section to default content?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/content?section=${encodeURIComponent(sectionId)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Reset failed");
      const reload = await fetch(
        `/api/admin/content?section=${encodeURIComponent(sectionId)}`
      );
      const body = await reload.json();
      skipNextAutoSave.current = true;
      setData(body.data);
      setStatus("Reset to defaults.");
      setPreviewTick((t) => t + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) {
    return (
      <div className="cms-wrap">
        <div className="cms-error">{error}</div>
        <Link href="/admin">Back</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="cms-wrap">
        <p className="cms-muted">Loading editor…</p>
      </div>
    );
  }

  return (
    <div className="cms-wrap cms-wrap-wide">
      <div className="cms-edit-top">
        <div>
          <Link href="/admin" className="cms-back">
            ← All sections
          </Link>
          <h1>{meta?.label || sectionId}</h1>
          <p className="cms-muted">
            Edit fields below, or click any labeled text/image in the preview
            to jump straight to it. Changes appear in the preview
            automatically a moment after you stop typing.
          </p>
        </div>
        <div className="cms-actions">
          <button
            type="button"
            className="cms-btn cms-btn-ghost"
            onClick={reset}
            disabled={busy}
          >
            Reset
          </button>
          <button
            type="button"
            className="cms-btn"
            onClick={save}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
      {status ? <div className="cms-ok">{status}</div> : null}
      {error ? <div className="cms-error">{error}</div> : null}

      <div className="cms-split">
        <div className="cms-edit-col">
          <ObjectEditor data={data} onChange={setData} />
        </div>
        <div className="cms-preview-col">
          <div className="cms-preview-head">
            <span>Live preview</span>
            {autoSaving ? (
              <span className="cms-preview-status">Saving…</span>
            ) : (
              <span className="cms-preview-status cms-preview-status-muted">
                {previewPath}
              </span>
            )}
          </div>
          <div className="cms-preview-frame">
            <iframe
              key={previewTick}
              src={`${previewPath}${previewPath.includes("?") ? "&" : "?"}cmsEdit=1`}
              title="Live site preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditSectionPageWrapper() {
  return (
    <Suspense fallback={<div className="cms-wrap"><p className="cms-muted">Loading editor…</p></div>}>
      <EditSectionPage />
    </Suspense>
  );
}
