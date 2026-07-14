// Constantes de negocio compartidas por todo el sitio.

// Umbral de "stock bajo": con esta cantidad o menos (y mayor a 0) se muestra
// el aviso destacado "¡Últimas X unidades!".
export const UMBRAL_STOCK_BAJO = 2;

// Cantidad de productos que se muestran en el listado antes de necesitar
// tocar "Ver más".
export const PRODUCTOS_POR_PAGINA = 12;

// Imagen de reemplazo cuando un producto no tiene imágenes cargadas.
export const IMAGEN_PLACEHOLDER =
  'https://placehold.co/800x800/0a0a0a/ffffff/png?text=Indio+Mates';

// Nombre del negocio.
export const NOMBRE_NEGOCIO = 'Indio Mates';

// Tipos de evento registrados en la tabla EventoMetrica.
export const EVENTO = {
  VISTA_PRODUCTO: 'vista_producto',
  PEDIDO_WHATSAPP: 'pedido_whatsapp',
} as const;

export type TipoEvento = (typeof EVENTO)[keyof typeof EVENTO];

// Estado de stock derivado de la cantidad disponible.
export type EstadoStock = 'sin_stock' | 'bajo' | 'disponible';

export function calcularEstadoStock(stock: number): EstadoStock {
  if (stock <= 0) return 'sin_stock';
  if (stock <= UMBRAL_STOCK_BAJO) return 'bajo';
  return 'disponible';
}

// Texto a mostrar para cada estado de stock.
export function etiquetaStock(stock: number): string {
  switch (calcularEstadoStock(stock)) {
    case 'sin_stock':
      return 'Sin stock';
    case 'bajo':
      return `¡Últimas ${stock} unidades!`;
    default:
      return `Stock: ${stock} unidades`;
  }
}

// Porcentaje de descuento a mostrar (redondeado). Devuelve null si no hay
// precio original cargado o si no representa un descuento real.
export function calcularDescuentoPorcentaje(
  precio: number,
  precioOriginal?: number | null
): number | null {
  if (!precioOriginal || precioOriginal <= precio) return null;
  return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
}
