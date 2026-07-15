import type { Categoria, ImagenProducto, Producto } from '@prisma/client';
import type { CategoriaDTO, ImagenDTO, ProductoDTO } from './types';

// Tipo que devuelve Prisma cuando incluimos relaciones habituales.
type ProductoConRelaciones = Producto & {
  categoria?: Categoria | null;
  imagenes?: ImagenProducto[];
};

export function serializarCategoria(c: Categoria): CategoriaDTO {
  return {
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    orden: c.orden,
  };
}

export function serializarImagen(i: ImagenProducto): ImagenDTO {
  return {
    id: i.id,
    url: i.url,
    orden: i.orden,
  };
}

export function serializarProducto(p: ProductoConRelaciones): ProductoDTO {
  return {
    id: p.id,
    nombre: p.nombre,
    slug: p.slug,
    descripcion: p.descripcion,
    // Decimal -> number para poder pasarlo a Client Components.
    precio: Number(p.precio),
    precioOriginal:
      p.precioOriginal != null ? Number(p.precioOriginal) : undefined,
    stock: p.stock,
    activo: p.activo,
    destacado: p.destacado,
    categoriaId: p.categoriaId,
    categoria: p.categoria ? serializarCategoria(p.categoria) : undefined,
    imagenes: (p.imagenes ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map(serializarImagen),
    creadoEn: p.creadoEn?.toISOString(),
    actualizadoEn: p.actualizadoEn?.toISOString(),
  };
}
