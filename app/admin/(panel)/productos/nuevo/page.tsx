import Link from 'next/link';
import { obtenerCategorias } from '@/lib/queries';
import { contarDestacados } from '@/lib/producto-input';
import { ProductoForm } from '@/components/admin/ProductoForm';

export const dynamic = 'force-dynamic';

export default async function NuevoProductoPage() {
  const [categorias, cantidadDestacadosOtros] = await Promise.all([
    obtenerCategorias(),
    contarDestacados(),
  ]);

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
        <h1 className="mt-2 font-display text-2xl font-bold">Nuevo producto</h1>
      </div>

      {categorias.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-sm text-tinta/60">
          Primero creá al menos una categoría en{' '}
          <Link href="/admin/categorias" className="underline underline-offset-4">
            Categorías
          </Link>
          .
        </div>
      ) : (
        <ProductoForm
          categorias={categorias}
          cantidadDestacadosOtros={cantidadDestacadosOtros}
        />
      )}
    </div>
  );
}
