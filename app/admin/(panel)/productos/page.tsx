import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { serializarProducto } from '@/lib/serialize';
import { ProductosTabla } from '@/components/admin/ProductosTabla';

export const dynamic = 'force-dynamic';

export default async function AdminProductosPage() {
  const productos = await prisma.producto.findMany({
    include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
    orderBy: { creadoEn: 'desc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Productos</h1>
          <p className="text-sm text-tinta/60">
            {productos.length} en total. Editá stock y estado directamente en la tabla.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="elevable rounded-lg bg-tinta px-4 py-2.5 text-sm font-medium text-papel hover:bg-tinta-suave"
        >
          + Nuevo producto
        </Link>
      </div>

      <ProductosTabla inicial={productos.map(serializarProducto)} />
    </div>
  );
}
