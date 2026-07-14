'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_PREMIUM } from '@/lib/motion';

interface Props {
  valor: number;
  min?: number;
  max?: number;
  onChange: (valor: number) => void;
  tamano?: 'sm' | 'md';
  className?: string;
}

// Control de cantidad con botones - y +, acotado entre min y max.
// El número rueda como un odómetro en la dirección del cambio.
export function QuantityStepper({
  valor,
  min = 1,
  max = 99,
  onChange,
  tamano = 'sm',
  className,
}: Props) {
  const puedeBajar = valor > min;
  const puedeSubir = valor < max;

  // Dirección del último cambio (fijada en los handlers, no durante el
  // render) para orientar la animación del número.
  const direccionRef = useRef(1);
  const direccion = direccionRef.current;

  function cambiar(delta: 1 | -1) {
    direccionRef.current = delta;
    onChange(valor + delta);
  }

  const botonBase =
    'flex items-center justify-center rounded-md transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-tinta hover:text-papel';
  const dim = tamano === 'md' ? 'h-10 w-10 text-lg' : 'h-8 w-8 text-base';
  const numDim = tamano === 'md' ? 'w-10 text-base' : 'w-8 text-sm';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-tinta/15 p-0.5',
        className
      )}
    >
      <motion.button
        type="button"
        onClick={() => puedeBajar && cambiar(-1)}
        disabled={!puedeBajar}
        whileTap={puedeBajar ? { scale: 0.82 } : undefined}
        aria-label="Restar uno"
        className={cn(botonBase, dim)}
      >
        −
      </motion.button>
      <span
        className={cn(
          'flex items-center justify-center overflow-hidden text-center font-medium tabular-nums',
          numDim
        )}
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={valor}
            initial={{ y: direccion * 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direccion * -14, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_PREMIUM }}
            className="block"
          >
            {valor}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        onClick={() => puedeSubir && cambiar(1)}
        disabled={!puedeSubir}
        whileTap={puedeSubir ? { scale: 0.82 } : undefined}
        aria-label="Sumar uno"
        className={cn(botonBase, dim)}
      >
        +
      </motion.button>
    </div>
  );
}
