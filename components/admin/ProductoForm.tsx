'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CategoriaDTO, ProductoDTO } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImagenLocal {
  url: string;
  // clave estable para React (las imágenes existentes traen id).
  key: string;
}

export function ProductoForm({
  categorias,
  producto,
}: {
  categorias: CategoriaDTO[];
  producto?: ProductoDTO;
}) {
  const router = useRouter();
  const esEdicion = Boolean(producto);

  const [nombre, setNombre] = useState(producto?.nombre ?? '');
  const [slug, setSlug] = useState(producto?.slug ?? '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
  const [precio, setPrecio] = useState(
    producto ? String(producto.precio) : ''
  );
  const [stock, setStock] = useState(producto ? String(producto.stock) : '0');
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [categoriaId, setCategoriaId] = useState(
    producto?.categoriaId ?? categorias[0]?.id ?? ''
  );
  const [imagenes, setImagenes] = useState<ImagenLocal[]>(
    (producto?.imagenes ?? []).map((img) => ({ url: img.url, key: img.id }))
  );

  const [urlNueva, setUrlNueva] = useState('');
  const [uploadConfigurado, setUploadConfigurado] = useState<boolean | null>(
    null
  );
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const keyCounter = useRef(0);

  useEffect(() => {
    fetch('/api/admin/upload')
      .then((r) => r.json())
      .then((d) => setUploadConfigurado(Boolean(d.configurado)))
      .catch(() => setUploadConfigurado(false));
  }, []);

  function nuevaKey() {
    keyCounter.current += 1;
    return `nueva-${keyCounter.current}`;
  }

  // ---- Gestión de imágenes ----
  function agregarUrl() {
    const url = urlNueva.trim();
    if (!url) return;
    setImagenes((prev) => [...prev, { url, key: nuevaKey() }]);
    setUrlNueva('');
  }

  async function subirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Error al subir');
      setImagenes((prev) => [...prev, { url: data.url, key: nuevaKey() }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setSubiendo(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function eliminarImagen(key: string) {
    setImagenes((prev) => prev.filter((img) => img.key !== key));
  }

  function mover(index: number, delta: number) {
    setImagenes((prev) => {
      const destino = index + delta;
      if (destino < 0 || destino >= prev.length) return prev;
      const copia = [...prev];
      const [item] = copia.splice(index, 1);
      copia.splice(destino, 0, item);
      return copia;
    });
  }

  // ---- Guardar ----
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);

    const body = {
      nombre,
      slug: slug.trim() || undefined,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      activo,
      categoriaId,
      imagenes: imagenes.map((img, i) => ({ url: img.url, orden: i })),
    };

    try {
      const res = await fetch(
        esEdicion ? `/api/admin/productos/${producto!.id}` : '/api/admin/productos',
        {
          method: esEdicion ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'No se pudo guardar');

      router.push('/admin/productos');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      setGuardando(false);
    }
  }

  const inputBase =
    'w-full rounded-lg border border-tinta/15 bg-papel px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-300 focus:border-tinta focus:ring-4 focus:ring-tinta/5';

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Columna principal */}
      <div className="flex flex-col gap-5">
        <Campo label="Nombre" htmlFor="nombre">
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className={inputBase}
          />
        </Campo>

        <Campo
          label="Slug (URL)"
          htmlFor="slug"
          hint="Opcional. Si lo dejás vacío, se genera a partir del nombre."
        >
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="se-genera-solo"
            className={inputBase}
          />
        </Campo>

        <Campo label="Descripción" htmlFor="descripcion">
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={6}
            className={cn(inputBase, 'resize-y')}
          />
        </Campo>

        {/* Imágenes */}
        <div>
          <p className="mb-1.5 block text-sm font-medium">Imágenes</p>
          <p className="mb-3 text-xs text-tinta/50">
            La primera imagen es la portada. Reordenalas con las flechas.
          </p>

          {imagenes.length > 0 && (
            <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imagenes.map((img, i) => (
                <li
                  key={img.key}
                  className="group relative animate-entrada overflow-hidden rounded-xl border border-tinta/10 transition-[border-color,box-shadow] duration-300 hover:border-tinta/30 hover:shadow-flotante-sm"
                >
                  <div className="relative aspect-square bg-papel-hueso">
                    <Image
                      src={img.url}
                      alt={`Imagen ${i + 1}`}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-tinta px-2 py-0.5 text-[10px] font-medium text-papel">
                        Portada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 p-1.5">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => mover(i, -1)}
                        disabled={i === 0}
                        aria-label="Mover a la izquierda"
                        className="presionable rounded-md border border-tinta/15 px-2 py-1 text-xs hover:bg-tinta/5 disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => mover(i, 1)}
                        disabled={i === imagenes.length - 1}
                        aria-label="Mover a la derecha"
                        className="presionable rounded-md border border-tinta/15 px-2 py-1 text-xs hover:bg-tinta/5 disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarImagen(img.key)}
                      className="presionable rounded-md border border-tinta/15 px-2 py-1 text-xs text-tinta/60 hover:border-tinta hover:text-tinta"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Agregar por URL */}
          <div className="flex gap-2">
            <input
              type="url"
              value={urlNueva}
              onChange={(e) => setUrlNueva(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  agregarUrl();
                }
              }}
              placeholder="https://… (pegar URL de imagen)"
              className={inputBase}
            />
            <button
              type="button"
              onClick={agregarUrl}
              className="presionable whitespace-nowrap rounded-lg border border-tinta/15 px-4 text-sm font-medium hover:border-tinta/40 hover:bg-tinta/5"
            >
              Agregar URL
            </button>
          </div>

          {/* Subir archivo (si Cloudinary está configurado) */}
          {uploadConfigurado ? (
            <div className="mt-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={subirArchivo}
                disabled={subiendo}
                className="block w-full text-sm text-tinta/60 file:mr-3 file:rounded-lg file:border-0 file:bg-tinta file:px-4 file:py-2 file:text-sm file:font-medium file:text-papel hover:file:bg-tinta-suave"
              />
              {subiendo && (
                <p className="mt-1 text-xs text-tinta/50">Subiendo imagen…</p>
              )}
            </div>
          ) : uploadConfigurado === false ? (
            <p className="mt-3 rounded-lg bg-tinta/5 px-3 py-2 text-xs text-tinta/60">
              Cloudinary no está configurado: agregá imágenes por URL. Para
              habilitar la subida de archivos, completá las variables
              CLOUDINARY_* en el <code>.env</code>.
            </p>
          ) : null}
        </div>
      </div>

      {/* Columna lateral */}
      <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-tinta/10 bg-papel p-5 lg:sticky lg:top-6">
        <Campo label="Categoría" htmlFor="categoria">
          <select
            id="categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className={inputBase}
          >
            {categorias.length === 0 && <option value="">Sin categorías</option>}
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <div className="grid grid-cols-2 gap-3">
          <Campo label="Precio (ARS)" htmlFor="precio">
            <input
              id="precio"
              type="number"
              min={0}
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              className={inputBase}
            />
          </Campo>
          <Campo label="Stock" htmlFor="stock">
            <input
              id="stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className={inputBase}
            />
          </Campo>
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4 accent-tinta"
          />
          Producto activo (visible en el catálogo)
        </label>

        {error && (
          <p className="rounded-lg bg-tinta/5 px-3 py-2 text-sm text-tinta">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={guardando || categorias.length === 0}
          className="rounded-lg bg-tinta py-3 font-medium text-papel transition-all duration-300 ease-premium hover:bg-tinta-suave hover:shadow-flotante-sm active:scale-[0.98] disabled:opacity-60"
        >
          {guardando
            ? 'Guardando…'
            : esEdicion
              ? 'Guardar cambios'
              : 'Crear producto'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="enlace-subrayado mx-auto w-fit text-sm text-tinta/60 transition-colors duration-300 hover:text-tinta"
        >
          Cancelar
        </button>
      </aside>
    </form>
  );
}

function Campo({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-tinta/50">{hint}</p>}
    </div>
  );
}
