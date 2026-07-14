'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MateIcono } from '@/components/mate/MateIcono';
import { EASE_PREMIUM, RESORTE_SUAVE } from '@/lib/motion';

// Líneas del titular: cada una se revela desde su propia "máscara".
const LINEAS_TITULO = ['Todo para tu', 'mate, en un', 'solo lugar.'];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-tinta text-papel">
      {/* Textura sutil de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Halo que deriva detrás del contenido */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 -top-1/2 h-[80vmax] w-[80vmax] rounded-full animate-deriva-lenta"
        style={{
          background:
            'radial-gradient(circle at center, rgb(255 255 255 / 0.05), transparent 60%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            className="relative inline-block overflow-hidden rounded-full border border-papel/20 px-3 py-1 text-xs uppercase tracking-widest text-papel/70"
          >
            {/* Reflejo de luz que barre la pastilla de vez en cuando */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-papel/10 to-transparent"
              style={{ animation: 'brillo 5.5s cubic-bezier(0.22, 1, 0.36, 1) 2s infinite' }}
            />
            🧉 Cultura matera argentina
          </motion.span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {LINEAS_TITULO.map((linea, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_PREMIUM,
                    delay: 0.1 + i * 0.12,
                  }}
                >
                  {linea}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE_PREMIUM }}
            className="mt-5 max-w-md text-papel/70"
          >
            Mates, bombillas, yerberas, termos y accesorios elegidos con
            dedicación. Armá tu pedido y coordinamos por WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_PREMIUM }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/productos"
              className="rounded-xl bg-papel px-6 py-3.5 font-medium text-tinta transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-8px_rgb(255_255_255/0.35)] active:translate-y-0 active:scale-[0.97] active:shadow-none"
            >
              Ver productos
            </Link>
            <Link
              href="#categorias"
              className="rounded-xl border border-papel/25 px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:border-papel/50 hover:bg-papel/10 active:scale-[0.97]"
            >
              Explorar categorías
            </Link>
          </motion.div>
        </div>

        {/* Mate decorativo: flota, respira y un reflejo orbita su aro. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...RESORTE_SUAVE, delay: 0.25 }}
          className="relative mx-auto hidden md:block"
        >
          <div className="animate-flotar">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-papel/15">
              {/* Arco de luz girando alrededor del aro */}
              <div
                aria-hidden
                className="aro-luz absolute inset-0 rounded-full animate-girar-lento"
              />
              {/* Resplandor suave detrás del mate */}
              <div
                aria-hidden
                className="absolute inset-8 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgb(255 255 255 / 0.07), transparent 70%)',
                }}
              />
              <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-8 w-1.5 rounded-full bg-papel/50 blur-[1px] animate-vapor"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </div>
              <MateIcono className="h-36 w-36 text-papel" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
