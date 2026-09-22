import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth/session-codec";

function isCommercePath(pathname: string): boolean {
  return pathname.startsWith("/dashboard/merchant") || pathname.startsWith("/dashboard/comerciante");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isCommercePath(pathname)) {
    return NextResponse.next();
  }

  const session = verifySessionToken(request.cookies.get(AUTH_COOKIE)?.value);
  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.rol !== "comerciante") {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = "/acceso-denegado";
    deniedUrl.search = "";
    return NextResponse.redirect(deniedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/merchant",
    "/dashboard/merchant/:path*",
    "/dashboard/comerciante",
    "/dashboard/comerciante/:path*",
  ],
};
