import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description:
    'Conocé la filosofía detrás de Indio Mates: selección cuidada, cultura matera y trato directo.',
};

// Foto conjunta de los dos socios. Para reemplazarla, poné el archivo en
// /public y actualizá la ruta acá.
const FOTO_SOCIOS = '/quienes-somos.jpg';

interface Socio {
  nombre: string;
  rol: string;
}

const SOCIOS: Socio[] = [
  { nombre: 'Lautaro', rol: 'Co-fundador' },
  { nombre: 'Lucio', rol: 'Co-fundador' },
];

const VALORES = [
  {
    emoji: '🧉',
    titulo: 'Selección cuidada',
    texto:
      'Elegimos cada mate, bombilla y accesorio pensando en el uso diario, no sólo en la estética. Si no lo usaríamos nosotros, no lo vendemos.',
  },
  {
    emoji: '🤝',
    titulo: 'Trato directo',
    texto:
      'Sin pasarelas de pago ni pasos de más: coordinás tu pedido directo con nosotros por WhatsApp, de persona a persona.',
  },
  {
    emoji: '✦',
    titulo: 'Cultura matera',
    texto:
      'El mate es un ritual que se comparte. Nos gusta acompañar esa costumbre con productos a la altura de la ceremonia.',
  },
];

export default function QuienesSomosPage() {
  return (
    <div>
      {/* Mini hero: misma textura y paleta oscura que la home */}
      <section className="relative overflow-hidden bg-tinta text-papel">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="animate-entrada inline-block rounded-full border border-papel/20 px-3 py-1 text-xs uppercase tracking-widest text-papel/70">
            🧉 Nuestra historia
          </span>
          <h1
            className="animate-entrada mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            Quiénes somos
          </h1>
          <p
            className="animate-entrada mx-auto mt-5 max-w-xl text-papel/70"
            style={{ animationDelay: '160ms' }}
          >
            Nacimos de una idea simple: que conseguir un buen mate, con la
            yerba que corresponde y una bombilla que no se tape, no debería
            ser complicado.
          </p>
        </div>
      </section>

      {/* Historia, con la foto de los socios junto al texto */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Foto de los socios */}
          <figure
            className="elevable animate-entrada mx-auto w-full max-w-sm rounded-2xl border border-tinta/10 bg-papel p-3 lg:max-w-none"
            style={{ animationDelay: '120ms' }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-papel-hueso">
              <Image
                src={FOTO_SOCIOS}
                alt={`${SOCIOS[1].nombre} y ${SOCIOS[0].nombre}, fundadores de Indio Mates`}
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="px-1 pb-1 pt-4 text-center">
              <p className="font-display text-lg font-semibold">
                {SOCIOS.map((s) => s.nombre).join(' & ')}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-tinta/50">
                Co-fundadores
              </p>
            </figcaption>
          </figure>

          {/* Texto de la historia */}
          <div
            className="animate-entrada space-y-4 leading-relaxed text-tinta/70"
            style={{ animationDelay: '200ms' }}
          >
            <p>
              <strong className="text-tinta">Indio Mates</strong> arrancó como
              una selección personal de mates, bombillas, yerberas y termos que
              fuimos armando con el tiempo, probando cada pieza en nuestra
              propia rutina de todos los días.
            </p>
            <p>
              Con eso en mente armamos este catálogo: productos elegidos con
              dedicación, sin vueltas para pedirlos y sin intermediarios para
              coordinar el pago y la entrega. Todo se resuelve hablando
              directamente con nosotros por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="border-t border-tinta/10 bg-papel-hueso">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2
            className="animate-entrada mb-8 text-center font-display text-2xl font-bold sm:text-3xl"
          >
            Lo que nos guía
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {VALORES.map((v, i) => (
              <div
                key={v.titulo}
                className="elevable animate-entrada rounded-2xl border border-tinta/10 bg-papel p-6"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <span className="text-2xl">{v.emoji}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">
                  {v.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta/60">
                  {v.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
        <h2 className="animate-entrada font-display text-2xl font-bold sm:text-3xl">
          ¿Buscás algo en particular?
        </h2>
        <p
          className="animate-entrada mx-auto mt-2 max-w-md text-tinta/60"
          style={{ animationDelay: '80ms' }}
        >
          Recorré el catálogo completo o escribinos si tenés alguna duda antes
          de elegir.
        </p>
        <div
          className="animate-entrada mt-6 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: '140ms' }}
        >
          <Link
            href="/productos"
            className="rounded-xl bg-tinta px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante active:translate-y-0 active:scale-[0.97] active:shadow-none"
          >
            Ver productos
          </Link>
          <Link
            href="/soporte"
            className="rounded-xl border border-tinta/20 px-6 py-3.5 font-medium transition-all duration-300 ease-premium hover:border-tinta/50 hover:bg-tinta/5 active:scale-[0.97]"
          >
            Necesito ayuda
          </Link>
        </div>
      </section>
    </div>
  );
}

