import { createHmac, timingSafeEqual } from "crypto";
import { AUTH_COOKIE, type AuthSession } from "./types";

export { AUTH_COOKIE, type AuthSession } from "./types";

const SESSION_SECRET = process.env.AUTH_SECRET ?? "turistellar-demo-secret-dev-only";

function hmac(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function signSession(session: AuthSession): string {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): AuthSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = hmac(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthSession;
    if (!parsed?.id || !parsed.email || !parsed.rol) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function safeNextPath(next: unknown, fallback = "/"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}
