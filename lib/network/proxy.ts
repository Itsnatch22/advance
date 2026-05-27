import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const LOCALES = ['en-ke', 'en-tz', 'en-ug', 'en-rw'] as const;
export type Locale = typeof LOCALES[number];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const segments = pathname.split('/')
    const locale = segments[1] as Locale
    segments.splice(1, 1)
    let newPathname = segments.join('/')
    if (!newPathname) newPathname = '/'
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', locale)

    const response = NextResponse.rewrite(new URL(`${newPathname}${search}`, request.url), {
      request: {
        headers: requestHeaders,
      }
    })
    response.cookies.set('NEXT_LOCALE', locale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    return response
  }
  const country = (request.headers.get('x-vercel-ip-country') || 'KE').toUpperCase()
  let defaultLocale = 'en-ke'
  if (country === 'TZ') defaultLocale = 'en-tz'
  if (country === 'UG') defaultLocale = 'en-ug'
  if (country === 'RW') defaultLocale = 'en-rw'
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  const targetLocale = LOCALES.includes(cookieLocale as Locale) ? cookieLocale : defaultLocale

  return NextResponse.redirect(new URL(`/${targetLocale}${pathname}${search}`, request.url))
}
