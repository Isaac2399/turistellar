import { createHash, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  return createHash("sha256").update(`turistellar:${password}`).digest("hex");
}

export function hashesMatch(stored: string, incoming: string): boolean {
  const left = Buffer.from(stored);
  const right = Buffer.from(incoming);
  return left.length === right.length && timingSafeEqual(left, right);
}
