import { proxy as proxyHandler } from "@/lib/network/proxy";
import { NextRequest, NextResponse } from 'next/server';
import { buildCsp, generateNonce } from "@/lib/security/csp";

const ENFORCE = process.env.CSP_ENFORCE === "true";

export default async function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
 
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set(
    ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
    csp
  );

  return proxyHandler(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
