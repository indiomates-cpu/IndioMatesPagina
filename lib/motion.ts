import type { Transition, Variants } from 'framer-motion';

// Lenguaje de movimiento compartido del sitio. Centraliza curvas, resortes y
// variantes para que el loader, las transiciones de página y las
// micro-interacciones se sientan parte de una misma coreografía.

// Salida rápida con frenado suave. Es la misma curva que `ease-premium`
// definida en tailwind.config.ts — si se cambia una, cambiar la otra.
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Resorte general para apariciones y hovers.
export const RESORTE_SUAVE: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.9,
};

// Resorte para paneles y elementos grandes (drawer, pill de navegación).
export const RESORTE_PANEL: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
};

// Resorte con rebote corto para "pops" (badges, confirmaciones).
export const RESORTE_POP: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 20,
};

// Aparición estándar: sube y aparece.
export const aparicion: Variants = {
  oculto: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_PREMIUM },
  },
};

// Contenedor que escalona la entrada de sus hijos.
export const listaEscalonada: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

// Ítem de lista para usar dentro de `listaEscalonada`.
export const itemLista: Variants = {
  oculto: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_PREMIUM },
  },
};
