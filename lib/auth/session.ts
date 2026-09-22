import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  safeNextPath,
  signSession,
  verifySessionToken,
} from "./session-codec";
import type { AuthSession } from "./types";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(AUTH_COOKIE)?.value);
}

export async function setSession(session: AuthSession): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE, signSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export async function requireComerciante(nextPath = "/dashboard/merchant"): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(safeNextPath(nextPath, "/dashboard/merchant"))}`);
  }
  if (session.rol !== "comerciante") {
    redirect("/acceso-denegado");
  }
  return session;
}
