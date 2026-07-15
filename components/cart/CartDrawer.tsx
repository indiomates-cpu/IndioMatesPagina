'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCarrito, calcularTotal } from '@/store/cart';
import { formatearPrecio } from '@/lib/utils';
import { IMAGEN_PLACEHOLDER } from '@/lib/constants';
import { useConfirmarPedido } from '@/hooks/useConfirmarPedido';
import { MateIcono } from '@/components/mate/MateIcono';
import {
  EASE_PREMIUM,
  RESORTE_PANEL,
  listaEscalonada,
  itemLista,
} from '@/lib/motion';
import { QuantityStepper } from './QuantityStepper';

export function CartDrawer() {
  const abierto = useCarrito((e) => e.abierto);
  const cerrar = useCarrito((e) => e.cerrar);
  const items = useCarrito((e) => e.items);
  const quitar = useCarrito((e) => e.quitar);
  const cambiarCantidad = useCarrito((e) => e.cambiarCantidad);
  const { confirmar, procesando } = useConfirmarPedido();

  const total = calcularTotal(items);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* Fondo oscuro */}
          <motion.div
            className="fixed inset-0 z-40 bg-tinta/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={cerrar}
          />

          {/* Panel: entra con resorte, sale rápido y limpio. */}
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-papel shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{
              x: '100%',
              transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
            }}
            transition={RESORTE_PANEL}
            role="dialog"
            aria-label="Carrito de compras"
          >
            <header className="flex items-center justify-between border-b border-tinta/10 px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Tu carrito</h2>
              <button
                onClick={cerrar}
                aria-label="Cerrar carrito"
                className="rounded-full p-1.5 transition-all duration-300 ease-premium hover:rotate-90 hover:bg-tinta/5 active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            {items.length === 0 ? (
              <motion.div
                className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-tinta/60"
                variants={listaEscalonada}
                initial="oculto"
                animate="visible"
              >
                {/* Mate vacío con su vapor, esperando compañía. */}
                <motion.div variants={itemLista} className="relative">
                  <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1">
                    {[0, 1].map((i) => (
                      <span
                        key={i}
                        className="block h-4 w-0.5 rounded-full bg-tinta/20 blur-[1px] animate-vapor"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      />
                    ))}
                  </div>
                  <MateIcono className="h-12 w-12 text-tinta/25" />
                </motion.div>
                <motion.p variants={itemLista} className="text-sm">
                  Tu carrito está vacío.
                </motion.p>
                <motion.div variants={itemLista}>
                  <Link
                    href="/productos"
                    onClick={cerrar}
                    className="enlace-subrayado text-sm font-medium transition-colors hover:text-tinta"
                  >
                    Ver productos
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <motion.ul
                  className="flex-1 divide-y divide-tinta/10 overflow-y-auto px-5"
                  variants={listaEscalonada}
                  initial="oculto"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        variants={itemLista}
                        exit={{
                          opacity: 0,
                          x: 48,
                          transition: { duration: 0.25, ease: 'easeIn' },
                        }}
                        className="flex gap-3 py-4"
                      >
                        <Link
                          href={`/productos/${item.slug}`}
                          onClick={cerrar}
                          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-papel-hueso transition-transform duration-300 ease-premium active:scale-95"
                        >
                          <Image
                            src={item.imagen ?? IMAGEN_PLACEHOLDER}
                            alt={item.nombre}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/productos/${item.slug}`}
                              onClick={cerrar}
                              className="truncate text-sm font-medium hover:underline"
                            >
                              {item.nombre}
                            </Link>
                            <button
                              onClick={() => quitar(item.id)}
                              aria-label={`Quitar ${item.nombre}`}
                              className="text-red-400 transition-all duration-300 ease-premium hover:scale-110 hover:text-red-600 active:scale-90"
                            >
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-tinta/60">
                            {formatearPrecio(item.precio)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QuantityStepper
                              valor={item.cantidad}
                              min={1}
                              max={item.stock}
                              onChange={(v) => cambiarCantidad(item.id, v)}
                            />
                            <span className="text-sm font-semibold tabular-nums">
                              {formatearPrecio(item.precio * item.cantidad)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>

                <footer className="border-t border-tinta/10 px-5 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-tinta/60">Subtotal</span>
                    {/* El subtotal rueda como un odómetro al cambiar. */}
                    <span className="block overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={total}
                          initial={{ y: 16, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -16, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                          className="block font-display text-xl font-bold tabular-nums"
                        >
                          {formatearPrecio(total)}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>

                  <motion.button
                    onClick={confirmar}
                    disabled={procesando}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-tinta py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:bg-tinta-suave hover:shadow-flotante disabled:opacity-60"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.9.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
                    </svg>
                    {procesando ? 'Abriendo WhatsApp…' : 'Enviar pedido por WhatsApp'}
                  </motion.button>

                  <Link
                    href="/carrito"
                    onClick={cerrar}
                    className="mt-3 block text-center text-sm text-tinta/60 transition-colors hover:text-tinta"
                  >
                    <span className="enlace-subrayado">Ver carrito completo</span>
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
