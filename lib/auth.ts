import { SignJWT, jwtVerify } from 'jose';

// Nombre de la cookie donde se guarda el token del admin.
export const COOKIE_ADMIN = 'indio_admin_token';

// Duración del token (7 días).
const DURACION = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    // En desarrollo avisamos, pero seguimos con un fallback para no romper.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET no está configurado o es demasiado corto.');
    }
    return new TextEncoder().encode('dev-secret-inseguro-solo-local-0123456789');
  }
  return new TextEncoder().encode(secret);
}

export interface AdminTokenPayload {
  sub: string; // id del admin
  usuario: string;
}

// Crea un JWT firmado para un administrador.
export async function crearToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ usuario: payload.usuario })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(DURACION)
    .sign(getSecret());
}

// Verifica un JWT y devuelve el payload, o null si es inválido/expirado.
export async function verificarToken(
  token: string | undefined | null
): Promise<AdminTokenPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.usuario !== 'string') return null;
    return { sub: payload.sub, usuario: payload.usuario };
  } catch {
    return null;
  }
}
