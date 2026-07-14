'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductoDTO } from '@/lib/types';
import { formatearPrecio } from '@/lib/utils';
import { IMAGEN_PLACEHOLDER, calcularEstadoStock } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function ProductosTabla({ inicial }: { inicial: ProductoDTO[] }) {
  const [productos, setProductos] = useState(inicial);
  const [busqueda, setBusqueda] = useState('');
  const [cargandoId, setCargandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stockEdit, setStockEdit] = useState<Record<string, string>>({});

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria?.nombre.toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  async function patch(
    id: string,
    data: Record<string, unknown>
  ): Promise<boolean> {
    setCargandoId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Error');
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...json } : p))
      );
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar');
      return false;
    } finally {
      setCargandoId(null);
    }
  }

  // Guarda el stock editado; sólo limpia el buffer si el guardado tuvo éxito
  // (así no se pierde lo tipeado si el PATCH falla).
  async function guardarStock(id: string, valor: string) {
    const n = Number(valor);
    if (valor.trim() === '' || !Number.isFinite(n) || n < 0) return;
    const ok = await patch(id, { stock: n });
    if (ok) {
      setStockEdit((s) => {
        const copia = { ...s };
        delete copia[id];
        return copia;
      });
    }
  }

  async function eliminar(id: string, nombre: string) {
    if (!window.confirm(`¿Eliminar "${nombre}" de forma permanente?`)) return;
    setCargandoId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? 'Error');
      }
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setCargandoId(null);
    }
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Buscar por nombre o categoría…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-tinta/15 bg-papel px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-300 focus:border-tinta focus:ring-4 focus:ring-tinta/5"
      />

      {error && (
        <p className="mb-4 rounded-lg bg-tinta/5 px-3 py-2 text-sm text-tinta">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-tinta/10 bg-papel">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-tinta/10 text-left text-xs uppercase tracking-wide text-tinta/50">
            <tr>
              <th className="p-3 font-medium">Producto</th>
              <th className="p-3 font-medium">Precio</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tinta/5">
            {filtrados.map((p) => {
              const cargando = cargandoId === p.id;
              const stockValor = stockEdit[p.id] ?? String(p.stock);
              // Un input vacío NO cuenta como cambio (evita guardar 0 sin querer).
              const stockCambiado =
                stockValor.trim() !== '' && Number(stockValor) !== p.stock;
              const estado = calcularEstadoStock(p.stock);

              return (
                <tr
                  key={p.id}
                  className={cn(
                    'transition-[background-color,opacity] duration-300 hover:bg-papel-hueso/70',
                    cargando && 'opacity-50'
                  )}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-papel-hueso">
                        <Image
                          src={p.imagenes[0]?.url ?? IMAGEN_PLACEHOLDER}
                          alt={p.nombre}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.nombre}</p>
                        <p className="text-xs text-tinta/50">
                          {p.categoria?.nombre ?? 'Sin categoría'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 tabular-nums">
                    {formatearPrecio(p.precio)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        value={stockValor}
                        onChange={(e) =>
                          setStockEdit((s) => ({ ...s, [p.id]: e.target.value }))
                        }
                        className={cn(
                          'w-16 rounded-md border px-2 py-1 text-sm outline-none transition-[border-color,box-shadow] duration-300 focus:border-tinta focus:ring-4 focus:ring-tinta/5',
                          estado === 'sin_stock'
                            ? 'border-tinta/40'
                            : 'border-tinta/15'
                        )}
                      />
                      {stockCambiado && (
                        <button
                          onClick={() => guardarStock(p.id, stockValor)}
                          className="presionable animate-entrada rounded-md bg-tinta px-2 py-1 text-xs text-papel hover:bg-tinta-suave"
                        >
                          Guardar
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => patch(p.id, { activo: !p.activo })}
                      disabled={cargando}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ease-premium active:scale-90',
                        p.activo
                          ? 'bg-tinta text-papel'
                          : 'border border-tinta/20 text-tinta/50 hover:border-tinta/50'
                      )}
                      title={p.activo ? 'Click para dar de baja' : 'Click para activar'}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="presionable rounded-md border border-tinta/15 px-2.5 py-1 text-xs font-medium hover:border-tinta/40 hover:bg-tinta/5"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => eliminar(p.id, p.nombre)}
                        disabled={cargando}
                        className="presionable rounded-md border border-tinta/15 px-2.5 py-1 text-xs font-medium text-tinta/60 hover:border-tinta hover:text-tinta"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtrados.length === 0 && (
        <p className="mt-6 text-center text-sm text-tinta/50">
          No hay productos que coincidan.
        </p>
      )}
    </div>
  );
}
