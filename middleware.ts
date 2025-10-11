import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (path.startsWith("/calculator")) {
    const user = req.cookies.get("userEmail")?.value
    const allowed = process.env.ALLOWED_USERS?.split(",") || []

    if (!user || !allowed.includes(user)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

// Apply to calculator page only
export const config = {
  matcher: ["/calculator/:path*"],
}
