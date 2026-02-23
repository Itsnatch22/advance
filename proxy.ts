import { NextRequest, NextResponse } from 'next/server';

const RESOURCES_COOKIE = 'resources_access';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isResourcesRoute = pathname.startsWith('/resources');
  const isLoginRoute = pathname === '/resources/login';
  const isAuthApiRoute = pathname === '/api/resources-auth/login';
  const hasAccessCookie = request.cookies.get(RESOURCES_COOKIE)?.value === '1';

  if (!isResourcesRoute) {
    const response = NextResponse.next();
    if (hasAccessCookie) {
      response.cookies.set(RESOURCES_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/resources',
        maxAge: 0,
      });
    }
    return response;
  }

  if (isLoginRoute || isAuthApiRoute) {
    return NextResponse.next();
  }

  if (hasAccessCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/resources/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
