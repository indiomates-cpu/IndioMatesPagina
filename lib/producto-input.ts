import { prisma } from './prisma';
import { slugify } from './utils';

// Cantidad máxima de productos que pueden estar marcados como destacados
// al mismo tiempo (se muestran en la sección "Destacados" de la home).
export const MAX_DESTACADOS = 8;

export interface ImagenInput {
  url: string;
  orden?: number;
}

export interface DatosProducto {
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  precioOriginal: number | null;
  stock: number;
  activo: boolean;
  destacado: boolean;
  categoriaId: string;
  imagenes: ImagenInput[];
}

type Resultado =
  | { data: DatosProducto; error?: undefined }
  | { error: string; data?: undefined };

// Cuenta los productos destacados, excluyendo opcionalmente uno (el que se
// está editando, para no contarse a sí mismo contra el límite).
export async function contarDestacados(
  excluirId?: string
): Promise<number> {
  return prisma.producto.count({
    where: {
      destacado: true,
      ...(excluirId ? { id: { not: excluirId } } : {}),
    },
  });
}

// Valida y normaliza el body para crear/editar un producto.
// `productoIdActual` se pasa al editar, para excluirse a sí mismo del
// conteo del límite de destacados.
export async function parsearBodyProducto(
  body: Record<string, unknown>,
  opciones?: { productoIdActual?: string }
): Promise<Resultado> {
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const descripcion =
    typeof body.descripcion === 'string' ? body.descripcion.trim() : '';
  const categoriaId =
    typeof body.categoriaId === 'string' ? body.categoriaId : '';

  const precio = Number(body.precio);
  const stock = Math.trunc(Number(body.stock));
  const activo = body.activo === undefined ? true : Boolean(body.activo);
  const destacado =
    body.destacado === undefined ? false : Boolean(body.destacado);

  // Precio original (para descuento): opcional. Vacío/0/null -> sin descuento.
  const precioOriginalRaw = body.precioOriginal;
  const hayPrecioOriginal =
    precioOriginalRaw !== undefined &&
    precioOriginalRaw !== null &&
    precioOriginalRaw !== '';
  const precioOriginal = hayPrecioOriginal ? Number(precioOriginalRaw) : null;

  if (!nombre) return { error: 'El nombre es obligatorio' };
  if (!descripcion) return { error: 'La descripción es obligatoria' };
  if (!Number.isFinite(precio) || precio < 0) {
    return { error: 'El precio debe ser un número mayor o igual a 0' };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: 'El stock debe ser un número entero mayor o igual a 0' };
  }
  if (precioOriginal !== null) {
    if (!Number.isFinite(precioOriginal) || precioOriginal <= 0) {
      return {
        error: 'El precio anterior debe ser un número mayor a 0',
      };
    }
    if (precioOriginal <= precio) {
      return {
        error: 'El precio anterior debe ser mayor al precio actual',
      };
    }
  }
  if (!categoriaId) return { error: 'La categoría es obligatoria' };

  // Límite de productos destacados: si se está marcando como destacado,
  // verificar que no se supere el máximo (sin contarse a sí mismo).
  if (destacado) {
    const cantidad = await contarDestacados(opciones?.productoIdActual);
    if (cantidad >= MAX_DESTACADOS) {
      return {
        error: `Ya hay ${MAX_DESTACADOS} productos destacados. Quitá uno antes de agregar otro.`,
      };
    }
  }

  // Verificar que la categoría exista.
  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
    select: { id: true },
  });
  if (!categoria) return { error: 'La categoría seleccionada no existe' };

  // Slug: usar el provisto o derivarlo del nombre.
  const slug =
    typeof body.slug === 'string' && body.slug.trim()
      ? slugify(body.slug)
      : slugify(nombre);
  if (!slug) return { error: 'No se pudo generar un slug válido' };

  // Imágenes: filtrar entradas sin URL válida y respetar el orden recibido.
  const imagenesRaw = Array.isArray(body.imagenes) ? body.imagenes : [];
  const imagenes: ImagenInput[] = imagenesRaw
    .map((img, i) => {
      const url =
        img && typeof img === 'object' && 'url' in img
          ? String((img as { url: unknown }).url).trim()
          : '';
      const orden =
        img && typeof img === 'object' && 'orden' in img
          ? Number((img as { orden: unknown }).orden)
          : i;
      return { url, orden: Number.isFinite(orden) ? orden : i };
    })
    .filter((img) => img.url.length > 0);

  return {
    data: {
      nombre,
      slug,
      descripcion,
      precio,
      precioOriginal,
      stock,
      activo,
      destacado,
      categoriaId,
      imagenes,
    },
  };
}
