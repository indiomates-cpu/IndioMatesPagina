import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_ADMIN, verificarToken } from '@/lib/auth';

// Protege el panel de administración y su API. Usa `jose` (compatible con el
// runtime edge del middleware) para verificar el JWT de la cookie.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_ADMIN)?.value;
  const session = await verificarToken(token);

  // API del panel: responde 401 si no hay sesión.
  if (pathname.startsWith('/api/admin')) {
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Página de login: si ya está logueado, va directo al dashboard.
  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Resto del panel: exige sesión.
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
