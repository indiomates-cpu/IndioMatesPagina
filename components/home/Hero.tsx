import Link from 'next/link';
import Image from 'next/image';

// Líneas del titular: cada una se revela desde su propia "máscara".
const LINEAS_TITULO = ['Todo para tu', 'mate, en un', 'solo lugar.'];

// NOTA: las entradas se hacen con animaciones CSS (animate-entrada /
// animate-subir-mascara / animate-aparecer), NO con framer-motion. Las
// animaciones de montaje de framer no se disparan de forma confiable en este
// stack (v11 + React 19) y dejaban el contenido invisible. El CSS siempre corre.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-papel">
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center md:py-8">
        <div>
          <span className="animate-entrada relative inline-block overflow-hidden rounded-full border border-papel/20 px-3 py-1 text-xs uppercase tracking-widest text-papel/70">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-papel/10 to-transparent"
              style={{
                animation:
                  'brillo 5.5s cubic-bezier(0.22, 1, 0.36, 1) 2s infinite',
              }}
            />
            🧉 Cultura matera argentina
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {LINEAS_TITULO.map((linea, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <span
                  className="block animate-subir-mascara"
                  style={{ animationDelay: `${100 + i * 120}ms` }}
                >
                  {linea}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="animate-entrada mt-5 max-w-md text-papel/70"
            style={{ animationDelay: '400ms' }}
          >
            Mates, bombillas, yerberas, termos y accesorios elegidos con
            dedicación. Armá tu pedido y coordinamos por WhatsApp.
          </p>

          <div
            className="animate-entrada mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: '520ms' }}
          >
            <Link
              href="/productos"
              className="rounded-xl bg-papel px-6 py-3.5 font-medium text-tinta transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-8px_rgb(255_255_255/0.35)] active:translate-y-0 active:scale-[0.97] active:shadow-none"
            >
              Ver productos
            </Link>
            <Link
              href="#categorias"
              className="rounded-xl border border-papel/25 px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:border-papel/50 hover:bg-papel/10 active:scale-[0.97]"
            >
              Explorar categorías
            </Link>
          </div>
        </div>

        {/* Logo de marca flotante (debajo del texto en mobile, a la derecha en desktop) */}
        <div
          className="animate-aparecer relative mx-auto"
          style={{ animationDelay: '250ms' }}
        >
          <div className="animate-flotar">
            <div className="relative flex h-52 w-52 items-center justify-center sm:h-72 sm:w-72 md:h-[26rem] md:w-[26rem] lg:h-[32rem] lg:w-[32rem]">
              <Image
                src="/logo.png"
                alt="Indio Mates"
                fill
                unoptimized
                sizes="(max-width: 640px) 13rem, (max-width: 1024px) 26rem, 32rem"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
