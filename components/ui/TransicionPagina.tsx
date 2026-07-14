'use client';

import { motion } from 'framer-motion';
import { EASE_PREMIUM } from '@/lib/motion';

// Entrada coreografiada del contenido en cada navegación (se usa desde los
// template.tsx, que se remontan por ruta). Sólo opacity/transform: apto GPU.
// `sutil` es la variante más rápida y corta para el panel de administración.
export function TransicionPagina({
  children,
  sutil = false,
}: {
  children: React.ReactNode;
  sutil?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: sutil ? 8 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: sutil ? 0.35 : 0.5, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}
