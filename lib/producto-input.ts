import { prisma } from './prisma';
import { slugify } from './utils';

export interface ImagenInput {
  url: string;
  orden?: number;
}

export interface DatosProducto {
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo: boolean;
  categoriaId: string;
  imagenes: ImagenInput[];
}

type Resultado =
  | { data: DatosProducto; error?: undefined }
  | { error: string; data?: undefined };

// Valida y normaliza el body para crear/editar un producto.
export async function parsearBodyProducto(
  body: Record<string, unknown>
): Promise<Resultado> {
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const descripcion =
    typeof body.descripcion === 'string' ? body.descripcion.trim() : '';
  const categoriaId =
    typeof body.categoriaId === 'string' ? body.categoriaId : '';

  const precio = Number(body.precio);
  const stock = Math.trunc(Number(body.stock));
  const activo = body.activo === undefined ? true : Boolean(body.activo);

  if (!nombre) return { error: 'El nombre es obligatorio' };
  if (!descripcion) return { error: 'La descripción es obligatoria' };
  if (!Number.isFinite(precio) || precio < 0) {
    return { error: 'El precio debe ser un número mayor o igual a 0' };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: 'El stock debe ser un número entero mayor o igual a 0' };
  }
  if (!categoriaId) return { error: 'La categoría es obligatoria' };

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
    data: { nombre, slug, descripcion, precio, stock, activo, categoriaId, imagenes },
  };
}
