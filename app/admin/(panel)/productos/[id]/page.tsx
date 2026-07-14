import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { serializarProducto } from '@/lib/serialize';
import { obtenerCategorias } from '@/lib/queries';
import { ProductoForm } from '@/components/admin/ProductoForm';

export const dynamic = 'force-dynamic';

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productoRaw, categorias] = await Promise.all([
    prisma.producto.findUnique({
      where: { id },
      include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
    }),
    obtenerCategorias(),
  ]);

  if (!productoRaw) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link
          href="/admin/productos"
          className="group inline-flex items-center gap-1 text-sm text-tinta/50 transition-colors duration-300 hover:text-tinta"
        >
          <span className="transition-transform duration-300 ease-premium group-hover:-translate-x-0.5">←</span>
          Volver a productos
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold">Editar producto</h1>
      </div>

      <ProductoForm
        categorias={categorias}
        producto={serializarProducto(productoRaw)}
      />
    </div>
  );
}
