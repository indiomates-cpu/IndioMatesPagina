'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';

// Configuración global de Framer Motion. `reducedMotion="never"` fuerza a que
// las animaciones corran SIEMPRE, aunque el sistema tenga activada la opción
// de "reducir movimiento" (en muchos teléfonos la enciende el ahorro de
// batería): no hay ningún limitador por preferencia de movimiento.
//
// Además gestiona el PISO DE SEGURIDAD: las animaciones de entrada arrancan en
// opacity:0, así que si algún equipo no las ejecuta, el contenido quedaría
// invisible. Este componente agrega la clase `piso` a <html> ~1.3s después de
// cargar cada ruta, lo que fuerza (por CSS) a mostrar el contenido en su estado
// final. Se re-arma en cada navegación (por eso depende de `usePathname`), así
// que las páginas siguientes vuelven a animar y no quedan "planas".
// La clase va en <html> a propósito: el contenido de las páginas dinámicas se
// transmite (streaming) en un nodo suelto fuera de <main>, así que un piso
// acotado al wrapper de la página no lo alcanzaría; uno global sí.
export function ProveedorMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.remove('piso'); // nueva ruta: dejar que animen
    const t = window.setTimeout(() => raiz.classList.add('piso'), 1300);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
