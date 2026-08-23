import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const isDashboard = request.nextUrl.pathname.startsWith("/admin/dashboard");

  // If trying to access dashboard routes and not logged in, redirect to login
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If trying to access login page and already logged in, redirect to dashboard
  if (request.nextUrl.pathname === "/admin" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
