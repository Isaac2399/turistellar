import { NextResponse } from "next/server";
import { authenticateDemoUser } from "@/lib/auth/demo-users";
import { setSession } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/session-codec";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    next?: string;
  } | null;

  const email = body?.email ?? "";
  const password = body?.password ?? "";
  const user = authenticateDemoUser(email, password);

  if (!user) {
    return NextResponse.json({ ok: false, error: "Correo o contraseña incorrectos." }, { status: 401 });
  }

  await setSession(user);

  const requestedNext = safeNextPath(body?.next, user.rol === "comerciante" ? "/dashboard/merchant" : "/");
  const isCommercePath =
    requestedNext.startsWith("/dashboard/merchant") || requestedNext.startsWith("/dashboard/comerciante");
  const next =
    isCommercePath && user.rol !== "comerciante"
      ? "/"
      : requestedNext;

  return NextResponse.json({
    ok: true,
    user,
    next,
  });
}
