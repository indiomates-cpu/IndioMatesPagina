'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { ImagenDTO } from '@/lib/types';
import { IMAGEN_PLACEHOLDER } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { EASE_PREMIUM } from '@/lib/motion';

// Umbral de arrastre (px) para pasar de imagen con un swipe.
const UMBRAL_SWIPE = 60;

export function ProductGallery({
  imagenes,
  nombre,
}: {
  imagenes: ImagenDTO[];
  nombre: string;
}) {
  const lista =
    imagenes.length > 0
      ? imagenes
      : [{ id: 'placeholder', url: IMAGEN_PLACEHOLDER, orden: 0 }];

  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState(0);

  function ir(nuevo: number) {
    const total = lista.length;
    const acotado = (nuevo + total) % total;
    setDireccion(nuevo > indice ? 1 : -1);
    setIndice(acotado);
  }

  // Acotamos por si `indice` quedó fuera de rango (p. ej. al cambiar de
  // producto por navegación cliente hacia uno con menos imágenes).
  const indiceSeguro = Math.min(indice, lista.length - 1);
  const actual = lista[indiceSeguro];

  const flecha =
    'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-papel/80 backdrop-blur transition-all duration-300 ease-premium hover:bg-papel hover:shadow-flotante-sm active:scale-90 md:opacity-0 md:group-hover:opacity-100';

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal (con swipe en táctil) */}
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-tinta/10 bg-papel-hueso">
        <AnimatePresence initial={false} custom={direccion} mode="popLayout">
          <motion.div
            key={actual.id}
            custom={direccion}
            initial={{ opacity: 0, x: direccion * 56, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direccion * -56, scale: 0.985 }}
            transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            className="absolute inset-0"
            drag={lista.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -UMBRAL_SWIPE) ir(indiceSeguro + 1);
              else if (info.offset.x > UMBRAL_SWIPE) ir(indiceSeguro - 1);
            }}
          >
            <Image
              src={actual.url}
              alt={`${nombre} — imagen ${indiceSeguro + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {lista.length > 1 && (
          <>
            <button
              onClick={() => ir(indiceSeguro - 1)}
              aria-label="Imagen anterior"
              className={cn(flecha, 'left-3')}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => ir(indiceSeguro + 1)}
              aria-label="Imagen siguiente"
              className={cn(flecha, 'right-3')}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Indicador (cada punto navega a su imagen) */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {lista.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => ir(i)}
                  aria-label={`Ir a la imagen ${i + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300 ease-premium hover:scale-125',
                    i === indiceSeguro ? 'w-5 bg-tinta' : 'w-1.5 bg-tinta/30 hover:bg-tinta/60'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {lista.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {lista.map((img, i) => (
            <button
              key={img.id}
              onClick={() => ir(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ease-premium active:scale-90',
                i === indiceSeguro
                  ? 'border-tinta shadow-flotante-sm'
                  : 'border-transparent opacity-60 hover:-translate-y-0.5 hover:opacity-100'
              )}
            >
              <Image
                src={img.url}
                alt={`${nombre} miniatura ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
