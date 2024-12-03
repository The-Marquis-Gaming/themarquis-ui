import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const isAuthenticated = req.cookies.get("accessToken") !== undefined;

  const restrictedRoutes = [
    "/signup",
    "/login",
    "/signup/verification",
    "/login/verification",
  ];

  const protectedRoutes = [
    "/profile",
    "/login/welcome",
    "/signup/welcome",
    "/deposit",
    "/withdrawal",
    // "/invitation-twitter",
  ];

  if (
    isAuthenticated &&
    restrictedRoutes.some((route) => url.pathname === route)
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => url.pathname.startsWith(route))
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/signup/:path*",
    "/login/:path*",
    "/deposit/:path*",
    "/withdrawal/:path*",
    // "/invitation-twitter",
  ],
};
