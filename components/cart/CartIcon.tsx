'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarrito, calcularCantidadTotal } from '@/store/cart';
import { RESORTE_POP } from '@/lib/motion';

// Ícono del carrito con contador y micro-interacción: cuando aumenta la
// cantidad de ítems, "late" y sube un pequeño vapor de mate.
export function CartIcon() {
  const items = useCarrito((e) => e.items);
  const abrir = useCarrito((e) => e.abrir);

  const [montado, setMontado] = useState(false);
  const [animando, setAnimando] = useState(false);
  const previo = useRef(0);

  const cantidad = calcularCantidadTotal(items);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!montado) return;
    if (cantidad > previo.current) {
      setAnimando(true);
      const t = window.setTimeout(() => setAnimando(false), 500);
      previo.current = cantidad;
      return () => window.clearTimeout(t);
    }
    previo.current = cantidad;
  }, [cantidad, montado]);

  return (
    <motion.button
      onClick={abrir}
      whileTap={{ scale: 0.88 }}
      transition={RESORTE_POP}
      aria-label={`Abrir carrito${cantidad ? ` (${cantidad})` : ''}`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-tinta/15 bg-papel transition-colors duration-300 hover:bg-tinta hover:text-papel"
    >
      {/* Vapor al agregar */}
      <AnimatePresence>
        {animando && (
          <motion.span
            key="vapor"
            className="absolute -top-1 left-1/2 h-3 w-1 -translate-x-1/2 rounded-full bg-current"
            initial={{ opacity: 0.7, y: 0, scaleX: 1 }}
            animate={{ opacity: 0, y: -14, scaleX: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <motion.span
        animate={animando ? { scale: [1, 1.25, 0.95, 1] } : { scale: 1 }}
        transition={{ duration: 0.45 }}
        className="inline-flex"
      >
        {/* Ícono de bolsa */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </motion.span>

      {/* Entrada por CSS (animate-pop): la de montaje de framer no dispara
          confiablemente en este stack y dejaba el contador invisible. El
          key remonta el span en cada cambio y la animación CSS re-corre. */}
      {montado && cantidad > 0 && (
        <span
          key={cantidad}
          className="animate-pop absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-tinta px-1 text-[11px] font-semibold text-papel ring-2 ring-papel"
        >
          {cantidad}
        </span>
      )}
    </motion.button>
  );
}
