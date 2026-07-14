// Tipos "DTO" serializables que viajan del servidor a los componentes cliente.
// Prisma devuelve `precio` como Decimal, que no es serializable a un Client
// Component; por eso lo convertimos a number con los helpers de serialize.ts.

export interface ImagenDTO {
  id: string;
  url: string;
  orden: number;
}

export interface CategoriaDTO {
  id: string;
  nombre: string;
  slug: string;
  orden: number;
}

export interface ProductoDTO {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  // Precio "antes" del descuento. Si está presente y es mayor a `precio`,
  // se muestra tachado junto con el % de descuento.
  precioOriginal?: number;
  stock: number;
  activo: boolean;
  categoriaId: string;
  categoria?: CategoriaDTO;
  imagenes: ImagenDTO[];
  creadoEn?: string;
  actualizadoEn?: string;
}

// Ítem tal como se guarda en el carrito (estado del cliente).
export interface ItemCarrito {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  stock: number;
  imagen: string | null;
  cantidad: number;
}
