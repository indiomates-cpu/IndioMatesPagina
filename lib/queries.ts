import 'server-only';
import { prisma } from './prisma';
import { serializarCategoria, serializarProducto } from './serialize';
import type { CategoriaDTO, ProductoDTO } from './types';

// Ejecuta una consulta y, si la base de datos no está disponible (por ejemplo
// en un primer arranque sin PostgreSQL configurado), devuelve un fallback y
// deja un aviso claro en la consola en vez de romper el render del sitio.
async function seguro<T>(
  fn: () => Promise<T>,
  fallback: T,
  contexto: string
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.warn(
      `\n⚠️  [Indio Mates] No se pudo consultar la base de datos (${contexto}).\n` +
        `   Revisá que PostgreSQL esté corriendo y que DATABASE_URL sea correcta,\n` +
        `   y ejecutá "npm run db:push" y "npm run db:seed".\n` +
        `   Detalle: ${e instanceof Error ? e.message : String(e)}\n`
    );
    return fallback;
  }
}

// Todas las categorías ordenadas para el menú/navegación.
export async function obtenerCategorias(): Promise<CategoriaDTO[]> {
  return seguro(
    async () => {
      const categorias = await prisma.categoria.findMany({
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
      });
      return categorias.map(serializarCategoria);
    },
    [],
    'obtenerCategorias'
  );
}

// Categorías junto con la cantidad de productos activos (para la home).
export async function obtenerCategoriasConConteo(): Promise<
  (CategoriaDTO & { cantidadProductos: number })[]
> {
  return seguro(
    async () => {
      const categorias = await prisma.categoria.findMany({
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
        include: {
          _count: { select: { productos: { where: { activo: true } } } },
        },
      });
      return categorias.map((c) => ({
        ...serializarCategoria(c),
        cantidadProductos: c._count.productos,
      }));
    },
    [],
    'obtenerCategoriasConConteo'
  );
}

// Órdenes disponibles para el listado de productos.
export type OrdenProductos =
  | 'novedades'
  | 'precio-asc'
  | 'precio-desc'
  | 'nombre-asc'
  | 'nombre-desc';

function resolverOrderBy(orden?: OrdenProductos) {
  switch (orden) {
    case 'precio-asc':
      return { precio: 'asc' as const };
    case 'precio-desc':
      return { precio: 'desc' as const };
    case 'nombre-asc':
      return { nombre: 'asc' as const };
    case 'nombre-desc':
      return { nombre: 'desc' as const };
    default:
      return { creadoEn: 'desc' as const };
  }
}

// Productos activos, opcionalmente filtrados por slug de categoría y
// ordenados según `orden` (por defecto, los más nuevos primero).
export async function obtenerProductos(opciones?: {
  categoriaSlug?: string;
  soloDestacados?: boolean;
  orden?: OrdenProductos;
  limite?: number;
}): Promise<ProductoDTO[]> {
  return seguro(
    async () => {
      const productos = await prisma.producto.findMany({
        where: {
          activo: true,
          ...(opciones?.categoriaSlug
            ? { categoria: { slug: opciones.categoriaSlug } }
            : {}),
        },
        include: {
          categoria: true,
          imagenes: { orderBy: { orden: 'asc' } },
        },
        orderBy: resolverOrderBy(opciones?.orden),
        ...(opciones?.limite ? { take: opciones.limite } : {}),
      });
      return productos.map(serializarProducto);
    },
    [],
    'obtenerProductos'
  );
}

// Un producto por slug (sólo si está activo), con categoría e imágenes.
export async function obtenerProductoPorSlug(
  slug: string
): Promise<ProductoDTO | null> {
  return seguro(
    async () => {
      const producto = await prisma.producto.findFirst({
        where: { slug, activo: true },
        include: {
          categoria: true,
          imagenes: { orderBy: { orden: 'asc' } },
        },
      });
      return producto ? serializarProducto(producto) : null;
    },
    null,
    'obtenerProductoPorSlug'
  );
}

// Productos destacados para la home (los más recientes con stock).
export async function obtenerDestacados(limite = 8): Promise<ProductoDTO[]> {
  return seguro(
    async () => {
      const productos = await prisma.producto.findMany({
        where: { activo: true, stock: { gt: 0 } },
        include: {
          categoria: true,
          imagenes: { orderBy: { orden: 'asc' } },
        },
        orderBy: { creadoEn: 'desc' },
        take: limite,
      });
      return productos.map(serializarProducto);
    },
    [],
    'obtenerDestacados'
  );
}
