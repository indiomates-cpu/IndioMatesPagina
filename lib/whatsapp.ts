import { formatearPrecio } from './utils';
import type { ItemCarrito } from './types';

// Arma el texto plano del pedido con productos, cantidades y subtotal.
export function armarMensajePedido(items: ItemCarrito[], total: number): string {
  const lineas: string[] = [];
  lineas.push('¡Hola Indio Mates! Quiero hacer este pedido:');
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

function limpiarNumero(numero: string | undefined): string {
  return (numero ?? '').replace(/[^0-9]/g, '');
}

interface OpcionesLinkWhatsApp {
  // Si es true, reparte al azar (50/50) entre los dos números configurados
  // (NEXT_PUBLIC_WHATSAPP_NUMBER y NEXT_PUBLIC_WHATSAPP_NUMBER_2) para
  // repartir la carga de pedidos entre los socios. Si el segundo número no
  // está configurado, siempre usa el primero.
  alternar?: boolean;
}

function elegirNumero(alternar: boolean): string {
  const principal = limpiarNumero(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const secundario = limpiarNumero(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2);

  if (!alternar || !secundario) return principal;

  return Math.random() < 0.5 ? principal : secundario;
}

// Construye el link de WhatsApp Click-to-Chat con el mensaje codificado.
export function construirLinkWhatsApp(
  mensaje: string,
  opciones: OpcionesLinkWhatsApp = {}
): string {
  const numero = elegirNumero(opciones.alternar ?? false);
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${texto}`;
}
