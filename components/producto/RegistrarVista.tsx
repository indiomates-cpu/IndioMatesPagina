'use client';

import { useEffect, useRef } from 'react';
import { EVENTO } from '@/lib/constants';

// Registra un evento "vista_producto" cuando el usuario abre el detalle.
// Se hace del lado del cliente (en el montaje) para no contar prefetchs ni
// renders del servidor. No renderiza nada.
export function RegistrarVista({ productoId }: { productoId: string }) {
  const enviado = useRef(false);

  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;

    fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: EVENTO.VISTA_PRODUCTO, productoId }),
      keepalive: true,
    }).catch(() => {
      /* la métrica no debe romper la navegación */
    });
  }, [productoId]);

  return null;
}
