'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProductoDTO } from '@/lib/types';
import { formatearPrecio } from '@/lib/utils';
import { IMAGEN_PLACEHOLDER, calcularDescuentoPorcentaje } from '@/lib/constants';
import { useCarrito } from '@/store/cart';
import { EASE_PREMIUM } from '@/lib/motion';
import { StockBadge } from './StockBadge';
import { DiscountBadge } from './DiscountBadge';

export function ProductCard({
  producto,
  indice = 0,
}: {
  producto: ProductoDTO;
  indice?: number;
}) {
  const agregar = useCarrito((e) => e.agregar);

  // Feedback breve de "agregado" en el botón.
  const [agregado, setAgregado] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const portada = producto.imagenes[0]?.url ?? IMAGEN_PLACEHOLDER;
  const sinStock = producto.stock <= 0;
  const descuento = calcularDescuentoPorcentaje(
    producto.precio,
    producto.precioOriginal
  );

  function agregarAlCarrito(e: React.MouseEvent) {
    e.preventDefault();
    if (sinStock) return;
    agregar(producto, 1);
    setAgregado(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAgregado(false), 1400);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -5 }}
      transition={{
        duration: 0.55,
        ease: EASE_PREMIUM,
        // Las tarjetas de una misma fila entran levemente escalonadas.
        delay: (indice % 4) * 0.06,
        y: { type: 'spring', stiffness: 300, damping: 22 },
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-tinta/10 bg-papel transition-[box-shadow,border-color] duration-500 ease-premium hover:border-tinta/25 hover:shadow-flotante"
    >
      <Link href={`/productos/${producto.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-papel-hueso">
          <Image
            src={portada}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06] ${
              sinStock ? 'opacity-60 grayscale' : ''
            }`}
          />
          <div className="absolute left-3 top-3">
            <StockBadge stock={producto.stock} />
          </div>
          {descuento !== null && (
            <div className="absolute right-3 top-3">
              <DiscountBadge porcentaje={descuento} />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {producto.categoria && (
          <span className="mb-1 text-xs uppercase tracking-wide text-tinta/40">
            {producto.categoria.nombre}
          </span>
        )}
        <Link href={`/productos/${producto.slug}`}>
          <h3 className="line-clamp-2 font-medium leading-snug transition-colors duration-300 group-hover:text-tinta/70">
            {producto.nombre}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            {descuento !== null && (
              <span className="text-xs text-tinta/40 line-through">
                {formatearPrecio(producto.precioOriginal!)}
              </span>
            )}
            <span className="font-display text-lg font-bold">
              {formatearPrecio(producto.precio)}
            </span>
          </div>
          <motion.button
            onClick={agregarAlCarrito}
            disabled={sinStock}
            whileTap={sinStock ? undefined : { scale: 0.92 }}
            aria-label={
              sinStock ? 'Sin stock' : `Agregar ${producto.nombre} al carrito`
            }
            className="inline-flex h-9 min-w-[5.25rem] items-center justify-center rounded-lg bg-tinta px-3 text-sm font-medium text-papel transition-all duration-300 ease-premium hover:bg-tinta-suave hover:shadow-flotante-sm disabled:cursor-not-allowed disabled:bg-tinta/20 disabled:text-tinta/40 disabled:shadow-none"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {sinStock ? (
                <span>Sin stock</span>
              ) : agregado ? (
                <motion.span
                  key="listo"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE_PREMIUM }}
                  className="flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Listo
                </motion.span>
              ) : (
                <motion.span
                  key="agregar"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE_PREMIUM }}
                >
                  Agregar
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
