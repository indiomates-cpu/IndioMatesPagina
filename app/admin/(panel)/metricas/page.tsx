import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { EVENTO } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function MetricasPage() {
  // Fecha de corte para el período de "últimos 30 días".
  const hace30dias = new Date();
  hace30dias.setDate(hace30dias.getDate() - 30);

  const [vistasAgrupadas, pedidosTotal, pedidosPeriodo, sinStock] =
    await Promise.all([
      // Productos más vistos.
      prisma.eventoMetrica.groupBy({
        by: ['productoId'],
        where: { tipo: EVENTO.VISTA_PRODUCTO, productoId: { not: null } },
        _count: true,
        orderBy: { _count: { productoId: 'desc' } },
        take: 10,
      }),
      // Pedidos enviados por WhatsApp (histórico).
      prisma.eventoMetrica.count({ where: { tipo: EVENTO.PEDIDO_WHATSAPP } }),
      // Pedidos en los últimos 30 días.
      prisma.eventoMetrica.count({
        where: { tipo: EVENTO.PEDIDO_WHATSAPP, fecha: { gte: hace30dias } },
      }),
      // Productos sin stock.
      prisma.producto.findMany({
        where: { stock: 0 },
        include: { categoria: true },
        orderBy: { nombre: 'asc' },
      }),
    ]);

  // Resolver nombres de los productos más vistos.
  const ids = vistasAgrupadas
    .map((v) => v.productoId)
    .filter((id): id is string => Boolean(id));
  const productos = ids.length
    ? await prisma.producto.findMany({
        where: { id: { in: ids } },
        select: { id: true, nombre: true, slug: true },
      })
    : [];
  const mapaProductos = new Map(productos.map((p) => [p.id, p]));

  const masVistos = vistasAgrupadas
    .map((v) => ({
      producto: v.productoId ? mapaProductos.get(v.productoId) : undefined,
      vistas: v._count,
    }))
    .filter((v) => v.producto);

  const maxVistas = masVistos[0]?.vistas ?? 1;

  const gaConfigurado = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Métricas</h1>
          <p className="text-sm text-tinta/60">
            Basadas en los eventos registrados en el sitio.
          </p>
        </div>

        {gaConfigurado ? (
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="elevable presionable flex items-center gap-2 rounded-xl border border-tinta/15 bg-papel px-4 py-2.5 text-sm font-medium"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            Ver Google Analytics
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        ) : (
          <p className="max-w-xs rounded-xl border border-dashed border-tinta/20 px-4 py-2.5 text-xs text-tinta/50">
            Google Analytics todavía no está configurado. Completá{' '}
            <code className="rounded bg-tinta/5 px-1">
              NEXT_PUBLIC_GA_MEASUREMENT_ID
            </code>{' '}
            para habilitarlo.
          </p>
        )}
      </div>

      {/* Resumen de pedidos */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl border border-tinta/10 bg-papel p-5">
          <p className="text-xs uppercase tracking-wide text-tinta/50">
            Pedidos (30 días)
          </p>
          <p className="mt-2 font-display text-4xl font-bold">{pedidosPeriodo}</p>
        </div>
        <div className="rounded-2xl border border-tinta/10 bg-papel p-5">
          <p className="text-xs uppercase tracking-wide text-tinta/50">
            Pedidos (histórico)
          </p>
          <p className="mt-2 font-display text-4xl font-bold">{pedidosTotal}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Más vistos */}
        <section className="rounded-2xl border border-tinta/10 bg-papel p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">
            Productos más vistos
          </h2>
          {masVistos.length === 0 ? (
            <p className="text-sm text-tinta/50">
              Todavía no hay vistas registradas.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {masVistos.map(({ producto, vistas }, i) => (
                <li
                  key={producto!.id}
                  className="animate-entrada"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <Link
                      href={`/productos/${producto!.slug}`}
                      target="_blank"
                      className="truncate font-medium hover:underline"
                    >
                      {producto!.nombre}
                    </Link>
                    <span className="ml-3 flex-shrink-0 tabular-nums text-tinta/60">
                      {vistas} {vistas === 1 ? 'vista' : 'vistas'}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-tinta/5">
                    {/* La barra crece desde la izquierda al entrar. */}
                    <div
                      className="h-full origin-left animate-crecer rounded-full bg-tinta"
                      style={{
                        width: `${(vistas / maxVistas) * 100}%`,
                        animationDelay: `${150 + i * 80}ms`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sin stock */}
        <section className="rounded-2xl border border-tinta/10 bg-papel p-6">
          <h2 className="mb-4 flex items-center justify-between font-display text-lg font-semibold">
            Productos sin stock
            <span className="rounded-full bg-tinta px-2.5 py-0.5 text-xs font-medium text-papel">
              {sinStock.length}
            </span>
          </h2>
          {sinStock.length === 0 ? (
            <p className="text-sm text-tinta/50">
              ¡Todos los productos tienen stock! 🧉
            </p>
          ) : (
            <ul className="divide-y divide-tinta/5">
              {sinStock.map((p, i) => (
                <li
                  key={p.id}
                  className="flex animate-entrada items-center justify-between gap-3 py-2.5 text-sm"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.nombre}</p>
                    <p className="text-xs text-tinta/40">
                      {p.categoria?.nombre}
                    </p>
                  </div>
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="presionable flex-shrink-0 rounded-md border border-tinta/15 px-2.5 py-1 text-xs font-medium hover:border-tinta/40 hover:bg-tinta/5"
                  >
                    Reponer
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
