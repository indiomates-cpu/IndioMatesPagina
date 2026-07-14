'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCarrito, calcularTotal, calcularCantidadTotal } from '@/store/cart';
import { armarMensajePedido, construirLinkWhatsApp } from '@/lib/whatsapp';
import { EVENTO } from '@/lib/constants';

// Encapsula el flujo de confirmación del pedido:
// 1) arma el resumen de texto, 2) registra el evento "pedido_whatsapp",
// 3) abre WhatsApp con el mensaje codificado, 4) vacía el carrito y
// 5) redirige a la pantalla de confirmación.
export function useConfirmarPedido() {
  const router = useRouter();
  const items = useCarrito((e) => e.items);
  const vaciar = useCarrito((e) => e.vaciar);
  const cerrar = useCarrito((e) => e.cerrar);
  const [procesando, setProcesando] = useState(false);
  // Lock síncrono para evitar doble envío ante clics muy rápidos (el estado
  // de React no se actualiza a tiempo entre dos clics consecutivos).
  const bloqueado = useRef(false);

  function confirmar() {
    if (items.length === 0 || bloqueado.current) return;
    bloqueado.current = true;
    setProcesando(true);

    const total = calcularTotal(items);
    const mensaje = armarMensajePedido(items, total);
    const link = construirLinkWhatsApp(mensaje);

    // IMPORTANTE: abrir WhatsApp de forma SÍNCRONA, dentro del gesto del
    // usuario. Si se hiciera después de un `await`, Safari/iOS bloquean el
    // popup porque se pierde la activación transitoria del clic.
    window.open(link, '_blank', 'noopener,noreferrer');

    // Guardar un resumen para la pantalla de confirmación (incluye el link
    // para poder reabrir WhatsApp si el navegador bloqueó el popup).
    try {
      window.sessionStorage.setItem(
        'indio-ultimo-pedido',
        JSON.stringify({
          cantidad: calcularCantidadTotal(items),
          total,
          link,
          fecha: new Date().toISOString(),
        })
      );
    } catch {
      /* noop */
    }

    // Registrar la métrica del pedido SIN await (keepalive para que la
    // request sobreviva a la navegación). Nunca frena el pedido.
    try {
      void fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: EVENTO.PEDIDO_WHATSAPP }),
        keepalive: true,
      });
    } catch {
      // Silenciar: la métrica no debe frenar el pedido.
    }

    vaciar();
    cerrar();
    router.push('/pedido-confirmado');
    setProcesando(false);
  }

  return { confirmar, procesando };
}
