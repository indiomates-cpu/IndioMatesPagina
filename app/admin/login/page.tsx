import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { MateIcono } from '@/components/mate/MateIcono';
import { NOMBRE_NEGOCIO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Ingreso al panel',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-tinta px-4">
      {/* Halo que deriva y textura de puntos, en eco del loader de la tienda. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 -top-1/4 h-[70vmax] w-[70vmax] rounded-full animate-deriva"
        style={{
          background:
            'radial-gradient(circle at center, rgb(255 255 255 / 0.05), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="w-full max-w-sm animate-entrada rounded-2xl bg-papel p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-tinta text-papel">
            {/* Vapor del mate del panel */}
            <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden>
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="block h-3 w-0.5 rounded-full bg-tinta/25 blur-[1px] animate-vapor"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </span>
            <MateIcono className="h-7 w-7" />
          </span>
          <h1
            className="mt-4 animate-entrada font-display text-xl font-bold"
            style={{ animationDelay: '80ms' }}
          >
            {NOMBRE_NEGOCIO}
          </h1>
          <p
            className="animate-entrada text-sm text-tinta/50"
            style={{ animationDelay: '140ms' }}
          >
            Panel de administración
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
