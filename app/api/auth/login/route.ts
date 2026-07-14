import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { COOKIE_ADMIN, crearToken } from '@/lib/auth';

// POST /api/auth/login  -> valida credenciales y setea la cookie del admin.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const usuario = typeof body.usuario === 'string' ? body.usuario.trim() : '';
    const contrasena =
      typeof body.contrasena === 'string' ? body.contrasena : '';

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { usuario } });
    // Comparar siempre aunque no exista el admin evita filtrar por timing.
    const hashComparar =
      admin?.contrasenaHash ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinva';
    const valido = await bcrypt.compare(contrasena, hashComparar);

    if (!admin || !valido) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const token = await crearToken({ sub: admin.id, usuario: admin.usuario });

    const res = NextResponse.json({ ok: true, usuario: admin.usuario });
    res.cookies.set(COOKIE_ADMIN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });
    return res;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
