import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/producto/ProductGallery';
import { AddToCartSection } from '@/components/producto/AddToCartSection';
import { StockBadge } from '@/components/producto/StockBadge';
import { DiscountBadge } from '@/components/producto/DiscountBadge';
import { RegistrarVista } from '@/components/producto/RegistrarVista';
import { obtenerProductoPorSlug } from '@/lib/queries';
import { formatearPrecio } from '@/lib/utils';
import { calcularDescuentoPorcentaje } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);
  if (!producto) return { title: 'Producto no encontrado' };
  return {
    title: producto.nombre,
    description: producto.descripcion.slice(0, 160),
  };
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);

  if (!producto) notFound();

  const descuento = calcularDescuentoPorcentaje(
    producto.precio,
    producto.precioOriginal
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Registra el evento de vista del producto. El `key` fuerza el remonte
          al navegar entre detalles por el cliente, para que se registre la
          vista del nuevo producto. */}
      <RegistrarVista key={producto.id} productoId={producto.id} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-tinta/50">
        <Link
          href="/productos"
          className="enlace-subrayado transition-colors duration-300 hover:text-tinta"
        >
          Productos
        </Link>
        {producto.categoria && (
          <>
            <span>/</span>
            <Link
              href={`/productos?categoria=${producto.categoria.slug}`}
              className="enlace-subrayado transition-colors duration-300 hover:text-tinta"
            >
              {producto.categoria.nombre}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Galería */}
        <ProductGallery
          key={producto.id}
          imagenes={producto.imagenes}
          nombre={producto.nombre}
        />

        {/* Información */}
        <div className="flex flex-col">
          {producto.categoria && (
            <span className="text-xs uppercase tracking-widest text-tinta/40">
              {producto.categoria.nombre}
            </span>
          )}
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            {producto.nombre}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {descuento !== null && (
              <span className="text-base text-tinta/40 line-through">
                {formatearPrecio(producto.precioOriginal!)}
              </span>
            )}
            <span className="font-display text-3xl font-bold">
              {formatearPrecio(producto.precio)}
            </span>
            {descuento !== null && <DiscountBadge porcentaje={descuento} />}
            <StockBadge stock={producto.stock} />
          </div>

          <div className="mt-6 whitespace-pre-line leading-relaxed text-tinta/70">
            {producto.descripcion}
          </div>

          <div className="mt-8 border-t border-tinta/10 pt-6">
            <AddToCartSection producto={producto} />
          </div>

          <p className="mt-4 text-xs text-tinta/50">
            🧉 El pedido se coordina y se paga por WhatsApp. No procesamos pagos
            online.
          </p>
        </div>
      </div>
    </div>
  );
}
