'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { OrdenProductos } from '@/lib/queries';

const OPCIONES: { value: OrdenProductos; label: string }[] = [
  { value: 'novedades', label: 'Más nuevos' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nombre-asc', label: 'Nombre: A-Z' },
  { value: 'nombre-desc', label: 'Nombre: Z-A' },
];

// Selector de orden del listado de productos. Actualiza el parámetro
// `orden` en la URL (conservando la categoría activa, si hay una).
export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const actual = (searchParams.get('orden') as OrdenProductos) || 'novedades';

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value && e.target.value !== 'novedades') {
      params.set('orden', e.target.value);
    } else {
      params.delete('orden');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <select
      value={actual}
      onChange={onChange}
      aria-label="Ordenar productos"
      className="rounded-lg border border-tinta/15 bg-papel px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-300 focus:border-tinta focus:ring-4 focus:ring-tinta/5"
    >
      {OPCIONES.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
