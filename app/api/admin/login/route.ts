import { NextResponse } from 'next/server';
import { cookieName, createAdminSession, validAdminPassword } from '../../../lib/admin-auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!process.env.ADMIN_SESSION_SECRET || !validAdminPassword(password)) {
    return NextResponse.json({ error: 'رمز عبور نادرست است یا پنل هنوز پیکربندی نشده است.' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createAdminSession(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
