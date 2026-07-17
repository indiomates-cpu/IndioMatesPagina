'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatearPrecio } from '@/lib/utils';

interface ResumenPedido {
  cantidad: number;
  total: number;
  link?: string;
  fecha: string;
}

// Entradas por CSS (animate-entrada / animate-aparecer): las animaciones de
// montaje de framer no se disparan de forma confiable en este stack y dejaban
// la pantalla de confirmación en blanco.
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
      {/* Check con onda expansiva sutil. animate-latido (y no un keyframe por
          style inline): Tailwind sólo emite @keyframes si la clase se usa. */}
      <div className="relative animate-aparecer">
        <span
          aria-hidden
          className="animate-latido absolute inset-0 rounded-full border border-tinta/20"
          style={{
            animationDuration: '2.4s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-tinta text-papel">
          <svg
            viewBox="0 0 24 24"
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>

      <h1
        className="animate-entrada mt-8 font-display text-3xl font-bold sm:text-4xl"
        style={{ animationDelay: '120ms' }}
      >
        ¡Pedido enviado! 🧉
      </h1>

      <p
        className="animate-entrada mt-3 max-w-md text-tinta/60"
        style={{ animationDelay: '220ms' }}
      >
        Abrimos WhatsApp con el detalle de tu pedido. Terminá de enviar el
        mensaje para que coordinemos el pago y la entrega.
      </p>

      <div
        className="animate-entrada mt-8 flex flex-wrap justify-center gap-3"
        style={{ animationDelay: '320ms' }}
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
          className="rounded-xl bg-tinta px-6 py-3.5 font-medium text-papel transition-transform duration-300 ease-premium hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
        >
          Seguir comprando
        </Link>
      </div>

      {/* El resumen va al final: aparece un frame después de montar (lee
          sessionStorage) y acá abajo su llegada no empuja los botones. */}
      {montado && resumen && (
        <div
          className="animate-entrada mt-8 w-full max-w-sm rounded-2xl border border-tinta/10 bg-papel-hueso p-6 text-left"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-tinta/60">Productos</span>
            <span className="font-medium">{resumen.cantidad}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-tinta/10 pt-3">
            <span className="text-tinta/60">Total del pedido</span>
            <span className="font-display text-xl font-bold">
              {formatearPrecio(resumen.total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
