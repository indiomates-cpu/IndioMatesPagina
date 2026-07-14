import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { serializarProducto } from '@/lib/serialize';
import { parsearBodyProducto } from '@/lib/producto-input';

// GET /api/admin/productos -> todos los productos (activos e inactivos).
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const productos = await prisma.producto.findMany({
    include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
    orderBy: { creadoEn: 'desc' },
  });

  return NextResponse.json(productos.map(serializarProducto));
}

// POST /api/admin/productos -> crea un producto (con imágenes opcionales).
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const parsed = await parsearBodyProducto(body);
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { imagenes, ...datos } = parsed.data;

  try {
    const producto = await prisma.producto.create({
      data: {
        ...datos,
        imagenes: {
          create: imagenes.map((img, i) => ({
            url: img.url,
            orden: img.orden ?? i,
          })),
        },
      },
      include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
    });
    return NextResponse.json(serializarProducto(producto), { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug' },
        { status: 409 }
      );
    }
    console.error('Error creando producto:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
