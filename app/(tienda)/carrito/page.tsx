'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCarrito, calcularTotal } from '@/store/cart';
import { formatearPrecio } from '@/lib/utils';
import { IMAGEN_PLACEHOLDER } from '@/lib/constants';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { useConfirmarPedido } from '@/hooks/useConfirmarPedido';
import { MateIcono } from '@/components/mate/MateIcono';
import { EASE_PREMIUM } from '@/lib/motion';

// Entradas por CSS (animate-entrada). framer se usa sólo para lo disparado por
// evento: salida de un ítem al quitarlo (AnimatePresence), reflow (layout),
// odómetro del subtotal y el tap del botón. Las animaciones de MONTAJE de
// framer no son confiables en este stack y dejaban invisibles el resumen y el
// botón de confirmar.
export default function CarritoPage() {
  const items = useCarrito((e) => e.items);
  const quitar = useCarrito((e) => e.quitar);
  const cambiarCantidad = useCarrito((e) => e.cambiarCantidad);
  const { confirmar, procesando } = useConfirmarPedido();

  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const total = calcularTotal(items);

  if (!montado) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="h-40 animate-pulse rounded-2xl bg-tinta/5" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6">
        {/* Mate vacío con su vapor, esperando compañía. */}
        <div className="animate-entrada relative">
          <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="block h-5 w-1 rounded-full bg-tinta/20 blur-[1px] animate-vapor"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
          <MateIcono className="h-16 w-16 text-tinta/25" />
        </div>
        <h1
          className="animate-entrada mt-6 font-display text-3xl font-bold"
          style={{ animationDelay: '80ms' }}
        >
          Tu carrito está vacío
        </h1>
        <p
          className="animate-entrada mt-2 text-tinta/60"
          style={{ animationDelay: '160ms' }}
        >
          Agregá productos para armar tu pedido.
        </p>
        <Link
          href="/productos"
          className="animate-entrada mt-6 inline-block rounded-xl bg-tinta px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante active:translate-y-0 active:scale-[0.97] active:shadow-none"
          style={{ animationDelay: '240ms' }}
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold sm:text-4xl">
        Tu carrito
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Lista de ítems */}
        <ul className="divide-y divide-tinta/10">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                exit={{
                  opacity: 0,
                  x: 56,
                  transition: { duration: 0.25, ease: 'easeIn' },
                }}
                className="flex gap-4 py-5"
              >
                <Link
                  href={`/productos/${item.slug}`}
                  className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-papel-hueso transition-transform duration-300 ease-premium hover:scale-[1.03] active:scale-95"
                >
                  <Image
                    src={item.imagen ?? IMAGEN_PLACEHOLDER}
                    alt={item.nombre}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/productos/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.nombre}
                    </Link>
                    <button
                      onClick={() => quitar(item.id)}
                      className="enlace-subrayado text-sm text-red-500 transition-colors duration-300 hover:text-red-700 active:scale-95"
                    >
                      Quitar
                    </button>
                  </div>
                  <p className="text-sm text-tinta/60">
                    {formatearPrecio(item.precio)} c/u
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityStepper
                      valor={item.cantidad}
                      min={1}
                      max={item.stock}
                      onChange={(v) => cambiarCantidad(item.id, v)}
                      tamano="md"
                    />
                    <span className="font-display text-lg font-bold tabular-nums">
                      {formatearPrecio(item.precio * item.cantidad)}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Resumen */}
        <aside className="animate-entrada h-fit rounded-2xl border border-tinta/10 bg-papel-hueso p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Resumen del pedido</h2>
          <div className="mt-4 flex items-center justify-between border-t border-tinta/10 pt-4">
            <span className="text-tinta/60">Subtotal</span>
            {/* El subtotal rueda como un odómetro al cambiar. */}
            <span className="block overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={total}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                  className="block font-display text-2xl font-bold tabular-nums"
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-tinta py-4 font-medium text-papel transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante active:translate-y-0 active:shadow-none disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.9.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
            </svg>
            {procesando ? 'Abriendo WhatsApp…' : 'Enviar pedido por WhatsApp'}
          </motion.button>

          <p className="mt-3 text-center text-xs text-tinta/50">
            Te llevamos a WhatsApp con el pedido ya escrito para coordinar pago y
            entrega.
          </p>
        </aside>
      </div>
    </div>
  );
}
