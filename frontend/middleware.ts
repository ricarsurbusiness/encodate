import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication (cookie: auth-status)
const PROTECTED_ROUTES = ["/dashboard", "/my-bookings"];

// Routes that authenticated users should NOT see
const AUTH_ROUTES = ["/login", "/register"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has("auth-status");

  // Authenticated user trying to access login/register → redirect to home
  if (hasAuthCookie && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Unauthenticated user trying to access protected route → redirect to login
  if (!hasAuthCookie && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-bookings", "/login", "/register"],
};
