'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatearPrecio } from '@/lib/utils';
import { EASE_PREMIUM, RESORTE_POP } from '@/lib/motion';

interface ResumenPedido {
  cantidad: number;
  total: number;
  link?: string;
  fecha: string;
}

// Ángulos (en grados) de las partículas que celebran el pedido.
const ANGULOS_BURST = [0, 45, 90, 135, 180, 225, 270, 315];

export default function PedidoConfirmadoPage() {
  const [resumen, setResumen] = useState<ResumenPedido | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    try {
      const raw = window.sessionStorage.getItem('indio-ultimo-pedido');
      if (raw) setResumen(JSON.parse(raw) as ResumenPedido);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
      {/* Check animado con onda expansiva y partículas monocromáticas */}
      <div className="relative">
        {/* Onda que se expande detrás del círculo */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-tinta/30"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
          transition={{ delay: 0.35, duration: 1, ease: 'easeOut' }}
        />
        {/* Partículas que salen disparadas al confirmar */}
        {ANGULOS_BURST.map((angulo, i) => {
          const rad = (angulo * Math.PI) / 180;
          return (
            <motion.span
              key={angulo}
              aria-hidden
              className={
                i % 2 === 0
                  ? 'absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-tinta/50'
                  : 'absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-[1px] bg-tinta/35'
              }
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{
                x: Math.cos(rad) * 74,
                y: Math.sin(rad) * 74,
                scale: [0, 1, 0.4],
                opacity: [0, 1, 0],
              }}
              transition={{ delay: 0.4, duration: 0.9, ease: EASE_PREMIUM }}
            />
          );
        })}

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-tinta text-papel"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6 9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: EASE_PREMIUM }}
        className="mt-8 font-display text-3xl font-bold sm:text-4xl"
      >
        ¡Pedido enviado! 🧉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE_PREMIUM }}
        className="mt-3 max-w-md text-tinta/60"
      >
        Abrimos WhatsApp con el detalle de tu pedido. Terminá de enviar el
        mensaje para que coordinemos el pago y la entrega.
      </motion.p>

      {montado && resumen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.55, ease: EASE_PREMIUM }}
          className="mt-8 w-full max-w-sm rounded-2xl border border-tinta/10 bg-papel-hueso p-6 text-left"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-tinta/60">Productos</span>
            <span className="font-medium">{resumen.cantidad}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-tinta/10 pt-3">
            <span className="text-tinta/60">Total del pedido</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...RESORTE_POP, delay: 0.65 }}
              className="font-display text-xl font-bold"
            >
              {formatearPrecio(resumen.total)}
            </motion.span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease: EASE_PREMIUM }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {montado && resumen?.link && (
          <a
            href={resumen.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-tinta/20 px-6 py-3.5 font-medium transition-all duration-300 ease-premium hover:border-tinta/50 hover:bg-tinta/5 active:scale-[0.97]"
          >
            ¿No se abrió? Reabrir WhatsApp
          </a>
        )}
        <Link
          href="/productos"
          className="rounded-xl bg-tinta px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante active:translate-y-0 active:scale-[0.97] active:shadow-none"
        >
          Seguir comprando
        </Link>
      </motion.div>
    </div>
  );
}
