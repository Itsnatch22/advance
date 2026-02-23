import { NextResponse } from 'next/server';

const RESOURCES_COOKIE = 'resources_access';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const expectedEmail = process.env.RESOURCES_LOGIN_EMAIL;
  const expectedPassword = process.env.RESOURCES_LOGIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      { error: 'Protected resource credentials are not configured on the server.' },
      { status: 500 }
    );
  }

  const isValid =
    typeof email === 'string' &&
    typeof password === 'string' &&
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    password === expectedPassword;

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(RESOURCES_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/resources',
    maxAge: 60 * 60 * 12,
  });

  return response;
}

