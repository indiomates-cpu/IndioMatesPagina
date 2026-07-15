import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { serializarProducto } from '@/lib/serialize';
import {
  parsearBodyProducto,
  contarDestacados,
  MAX_DESTACADOS,
} from '@/lib/producto-input';

type Ctx = { params: Promise<{ id: string }> };

// GET /api/admin/productos/[id]
export async function GET(_request: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
  });

  if (!producto) {
    return NextResponse.json(
      { error: 'Producto no encontrado' },
      { status: 404 }
    );
  }
  return NextResponse.json(serializarProducto(producto));
}

// PUT /api/admin/productos/[id] -> actualiza todos los campos y reemplaza
// el set de imágenes por el recibido (maneja alta/baja/reordenamiento).
export async function PUT(request: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = await parsearBodyProducto(body, { productoIdActual: id });
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { imagenes, ...datos } = parsed.data;

  try {
    const producto = await prisma.$transaction(async (tx) => {
      await tx.imagenProducto.deleteMany({ where: { productoId: id } });
      return tx.producto.update({
        where: { id },
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
    });
    return NextResponse.json(serializarProducto(producto));
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug' },
        { status: 409 }
      );
    }
    if (code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    console.error('Error actualizando producto:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// PATCH /api/admin/productos/[id] -> actualización parcial (baja lógica,
// destacado y edición rápida de stock desde el listado).
// Body: { activo?, destacado?, stock? }
export async function PATCH(request: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const data: { activo?: boolean; destacado?: boolean; stock?: number } = {};
  if (typeof body.activo === 'boolean') data.activo = body.activo;
  if (typeof body.destacado === 'boolean') {
    if (body.destacado) {
      const cantidad = await contarDestacados(id);
      if (cantidad >= MAX_DESTACADOS) {
        return NextResponse.json(
          {
            error: `Ya hay ${MAX_DESTACADOS} productos destacados. Quitá uno antes de agregar otro.`,
          },
          { status: 409 }
        );
      }
    }
    data.destacado = body.destacado;
  }
  if (body.stock !== undefined) {
    const stock = Math.trunc(Number(body.stock));
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        { error: 'Stock inválido' },
        { status: 400 }
      );
    }
    data.stock = stock;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: 'Nada para actualizar' },
      { status: 400 }
    );
  }

  try {
    const producto = await prisma.producto.update({
      where: { id },
      data,
      include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
    });
    return NextResponse.json(serializarProducto(producto));
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    console.error('Error en PATCH producto:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE /api/admin/productos/[id] -> borra el producto (y sus imágenes por
// cascade). La baja lógica se hace con PATCH { activo: false }.
export async function DELETE(_request: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.producto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    console.error('Error eliminando producto:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
