'use client';

import { MotionConfig } from 'framer-motion';

// Configuración global de Framer Motion. `reducedMotion="never"` fuerza a que
// las animaciones corran SIEMPRE, aunque el sistema tenga activada la opción
// de "reducir movimiento" (en muchos Android la enciende el ahorro de batería
// y dejaba el sitio sin animaciones, con todo apareciendo de golpe).
export function ProveedorMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
