import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EVENTO } from '@/lib/constants';

const TIPOS_VALIDOS = Object.values(EVENTO) as string[];

// POST /api/eventos
// Registra un evento de métrica (público). Body: { tipo, productoId? }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tipo = typeof body.tipo === 'string' ? body.tipo : '';
    // Normalizamos: un string vacío se trata como null para no romper la FK.
    let productoId: string | null =
      typeof body.productoId === 'string' && body.productoId.trim()
        ? body.productoId
        : null;

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de evento inválido' },
        { status: 400 }
      );
    }

    // Si se envía un productoId, validamos que exista para no romper la FK.
    if (productoId) {
      const existe = await prisma.producto.findUnique({
        where: { id: productoId },
        select: { id: true },
      });
      if (!existe) productoId = null;
    }

    await prisma.eventoMetrica.create({ data: { tipo, productoId } });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Error registrando evento:', error);
    return NextResponse.json(
      { error: 'No se pudo registrar el evento' },
      { status: 500 }
    );
  }
}
