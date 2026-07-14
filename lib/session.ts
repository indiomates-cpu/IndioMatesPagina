import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE_ADMIN, verificarToken, type AdminTokenPayload } from './auth';

// Lee la sesión del admin desde la cookie (para usar en Server Components y
// Route Handlers). Devuelve null si no hay sesión válida.
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_ADMIN)?.value;
  return verificarToken(token);
}

// Helper para Route Handlers protegidos: devuelve la sesión o una respuesta 401.
export async function requireAdmin(): Promise<
  { session: AdminTokenPayload; error: null } | { session: null; error: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    };
  }
  return { session, error: null };
}
