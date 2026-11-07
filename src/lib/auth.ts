// Uses only Web Crypto so it runs in both middleware and server actions.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getSecret(): string | null {
  return process.env.SESSION_SECRET || null;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = getSecret();
  if (!expected || !secret) return false;
  // Compare HMACs so the comparison is constant-length.
  return safeEqual(await hmac(input, secret), await hmac(expected, secret));
}

/** Token format: "<expiry ms>.<signature>" */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${await hmac(expires, secret)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!token || !secret) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, await hmac(expires, secret));
}
