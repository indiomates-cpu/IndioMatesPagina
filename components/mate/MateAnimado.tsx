'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_PREMIUM } from '@/lib/motion';

// Versión animada del MateIcono: los trazos se "dibujan" en secuencia, como
// hecho a mano. Usa exactamente la misma geometría que MateIcono para
// mantener la marca; sólo cambia la forma de aparecer.
export function MateAnimado({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  // Props compartidas para cada trazo según su orden en la secuencia.
  const dibujo = (orden: number, duracion: number, opacidadFinal = 1) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: opacidadFinal },
    transition: {
      pathLength: {
        delay: delay + orden * 0.16,
        duration: duracion,
        ease: EASE_PREMIUM,
      },
      opacity: { delay: delay + orden * 0.16, duration: 0.2 },
    },
  });

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
    >
      {/* Cuerpo del mate (calabaza) */}
      <motion.path
        d="M32 20
           c-9 0 -15 6 -15 17
           c0 11 7 19 15 19
           c8 0 15 -8 15 -19
           c0 -11 -6 -17 -15 -17 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        {...dibujo(0, 0.9)}
      />
      {/* Borde superior / boca del mate */}
      <motion.ellipse
        cx="32"
        cy="21"
        rx="12"
        ry="4"
        stroke="currentColor"
        strokeWidth="3"
        {...dibujo(1, 0.7)}
      />
      {/* Bombilla */}
      <motion.path
        d="M41 12 L52 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        {...dibujo(2, 0.5)}
      />
      {/* Cabeza de la bombilla: aparece con un pop al final del trazo. */}
      <motion.circle
        cx="53"
        cy="5.5"
        r="2.6"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: delay + 0.55,
          duration: 0.45,
          ease: EASE_PREMIUM,
        }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      {/* Yerba insinuada */}
      <motion.path
        d="M24 22 q8 5 16 0"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        {...dibujo(3, 0.5, 0.55)}
      />
    </svg>
  );
}
