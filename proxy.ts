// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/server/session";

export const config = {
  matcher: [
    "/employee-dashboard/:path*",
    "/employer-dashboard/:path*",
    "/login",
    "/register",
  ],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Verify session
  const session = await verifySession();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!session && !isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session) {
    const { role } = session;

    if (isAuthPage) {
      const url = req.nextUrl.clone();
      url.pathname =
        role === "employer" ? "/employer-dashboard" : "/employee-dashboard";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/employer-dashboard") && role !== "employer") {
      const url = req.nextUrl.clone();
      url.pathname = "/employee-dashboard";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/employee-dashboard") && role !== "employee") {
      const url = req.nextUrl.clone();
      url.pathname = "/employer-dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
