'use client';

import { useState } from 'react';

export interface CategoriaAdmin {
  id: string;
  nombre: string;
  slug: string;
  orden: number;
  cantidadProductos: number;
}

export function CategoriaManager({ inicial }: { inicial: CategoriaAdmin[] }) {
  const [categorias, setCategorias] = useState(inicial);
  const [nombre, setNombre] = useState('');
  const [orden, setOrden] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editOrden, setEditOrden] = useState('0');

  const inputBase =
    'rounded-lg border border-tinta/15 bg-papel px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-300 focus:border-tinta focus:ring-4 focus:ring-tinta/5';

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setCreando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, orden: Number(orden) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Error');
      setCategorias((prev) =>
        [...prev, { ...data, cantidadProductos: 0 }].sort(
          (a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre)
        )
      );
      setNombre('');
      setOrden('0');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setCreando(false);
    }
  }

  function empezarEdicion(c: CategoriaAdmin) {
    setEditId(c.id);
    setEditNombre(c.nombre);
    setEditOrden(String(c.orden));
    setError(null);
  }

  async function guardarEdicion(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editNombre, orden: Number(editOrden) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Error');
      setCategorias((prev) =>
        prev
          .map((c) =>
            c.id === id
              ? { ...c, nombre: data.nombre, slug: data.slug, orden: data.orden }
              : c
          )
          .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre))
      );
      setEditId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  }

  async function eliminar(id: string, nombreCat: string) {
    if (!window.confirm(`¿Eliminar la categoría "${nombreCat}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/categorias/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Error');
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Lista */}
      <div>
        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-2xl border border-tinta/10 bg-papel">
          <table className="w-full text-sm">
            <thead className="border-b border-tinta/10 text-left text-xs uppercase tracking-wide text-tinta/50">
              <tr>
                <th className="p-3 font-medium">Nombre</th>
                <th className="p-3 font-medium">Orden</th>
                <th className="p-3 font-medium">Productos</th>
                <th className="p-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tinta/5">
              {categorias.map((c) => (
                <tr
                  key={c.id}
                  className="transition-colors duration-300 hover:bg-papel-hueso/70"
                >
                  {editId === c.id ? (
                    <>
                      <td className="p-3">
                        <input
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                          className={`${inputBase} w-full`}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={editOrden}
                          onChange={(e) => setEditOrden(e.target.value)}
                          className={`${inputBase} w-16`}
                        />
                      </td>
                      <td className="p-3 text-tinta/50">{c.cantidadProductos}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => guardarEdicion(c.id)}
                            className="presionable rounded-md bg-tinta px-2.5 py-1 text-xs text-papel hover:bg-tinta-suave"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="presionable rounded-md border border-tinta/15 px-2.5 py-1 text-xs hover:bg-tinta/5"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">
                        <p className="font-medium">{c.nombre}</p>
                        <p className="text-xs text-tinta/40">/{c.slug}</p>
                      </td>
                      <td className="p-3 tabular-nums">{c.orden}</td>
                      <td className="p-3 text-tinta/50">{c.cantidadProductos}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => empezarEdicion(c)}
                            className="presionable rounded-md border border-tinta/15 px-2.5 py-1 text-xs font-medium hover:border-tinta/40 hover:bg-tinta/5"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminar(c.id, c.nombre)}
                            className="presionable rounded-md border border-tinta/15 px-2.5 py-1 text-xs font-medium text-red-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categorias.length === 0 && (
          <p className="mt-6 text-center text-sm text-tinta/50">
            Todavía no hay categorías. Creá la primera →
          </p>
        )}
      </div>

      {/* Alta */}
      <aside className="h-fit rounded-2xl border border-tinta/10 bg-papel p-5 lg:sticky lg:top-6">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Nueva categoría
        </h2>
        <form onSubmit={crear} className="flex flex-col gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Bombillas"
              className={`${inputBase} w-full`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Orden en el menú
            </label>
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className={`${inputBase} w-full`}
            />
          </div>
          <button
            type="submit"
            disabled={creando}
            className="mt-1 rounded-lg bg-tinta py-2.5 font-medium text-papel transition-all duration-300 ease-premium hover:bg-tinta-suave hover:shadow-flotante-sm active:scale-[0.98] disabled:opacity-60"
          >
            {creando ? 'Creando…' : 'Crear categoría'}
          </button>
        </form>
      </aside>
    </div>
  );
}
