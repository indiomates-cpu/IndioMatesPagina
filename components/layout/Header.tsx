'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { NOMBRE_NEGOCIO } from '@/lib/constants';
import { CartIcon } from '@/components/cart/CartIcon';
import { RESORTE_SUAVE, listaEscalonada, itemLista } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const pathname = usePathname();

  // Sombra sutil cuando la página deja de estar arriba de todo.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setDesplazado(v > 8));

  const linkDesktop =
    'enlace-subrayado text-sm font-medium transition-colors duration-300';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-tinta/10 bg-papel/85 backdrop-blur-md transition-shadow duration-500',
        desplazado && 'shadow-[0_10px_28px_-18px_rgb(10_10_10/0.35)]'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Espacio del logo (preparado para agregarlo después) */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${NOMBRE_NEGOCIO} — inicio`}
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 ease-premium group-hover:-rotate-6 group-hover:scale-105 group-active:scale-95">
            <Image
              src="/logo.png"
              alt={NOMBRE_NEGOCIO}
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {NOMBRE_NEGOCIO}
          </span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            data-activo={pathname === '/'}
            className={cn(
              linkDesktop,
              pathname === '/' ? 'text-tinta' : 'text-tinta/70 hover:text-tinta'
            )}
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            data-activo={pathname.startsWith('/productos')}
            className={cn(
              linkDesktop,
              pathname.startsWith('/productos')
                ? 'text-tinta'
                : 'text-tinta/70 hover:text-tinta'
            )}
          >
            Productos
          </Link>
          <Link
            href="/quienes-somos"
            data-activo={pathname === '/quienes-somos'}
            className={cn(
              linkDesktop,
              pathname === '/quienes-somos'
                ? 'text-tinta'
                : 'text-tinta/70 hover:text-tinta'
            )}
          >
            Quiénes somos
          </Link>
          <Link
            href="/soporte"
            data-activo={pathname === '/soporte'}
            className={cn(
              linkDesktop,
              pathname === '/soporte'
                ? 'text-tinta'
                : 'text-tinta/70 hover:text-tinta'
            )}
          >
            Soporte
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <CartIcon />
          {/* Botón de menú mobile: las tres líneas se transforman en una X. */}
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            className="presionable inline-flex h-11 w-11 items-center justify-center rounded-full border border-tinta/15 hover:bg-tinta/5 md:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden>
              <motion.span
                className="absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current"
                animate={menuAbierto ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={RESORTE_SUAVE}
              />
              <motion.span
                className="absolute left-0 top-[7px] block h-[2px] w-full rounded-full bg-current"
                animate={
                  menuAbierto ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }
                }
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-[14px] block h-[2px] w-full rounded-full bg-current"
                animate={
                  menuAbierto ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }
                }
                transition={RESORTE_SUAVE}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable con entrada escalonada */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-tinta/10 md:hidden"
          >
            <motion.div
              className="flex flex-col gap-1 px-4 py-3"
              variants={listaEscalonada}
              initial="oculto"
              animate="visible"
            >
              <motion.div variants={itemLista}>
                <Link
                  href="/"
                  onClick={() => setMenuAbierto(false)}
                  className="presionable block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-tinta/5"
                >
                  Inicio
                </Link>
              </motion.div>
              <motion.div variants={itemLista}>
                <Link
                  href="/productos"
                  onClick={() => setMenuAbierto(false)}
                  className="presionable block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-tinta/5"
                >
                  Todos los productos
                </Link>
              </motion.div>
              <motion.div variants={itemLista} className="my-1 h-px bg-tinta/10" />
              <motion.div variants={itemLista}>
                <Link
                  href="/quienes-somos"
                  onClick={() => setMenuAbierto(false)}
                  className="presionable block rounded-lg px-3 py-2.5 text-sm text-tinta/70 hover:bg-tinta/5"
                >
                  Quiénes somos
                </Link>
              </motion.div>
              <motion.div variants={itemLista}>
                <Link
                  href="/soporte"
                  onClick={() => setMenuAbierto(false)}
                  className="presionable block rounded-lg px-3 py-2.5 text-sm text-tinta/70 hover:bg-tinta/5"
                >
                  Soporte
                </Link>
              </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
