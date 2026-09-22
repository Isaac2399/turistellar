import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution (Shadcn-compatible). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncatePublicKey(publicKey: string, chars = 4): string {
  if (publicKey.length <= chars * 2) return publicKey;
  return `${publicKey.slice(0, chars)}…${publicKey.slice(-chars)}`;
}
