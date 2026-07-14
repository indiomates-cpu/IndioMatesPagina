import Link from 'next/link';
import type { CategoriaDTO } from '@/lib/types';
import { cn } from '@/lib/utils';

// Filtro por categoría. Renderiza píldoras enlazadas a /productos?categoria=slug
// y resalta la categoría activa (recibida como prop desde la página).
export function CategoryFilter({
  categorias,
  activa,
}: {
  categorias: CategoriaDTO[];
  activa?: string;
}) {
  const pill =
    'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium animate-entrada transition-all duration-300 ease-premium active:scale-95';

  return (
    <nav
      aria-label="Categorías"
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
    >
      <Link
        href="/productos"
        className={cn(
          pill,
          !activa
            ? 'border-tinta bg-tinta text-papel shadow-flotante-sm'
            : 'border-tinta/15 text-tinta/70 hover:-translate-y-0.5 hover:border-tinta/40 hover:shadow-flotante-sm'
        )}
      >
        Todos
      </Link>
      {categorias.map((c, i) => {
        const seleccionada = activa === c.slug;
        return (
          <Link
            key={c.id}
            href={`/productos?categoria=${c.slug}`}
            style={{ animationDelay: `${(i + 1) * 40}ms` }}
            className={cn(
              pill,
              seleccionada
                ? 'border-tinta bg-tinta text-papel shadow-flotante-sm'
                : 'border-tinta/15 text-tinta/70 hover:-translate-y-0.5 hover:border-tinta/40 hover:shadow-flotante-sm'
            )}
          >
            {c.nombre}
          </Link>
        );
      })}
    </nav>
  );
}
