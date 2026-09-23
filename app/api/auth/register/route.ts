import { NextResponse } from "next/server";
import { registerLocalAccount } from "@/lib/auth/local-accounts";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    nombre?: unknown;
    email?: unknown;
    password?: unknown;
    rol?: unknown;
  } | null;

  let result;
  try {
    result = await registerLocalAccount({
      nombre: body?.nombre,
      email: body?.email,
      password: body?.password,
      rol: body?.rol,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la cuenta. Inténtalo de nuevo." },
      { status: 500 },
    );
  }

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  await setSession(result.user);
  const next = result.user.rol === "comerciante" ? "/dashboard/merchant" : "/";

  return NextResponse.json({
    ok: true,
    user: result.user,
    next,
  });
}
