import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminSession } from '@/lib/session';
import { AdminNav } from '@/components/admin/AdminNav';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { NOMBRE_NEGOCIO } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-papel-hueso md:grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 z-20 flex flex-col gap-4 bg-tinta p-4 text-papel md:static md:min-h-screen md:gap-6 md:p-5">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="group flex items-center gap-2">
            <span className="relative h-8 w-8 shrink-0 transition-transform duration-300 ease-premium group-hover:-rotate-6 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt={NOMBRE_NEGOCIO}
                fill
                sizes="32px"
                className="object-contain"
              />
            </span>
            <span className="font-display text-sm font-bold leading-tight">
              {NOMBRE_NEGOCIO}
              <span className="block text-[10px] font-normal uppercase tracking-widest text-papel/50">
                Administración
              </span>
            </span>
          </Link>
          {/* Acciones compactas (sólo mobile) */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/"
              target="_blank"
              className="presionable rounded-lg border border-papel/20 px-2.5 py-1.5 text-xs text-papel/70 hover:bg-papel/10"
            >
              Ver sitio
            </Link>
            <LogoutButton className="presionable whitespace-nowrap rounded-lg border border-papel/20 px-2.5 py-1.5 text-xs text-papel/70 hover:bg-papel/10 disabled:opacity-60" />
          </div>
        </div>

        <div className="md:flex-1">
          <AdminNav />
        </div>

        <div className="hidden flex-col gap-3 md:flex">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-papel/50 underline underline-offset-2 hover:text-papel"
          >
            Ver sitio público ↗
          </Link>
          <div className="rounded-lg bg-papel/5 px-3 py-2 text-xs text-papel/60">
            Sesión: <span className="font-medium text-papel">{session.usuario}</span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Contenido (min-w-0: la columna 1fr no debe crecer más que el
          viewport aunque adentro haya tablas o textos sin corte). */}
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
