import { prisma } from '@/lib/prisma';
import { CategoriaManager } from '@/components/admin/CategoriaManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    include: { _count: { select: { productos: true } } },
  });

  const inicial = categorias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    orden: c.orden,
    cantidadProductos: c._count.productos,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Categorías</h1>
        <p className="text-sm text-tinta/60">
          Organizá el catálogo. El orden define su posición en el menú.
        </p>
      </div>

      <CategoriaManager inicial={inicial} />
    </div>
  );
}
