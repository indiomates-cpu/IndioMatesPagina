'use client';

import { useState } from 'react';
import type { ProductoDTO } from '@/lib/types';
import { ProductCard } from '@/components/producto/ProductCard';
import { PRODUCTOS_POR_PAGINA } from '@/lib/constants';

// Grilla de productos con revelado progresivo: muestra un máximo inicial y,
// si hay más, un botón "Ver más" que despliega el resto (ya están
// descargados de antemano, así que no hace falta pedir nada al servidor).
export function ProductGrid({ productos }: { productos: ProductoDTO[] }) {
  const [cantidadVisible, setCantidadVisible] = useState(PRODUCTOS_POR_PAGINA);

  const visibles = productos.slice(0, cantidadVisible);
  const restantes = productos.length - visibles.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibles.map((p, i) => (
          <ProductCard key={p.id} producto={p} indice={i} />
        ))}
      </div>

      {restantes > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setCantidadVisible((c) => c + PRODUCTOS_POR_PAGINA)}
            className="presionable rounded-xl border border-tinta/20 px-6 py-3 text-sm font-medium transition-all duration-300 ease-premium hover:border-tinta/50 hover:bg-tinta/5"
          >
            Ver {Math.min(restantes, PRODUCTOS_POR_PAGINA)} más
          </button>
        </div>
      )}
    </>
  );
}
