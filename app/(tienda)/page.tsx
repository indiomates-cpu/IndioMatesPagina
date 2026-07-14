import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { ProductCard } from '@/components/producto/ProductCard';
import { obtenerDestacados, obtenerCategoriasConConteo } from '@/lib/queries';

export default async function HomePage() {
  const [destacados, categorias] = await Promise.all([
    obtenerDestacados(8),
    obtenerCategoriasConConteo(),
  ]);

  return (
    <>
      <Hero />

      {/* Productos destacados */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Destacados
            </h2>
            <p className="mt-1 text-sm text-tinta/60">
              Lo más nuevo de nuestra selección.
            </p>
          </div>
          <Link
            href="/productos"
            className="enlace-subrayado hidden text-sm font-medium transition-colors hover:text-tinta/70 sm:inline"
          >
            Ver todo
          </Link>
        </div>

        {destacados.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {destacados.map((p, i) => (
              <ProductCard key={p.id} producto={p} indice={i} />
            ))}
          </div>
        )}
      </section>

      {/* Categorías */}
      <section
        id="categorias"
        className="border-t border-tinta/10 bg-papel-hueso"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 font-display text-2xl font-bold sm:text-3xl">
            Explorá por categoría
          </h2>

          {categorias.length === 0 ? (
            <p className="text-sm text-tinta/60">
              Todavía no hay categorías cargadas.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categorias.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/productos?categoria=${c.slug}`}
                  className="group flex animate-entrada flex-col justify-between rounded-2xl border border-tinta/10 bg-papel p-5 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-tinta hover:shadow-flotante active:translate-y-0 active:scale-[0.98] active:shadow-none"
                  style={{ animationDelay: `${(i % 5) * 60}ms` }}
                >
                  <span className="font-display text-lg font-semibold leading-tight">
                    {c.nombre}
                  </span>
                  <span className="mt-6 flex items-center justify-between text-xs text-tinta/50">
                    {c.cantidadProductos}{' '}
                    {c.cantidadProductos === 1 ? 'producto' : 'productos'}
                    <span
                      aria-hidden
                      className="translate-x-0 opacity-0 transition-all duration-300 ease-premium group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-tinta/20 p-12 text-center">
      <p className="text-tinta/60">
        Todavía no hay productos cargados. Ejecutá el seed o cargá productos
        desde el{' '}
        <Link href="/admin" className="underline underline-offset-4">
          panel de administración
        </Link>
        .
      </p>
    </div>
  );
}
