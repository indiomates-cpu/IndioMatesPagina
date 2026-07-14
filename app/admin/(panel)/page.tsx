import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { EVENTO } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    totalProductos,
    activos,
    sinStock,
    totalCategorias,
    pedidos,
    vistas,
  ] = await Promise.all([
    prisma.producto.count(),
    prisma.producto.count({ where: { activo: true } }),
    prisma.producto.count({ where: { stock: 0 } }),
    prisma.categoria.count(),
    prisma.eventoMetrica.count({ where: { tipo: EVENTO.PEDIDO_WHATSAPP } }),
    prisma.eventoMetrica.count({ where: { tipo: EVENTO.VISTA_PRODUCTO } }),
  ]);

  const tarjetas = [
    { label: 'Productos', valor: totalProductos, sub: `${activos} activos` },
    { label: 'Sin stock', valor: sinStock, sub: 'requieren reposición' },
    { label: 'Categorías', valor: totalCategorias, sub: 'en el catálogo' },
    { label: 'Pedidos por WhatsApp', valor: pedidos, sub: 'histórico' },
    { label: 'Vistas de productos', valor: vistas, sub: 'histórico' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Panel de control</h1>
          <p className="text-sm text-tinta/60">Resumen general del negocio.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="elevable rounded-lg bg-tinta px-4 py-2.5 text-sm font-medium text-papel hover:bg-tinta-suave"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {tarjetas.map((t, i) => (
          <div
            key={t.label}
            className="animate-entrada rounded-2xl border border-tinta/10 bg-papel p-5"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <p className="text-xs uppercase tracking-wide text-tinta/50">
              {t.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold">{t.valor}</p>
            <p className="mt-1 text-xs text-tinta/50">{t.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <AccesoRapido
          href="/admin/productos"
          titulo="Gestionar productos"
          desc="Alta, edición, stock e imágenes."
        />
        <AccesoRapido
          href="/admin/categorias"
          titulo="Gestionar categorías"
          desc="Organizá el catálogo."
        />
        <AccesoRapido
          href="/admin/metricas"
          titulo="Ver métricas"
          desc="Vistas, pedidos y stock."
        />
      </div>
    </div>
  );
}

function AccesoRapido({
  href,
  titulo,
  desc,
}: {
  href: string;
  titulo: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-tinta/10 bg-papel p-5 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-tinta hover:shadow-flotante active:translate-y-0 active:scale-[0.98] active:shadow-none"
    >
      <p className="flex items-center justify-between font-medium">
        {titulo}
        <span
          aria-hidden
          className="translate-x-0 opacity-0 transition-all duration-300 ease-premium group-hover:translate-x-1 group-hover:opacity-100"
        >
          →
        </span>
      </p>
      <p className="mt-1 text-sm text-tinta/60">{desc}</p>
    </Link>
  );
}
