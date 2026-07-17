import Link from 'next/link';
import Image from 'next/image';
import { NOMBRE_NEGOCIO } from '@/lib/constants';

export function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-tinta/10 bg-papel-hueso">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="group flex items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 transition-transform duration-300 ease-premium group-hover:-rotate-6 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt={NOMBRE_NEGOCIO}
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </span>
              <span className="font-display text-lg font-bold">{NOMBRE_NEGOCIO}</span>
            </div>
            <p className="mt-3 text-sm text-tinta/60">
              Mates, bombillas, yerberas, termos y accesorios. Elegí tus
              productos y coordinamos el pedido por WhatsApp.
            </p>
          </div>

          <nav className="flex flex-col items-start gap-2 text-sm">
            <span className="mb-1 font-medium">Navegación</span>
            <Link href="/" className="enlace-subrayado text-tinta/60 transition-colors duration-300 hover:text-tinta">Inicio</Link>
            <Link href="/productos" className="enlace-subrayado text-tinta/60 transition-colors duration-300 hover:text-tinta">Productos</Link>
            <Link href="/carrito" className="enlace-subrayado text-tinta/60 transition-colors duration-300 hover:text-tinta">Carrito</Link>
          </nav>

          <nav className="flex flex-col items-start gap-2 text-sm">
            <span className="mb-1 font-medium">Ayuda</span>
            <Link href="/quienes-somos" className="enlace-subrayado text-tinta/60 transition-colors duration-300 hover:text-tinta">Quiénes somos</Link>
            <Link href="/soporte" className="enlace-subrayado text-tinta/60 transition-colors duration-300 hover:text-tinta">Soporte</Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-tinta/10 pt-6 text-xs text-tinta/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {anio} {NOMBRE_NEGOCIO}. Todos los derechos reservados.</span>
          <span>
            Trabajo realizado por{' '}
            <a
              href="https://justinosantos.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-300 hover:text-tinta"
            >
              Justino Santos
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
