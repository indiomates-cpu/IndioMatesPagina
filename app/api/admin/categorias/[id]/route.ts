import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { slugify } from '@/lib/utils';

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/admin/categorias/[id] -> actualiza una categoría.
export async function PUT(request: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const orden = Number.isFinite(body.orden) ? Number(body.orden) : 0;
  const slug =
    typeof body.slug === 'string' && body.slug.trim()
      ? slugify(body.slug)
      : slugify(nombre);

  if (!nombre) {
    return NextResponse.json(
      { error: 'El nombre es obligatorio' },
      { status: 400 }
    );
  }
  if (!slug) {
    return NextResponse.json(
      { error: 'No se pudo generar un slug válido. Ingresá uno manualmente.' },
      { status: 400 }
    );
  }

  try {
    const categoria = await prisma.categoria.update({
      where: { id },
      data: { nombre, slug, orden },
    });
    return NextResponse.json(categoria);
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 409 }
      );
    }
    if (code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }
    console.error('Error actualizando categoría:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE /api/admin/categorias/[id] -> elimina si no tiene productos.
export async function DELETE(_request: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const cantidad = await prisma.producto.count({ where: { categoriaId: id } });
  if (cantidad > 0) {
    return NextResponse.json(
      {
        error: `No se puede eliminar: la categoría tiene ${cantidad} producto(s). Reasignalos o eliminalos primero.`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.categoria.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }
    // P2003: violación de FK (se agregó un producto a esta categoría en paralelo).
    if (code === 'P2003') {
      return NextResponse.json(
        {
          error:
            'No se puede eliminar: la categoría tiene productos asociados.',
        },
        { status: 409 }
      );
    }
    console.error('Error eliminando categoría:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
