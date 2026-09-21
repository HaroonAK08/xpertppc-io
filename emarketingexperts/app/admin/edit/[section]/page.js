"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
]);

function isImageKey(key) {
  return (
    IMAGE_KEYS.has(key) ||
    /Image$|image$|poster|Photo|photo|logo|Logo|src$/i.test(key)
  );
}

function Field({ label, value, onChange, multiline, media }) {
  const upload = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    onChange(data.url);
  };

  return (
    <label className="cms-field">
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
        {data.map((item, index) => (
          <div key={`${path}.${index}`} className="cms-array-item">
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
                path={`${path}.${index}`}
                onChange={(v) => {
                  const next = data.slice();
                  next[index] = v;
                  onChange(next);
                }}
              />
            )}
          </div>
        ))}
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
        onChange={(v) => onChange(v)}
      />
    );
  }

  return (
    <div className="cms-fields">
      {Object.entries(data).map(([key, value]) => {
        const label = key;
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
              onChange={(v) => onChange({ ...data, [key]: v })}
            />
          );
        }
        if (typeof value === "boolean") {
          return (
            <label key={key} className="cms-field cms-check">
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
                path={key}
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

export default function EditSectionPage() {
  const { section } = useParams();
  const router = useRouter();
  const [meta, setMeta] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const sectionId = useMemo(
    () => (Array.isArray(section) ? section[0] : section),
    [section]
  );

  useEffect(() => {
    if (!sectionId) return;
    setError("");
    fetch(`/api/admin/content?section=${encodeURIComponent(sectionId)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        setMeta(json.meta);
        setData(json.data);
      })
      .catch((err) => setError(err.message));
  }, [sectionId]);

  const save = async () => {
    setBusy(true);
    setStatus("");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionId, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setStatus("Saved — live site updated.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

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
      setData(body.data);
      setStatus("Reset to defaults.");
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
    <div className="cms-wrap">
      <div className="cms-edit-top">
        <div>
          <Link href="/admin" className="cms-back">
            ← All sections
          </Link>
          <h1>{meta?.label || sectionId}</h1>
          <p className="cms-muted">
            Edit fields below. Upload images or paste URLs. YouTube IDs go in
            video fields.
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
      <ObjectEditor data={data} onChange={setData} />
    </div>
  );
}
