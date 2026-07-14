import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { slugify } from '@/lib/utils';

// GET /api/admin/categorias -> lista de categorías con conteo de productos.
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const categorias = await prisma.categoria.findMany({
    orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    include: { _count: { select: { productos: true } } },
  });

  return NextResponse.json(
    categorias.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      slug: c.slug,
      orden: c.orden,
      cantidadProductos: c._count.productos,
    }))
  );
}

// POST /api/admin/categorias -> crea una categoría.
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

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
    const categoria = await prisma.categoria.create({
      data: { nombre, slug, orden },
    });
    return NextResponse.json(categoria, { status: 201 });
  } catch (e: unknown) {
    if (esErrorUnico(e)) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 409 }
      );
    }
    console.error('Error creando categoría:', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

function esErrorUnico(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    (e as { code?: string }).code === 'P2002'
  );
}
