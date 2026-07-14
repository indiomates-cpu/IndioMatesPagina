'use client';

import { MotionConfig } from 'framer-motion';

// Configuración global de Framer Motion: respeta la preferencia de
// "reducir movimiento" del sistema (desactiva transforms, conserva fades).
export function ProveedorMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
