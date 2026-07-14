import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/session';
import { AdminNav } from '@/components/admin/AdminNav';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { MateIcono } from '@/components/mate/MateIcono';
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
      <aside className="flex flex-col gap-6 bg-tinta p-5 text-papel md:min-h-screen">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-papel text-tinta transition-transform duration-300 ease-premium group-hover:-rotate-6 group-hover:scale-105">
              <MateIcono className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-bold leading-tight">
              {NOMBRE_NEGOCIO}
              <span className="block text-[10px] font-normal uppercase tracking-widest text-papel/50">
                Administración
              </span>
            </span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-papel/50 underline underline-offset-2 hover:text-papel md:hidden"
          >
            Ver sitio
          </Link>
        </div>

        <div className="flex-1 overflow-x-auto md:overflow-visible">
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

      {/* Contenido */}
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
