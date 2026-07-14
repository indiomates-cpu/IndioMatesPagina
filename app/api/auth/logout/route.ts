import { NextResponse } from 'next/server';
import { COOKIE_ADMIN } from '@/lib/auth';

// POST /api/auth/logout -> borra la cookie del admin.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return res;
}
