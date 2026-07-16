'use client';

import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

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

  // Arrastre (dnd-kit): la distancia mínima evita que un tap cuente como drag.
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  async function alTerminarArrastre(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const previas = categorias;
    const desde = previas.findIndex((c) => c.id === active.id);
    const hasta = previas.findIndex((c) => c.id === over.id);
    if (desde < 0 || hasta < 0) return;

    // Renumera 0..n-1 según la nueva posición y persiste sólo las que cambian.
    const nuevas = arrayMove(previas, desde, hasta).map((c, i) => ({
      ...c,
      orden: i,
    }));
    setCategorias(nuevas);
    setError(null);

    const cambiadas = nuevas.filter((c) => {
      const antes = previas.find((p) => p.id === c.id)!;
      return antes.orden !== c.orden;
    });
    try {
      await Promise.all(
        cambiadas.map(async (c) => {
          const res = await fetch(`/api/admin/categorias/${c.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: c.nombre,
              slug: c.slug,
              orden: c.orden,
            }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? 'Error al guardar el orden');
          }
        })
      );
    } catch (err) {
      // Si algo falla, volvemos al orden anterior para no mentir en pantalla.
      setCategorias(previas);
      setError(
        err instanceof Error ? err.message : 'Error al guardar el orden'
      );
    }
  }

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
          {/* Encabezado (sólo desktop) */}
          <div className="hidden border-b border-tinta/10 p-3 text-xs uppercase tracking-wide text-tinta/50 sm:flex sm:items-center sm:gap-3">
            <span className="w-8" aria-hidden="true" />
            <span className="flex-1 font-medium">Nombre</span>
            <span className="w-14 text-center font-medium">Orden</span>
            <span className="w-20 text-center font-medium">Productos</span>
            <span className="w-36 text-right font-medium">Acciones</span>
          </div>

          <DndContext
            sensors={sensores}
            collisionDetection={closestCenter}
            onDragEnd={alTerminarArrastre}
          >
            <SortableContext
              items={categorias.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-tinta/5">
                {categorias.map((c) => (
                  <FilaCategoria
                    key={c.id}
                    categoria={c}
                    enEdicion={editId === c.id}
                    editNombre={editNombre}
                    editOrden={editOrden}
                    setEditNombre={setEditNombre}
                    setEditOrden={setEditOrden}
                    inputBase={inputBase}
                    onEditar={() => empezarEdicion(c)}
                    onGuardar={() => guardarEdicion(c.id)}
                    onCancelar={() => setEditId(null)}
                    onEliminar={() => eliminar(c.id, c.nombre)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
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

// Fila arrastrable de la lista (dnd-kit): se reordena desde el mango ⠿
// —también con el dedo en mobile— o editando el número de orden.
function FilaCategoria({
  categoria: c,
  enEdicion,
  editNombre,
  editOrden,
  setEditNombre,
  setEditOrden,
  inputBase,
  onEditar,
  onGuardar,
  onCancelar,
  onEliminar,
}: {
  categoria: CategoriaAdmin;
  enEdicion: boolean;
  editNombre: string;
  editOrden: string;
  setEditNombre: (v: string) => void;
  setEditOrden: (v: string) => void;
  inputBase: string;
  onEditar: () => void;
  onGuardar: () => void;
  onCancelar: () => void;
  onEliminar: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: c.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        position: 'relative',
      }}
      className={cn(
        'bg-papel transition-colors duration-300',
        isDragging ? 'shadow-flotante' : 'hover:bg-papel-hueso/70'
      )}
    >
      {enEdicion ? (
        <div className="flex flex-wrap items-center gap-2 p-3">
          <input
            value={editNombre}
            onChange={(e) => setEditNombre(e.target.value)}
            className={`${inputBase} min-w-[9rem] flex-1`}
          />
          <input
            type="number"
            value={editOrden}
            onChange={(e) => setEditOrden(e.target.value)}
            className={`${inputBase} w-20`}
            aria-label="Orden"
          />
          <button
            onClick={onGuardar}
            className="presionable rounded-md bg-tinta px-2.5 py-1.5 text-xs text-papel hover:bg-tinta-suave"
          >
            Guardar
          </button>
          <button
            onClick={onCancelar}
            className="presionable rounded-md border border-tinta/15 px-2.5 py-1.5 text-xs hover:bg-tinta/5"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 sm:gap-3">
          <button
            type="button"
            aria-label={`Arrastrar para reordenar ${c.nombre}`}
            {...attributes}
            {...listeners}
            style={{ touchAction: 'none' }}
            className="w-8 shrink-0 cursor-grab rounded-md border border-tinta/15 py-1.5 text-center text-sm text-tinta/50 hover:bg-tinta/5 active:cursor-grabbing"
          >
            ⠿
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{c.nombre}</p>
            <p className="truncate text-xs text-tinta/40">
              /{c.slug}
              <span className="sm:hidden">
                {' '}
                · {c.cantidadProductos}{' '}
                {c.cantidadProductos === 1 ? 'producto' : 'productos'}
              </span>
            </p>
          </div>

          <span className="hidden w-14 text-center tabular-nums text-tinta/60 sm:block">
            {c.orden}
          </span>
          <span className="hidden w-20 text-center text-tinta/50 sm:block">
            {c.cantidadProductos}
          </span>

          <div className="flex w-auto shrink-0 items-center justify-end gap-2 sm:w-36">
            <button
              onClick={onEditar}
              className="presionable rounded-md border border-tinta/15 px-2.5 py-1.5 text-xs font-medium hover:border-tinta/40 hover:bg-tinta/5"
            >
              Editar
            </button>
            <button
              onClick={onEliminar}
              className="presionable rounded-md border border-tinta/15 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
