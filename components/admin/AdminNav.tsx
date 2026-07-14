'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { RESORTE_PANEL } from '@/lib/motion';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Inicio', exact: true },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/metricas', label: 'Métricas' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => {
        const activo = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'presionable relative rounded-lg px-3 py-2.5 text-sm font-medium',
              activo
                ? 'text-tinta'
                : 'text-papel/70 hover:bg-papel/10 hover:text-papel'
            )}
          >
            {/* La pastilla blanca se desliza hacia la sección activa. */}
            {activo && (
              <motion.span
                layoutId="admin-nav-activo"
                transition={RESORTE_PANEL}
                className="absolute inset-0 rounded-lg bg-papel"
              />
            )}
            <span className="relative z-10">{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
