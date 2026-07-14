import type { Metadata } from 'next';
import { ProductGrid } from '@/components/catalogo/ProductGrid';
import { CategoryFilter } from '@/components/catalogo/CategoryFilter';
import { obtenerCategorias, obtenerProductos } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Productos',
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [categorias, productos] = await Promise.all([
    obtenerCategorias(),
    obtenerProductos({ categoriaSlug: categoria }),
  ]);

  const categoriaActiva = categorias.find((c) => c.slug === categoria);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {categoriaActiva ? categoriaActiva.nombre : 'Todos los productos'}
        </h1>
        <p className="mt-1 text-sm text-tinta/60">
          {productos.length}{' '}
          {productos.length === 1 ? 'producto disponible' : 'productos disponibles'}
        </p>
      </header>

      <div className="mb-8">
        <CategoryFilter categorias={categorias} activa={categoria} />
      </div>

      {productos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-tinta/20 p-12 text-center text-tinta/60">
          No hay productos en esta categoría por el momento.
        </div>
      ) : (
        // `key` fuerza a reiniciar el revelado ("Ver más") al cambiar de
        // categoría, para que cada vista arranque colapsada.
        <ProductGrid key={categoria ?? 'todos'} productos={productos} />
      )}
    </div>
  );
}
