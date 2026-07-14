import { formatearPrecio } from './utils';
import type { ItemCarrito } from './types';

// Arma el texto plano del pedido con productos, cantidades y subtotal.
export function armarMensajePedido(items: ItemCarrito[], total: number): string {
  const lineas: string[] = [];
  lineas.push('¡Hola Indio Mates! 🧉 Quiero hacer este pedido:');
  lineas.push('');

  items.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    lineas.push(
      `• ${item.cantidad}x ${item.nombre} — ${formatearPrecio(subtotal)}`
    );
  });

  lineas.push('');
  lineas.push(`*Total: ${formatearPrecio(total)}*`);
  lineas.push('');
  lineas.push('Quedo a la espera para coordinar pago y entrega. ¡Gracias!');

  return lineas.join('\n');
}

// Construye el link de WhatsApp Click-to-Chat con el mensaje codificado.
export function construirLinkWhatsApp(mensaje: string): string {
  const numero = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(
    /[^0-9]/g,
    ''
  );
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${texto}`;
}
