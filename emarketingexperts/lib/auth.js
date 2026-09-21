const SESSION_COOKIE = "eme_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export { SESSION_COOKIE };

function secret() {
  return (
    process.env.CMS_ADMIN_SECRET ||
    process.env.CMS_ADMIN_PASSWORD ||
    "dev-only-secret"
  );
}

function adminPassword() {
  return process.env.CMS_ADMIN_PASSWORD || "changeme";
}

function toBase64Url(bytes) {
  let str = "";
  const arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  for (let i = 0; i < arr.length; i += 1) str += String.fromCharCode(arr[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(value) {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return toBase64Url(sig);
}

function safeEqual(a, b) {
  const aa = String(a);
  const bb = String(b);
  if (aa.length !== bb.length) return false;
  let out = 0;
  for (let i = 0; i < aa.length; i += 1) out |= aa.charCodeAt(i) ^ bb.charCodeAt(i);
  return out === 0;
}

export function verifyPassword(password) {
  return safeEqual(password || "", adminPassword());
}

export async function createSessionToken() {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = toBase64Url(
    new TextEncoder().encode(JSON.stringify({ exp, v: 1 }))
  );
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await sign(payload);
  if (!safeEqual(sig, expected)) return false;
  try {
    const json = new TextDecoder().decode(fromBase64Url(payload));
    const data = JSON.parse(json);
    return Boolean(data?.exp && data.exp > Date.now());
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}
