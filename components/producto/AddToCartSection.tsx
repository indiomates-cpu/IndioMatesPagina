'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProductoDTO } from '@/lib/types';
import { useCarrito } from '@/store/cart';
import { EASE_PREMIUM } from '@/lib/motion';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { cn } from '@/lib/utils';

export function AddToCartSection({ producto }: { producto: ProductoDTO }) {
  const agregar = useCarrito((e) => e.agregar);
  const [cantidad, setCantidad] = useState(1);

  // Feedback breve de "agregado" en el botón.
  const [agregado, setAgregado] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const sinStock = producto.stock <= 0;

  function handleAgregar() {
    if (sinStock) return;
    agregar(producto, cantidad);
    setAgregado(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAgregado(false), 1400);
  }

  if (sinStock) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-tinta/10 py-4 font-medium text-tinta/40"
      >
        Sin stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <span className="text-sm text-tinta/60">Cantidad</span>
        <QuantityStepper
          valor={cantidad}
          min={1}
          max={producto.stock}
          onChange={setCantidad}
          tamano="md"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAgregar}
        className={cn(
          // relative: ancla el popLayout de la etiqueta saliente al botón.
          'relative flex flex-1 items-center justify-center gap-2 rounded-xl py-4 font-medium text-papel transition-all duration-300 ease-premium active:translate-y-0 active:shadow-none',
          agregado
            ? 'bg-green-600 shadow-flotante'
            : 'bg-tinta hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante'
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {agregado ? (
            <motion.span
              key="listo"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M20 6 9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                />
              </svg>
              Agregado al carrito
            </motion.span>
          ) : (
            <motion.span
              key="agregar"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Agregar al carrito
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
