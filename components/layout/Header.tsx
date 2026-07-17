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
import { NOMBRE_NEGOCIO, URL_INSTAGRAM } from '@/lib/constants';
import { CartIcon } from '@/components/cart/CartIcon';
import { IconoInstagram } from '@/components/ui/IconoInstagram';
import { RESORTE_SUAVE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const ENLACES = [
  { href: '/', etiqueta: 'Inicio', exacto: true },
  { href: '/productos', etiqueta: 'Productos', exacto: false },
  { href: '/quienes-somos', etiqueta: 'Quiénes somos', exacto: true },
  { href: '/soporte', etiqueta: 'Soporte', exacto: true },
];

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const pathname = usePathname();

  // Sombra sutil cuando la página deja de estar arriba de todo.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setDesplazado(v > 8));

  const linkDesktop =
    'enlace-subrayado text-sm font-medium transition-colors duration-300';

  const estaActivo = (e: (typeof ENLACES)[number]) =>
    e.exacto ? pathname === e.href : pathname.startsWith(e.href);

  return (
    <>
    <header
      className={cn(
        // En mobile, fondo casi opaco SIN blur: backdrop-filter sobre sticky
        // parpadea al scrollear en Chrome Android y castiga la GPU.
        'sticky top-0 z-30 border-b border-tinta/10 bg-papel/95 transition-shadow duration-500 md:bg-papel/85 md:backdrop-blur-md',
        desplazado && 'shadow-[0_10px_28px_-18px_rgb(10_10_10/0.35)]'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${NOMBRE_NEGOCIO} — inicio`}
        >
          <span className="relative h-10 w-10 shrink-0 transition-transform duration-300 ease-premium group-hover:scale-110 group-active:scale-95">
            <Image
              src="/logo2.png"
              alt={NOMBRE_NEGOCIO}
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {NOMBRE_NEGOCIO}
          </span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              data-activo={estaActivo(e)}
              className={cn(
                linkDesktop,
                estaActivo(e)
                  ? 'text-tinta'
                  : 'text-tinta/70 hover:text-tinta'
              )}
            >
              {e.etiqueta}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Instagram: siempre visible, junto al carrito. */}
          <a
            href={URL_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Indio Mates"
            className="presionable inline-flex h-11 w-11 items-center justify-center rounded-full border border-tinta/15 text-tinta/70 transition-colors duration-300 hover:bg-tinta/5 hover:text-tinta"
          >
            <IconoInstagram />
          </a>
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

    </header>

    {/* Menú mobile: drawer lateral (como el carrito). Va FUERA del header
        porque su backdrop-blur crea un containing block que rompería el
        position:fixed del panel. */}
    <AnimatePresence>
      {menuAbierto && (
        <>
          {/* Fondo oscuro (entra por CSS, sale con framer). Sin backdrop-blur:
              animar la opacidad de una capa que re-blurea todo el viewport
              tira frames en la GPU del teléfono. */}
          <motion.div
            className="menu-fondo-entra fixed inset-0 z-40 bg-tinta/60 md:hidden"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuAbierto(false)}
          />

          {/* Panel lateral (entra por CSS, sale con framer). */}
          <motion.aside
            className="menu-panel-entra fixed right-0 top-0 z-50 flex h-full w-[78vw] max-w-xs flex-col bg-papel shadow-2xl md:hidden"
            initial={false}
            exit={{
              x: '100%',
              transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
            }}
            role="dialog"
            aria-label="Menú de navegación"
          >
            <div className="flex items-center justify-between border-b border-tinta/10 px-5 py-4">
              <span className="font-display text-lg font-semibold">Menú</span>
              <button
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
                className="rounded-full p-1.5 transition-all duration-300 ease-premium hover:rotate-90 hover:bg-tinta/5 active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4">
              {ENLACES.map((e, i) => (
                <div
                  key={e.href}
                  className="animate-entrada"
                  style={{ animationDelay: `${100 + i * 60}ms` }}
                >
                  <Link
                    href={e.href}
                    onClick={() => setMenuAbierto(false)}
                    className={cn(
                      'presionable block rounded-lg px-4 py-3 text-base font-medium',
                      estaActivo(e)
                        ? 'bg-tinta/5 text-tinta'
                        : 'text-tinta/70 hover:bg-tinta/5 hover:text-tinta'
                    )}
                  >
                    {e.etiqueta}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Instagram + marca al pie del panel */}
            <div className="mt-auto border-t border-tinta/10 px-5 py-4">
              <a
                href={URL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Indio Mates"
                className="presionable inline-flex items-center gap-2 rounded-full border border-tinta/15 px-3.5 py-2 text-sm text-tinta/70 hover:bg-tinta/5 hover:text-tinta"
              >
                <IconoInstagram className="h-4 w-4" />
                @indio_mates
              </a>
              <div className="mt-4 text-xs uppercase tracking-[0.25em] text-tinta/40">
                {NOMBRE_NEGOCIO}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
