import Link from 'next/link';
import { MateIcono } from '@/components/mate/MateIcono';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      {/* Mate flotando con su vapor, para no perder la calma. */}
      <div className="relative animate-entrada">
        <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-5 w-1 rounded-full bg-tinta/15 blur-[1px] animate-vapor"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>
        <div className="animate-flotar">
          <MateIcono className="h-16 w-16 text-tinta/30" />
        </div>
      </div>
      <h1
        className="mt-6 animate-entrada font-display text-4xl font-bold"
        style={{ animationDelay: '100ms' }}
      >
        Página no encontrada
      </h1>
      <p
        className="mt-2 animate-entrada text-tinta/60"
        style={{ animationDelay: '180ms' }}
      >
        No encontramos lo que buscabas. Quizás el producto ya no está disponible.
      </p>
      <Link
        href="/productos"
        className="mt-6 animate-entrada rounded-xl bg-tinta px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante active:translate-y-0 active:scale-[0.97] active:shadow-none"
        style={{ animationDelay: '260ms' }}
      >
        Ver productos
      </Link>
    </div>
  );
}
