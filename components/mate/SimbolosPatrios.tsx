import { cn } from '@/lib/utils';

// Capa decorativa del loader: íconos argentinos (los PNG "pantalla-N" de
// public/) repartidos por los bordes sobre el fondo oscuro. El sol y la
// pelota giran, el resto flota (todo CSS, ver globals.css). Cada ítem anida
// dos grupos: el externo posiciona y el interno anima (la animación CSS de
// transform pisaría el translate si fueran el mismo elemento).
//
// Dos variantes: "ancha" (desktop) y "alta" (mobile, pantalla vertical, con
// los íconos reubicados en los bordes para que no los recorte el slice).
type Item = {
  href: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
  opacidad: number;
  animacion: 'ml-girar' | 'ml-flotar';
  duracion?: string;
  retraso?: string;
};

const FONDOS: Record<'ancha' | 'alta', { viewBox: string; items: Item[] }> = {
  ancha: {
    viewBox: '0 0 1440 800',
    items: [
      // Sol de mayo girando (arriba izquierda).
      { href: '/pantalla-4.webp', x: 170, y: 150, ancho: 190, alto: 190, opacidad: 0.5, animacion: 'ml-girar', duracion: '42s' },
      // Maradona (izquierda).
      { href: '/pantalla-2.webp', x: 150, y: 520, ancho: 210, alto: 210, opacidad: 0.55, animacion: 'ml-flotar', retraso: '-1.2s' },
      // Pelota Tango rodando (abajo a la izquierda).
      { href: '/pantalla-1.webp', x: 330, y: 670, ancho: 160, alto: 139, opacidad: 0.5, animacion: 'ml-girar', duracion: '24s' },
      // Medialunas (arriba, al centro).
      { href: '/pantalla-6.webp', x: 725, y: 105, ancho: 150, alto: 96, opacidad: 0.5, animacion: 'ml-flotar', retraso: '-2.6s' },
      // Messi con la Copa (derecha arriba).
      { href: '/pantalla-3.webp', x: 1270, y: 190, ancho: 210, alto: 168, opacidad: 0.55, animacion: 'ml-flotar', retraso: '-0.6s' },
      // Malvinas (derecha abajo).
      { href: '/pantalla-5.webp', x: 1250, y: 655, ancho: 230, alto: 188, opacidad: 0.5, animacion: 'ml-flotar', retraso: '-3.4s' },
    ],
  },
  alta: {
    viewBox: '0 0 400 870',
    items: [
      // Sol de mayo (arriba izquierda).
      { href: '/pantalla-4.webp', x: 64, y: 110, ancho: 100, alto: 100, opacidad: 0.45, animacion: 'ml-girar', duracion: '42s' },
      // Medialunas (arriba derecha).
      { href: '/pantalla-6.webp', x: 330, y: 100, ancho: 100, alto: 64, opacidad: 0.45, animacion: 'ml-flotar', retraso: '-2.6s' },
      // Messi con la Copa (derecha, a media altura).
      { href: '/pantalla-3.webp', x: 350, y: 250, ancho: 115, alto: 92, opacidad: 0.45, animacion: 'ml-flotar', retraso: '-0.6s' },
      // Maradona (izquierda, a media altura).
      { href: '/pantalla-2.webp', x: 44, y: 370, ancho: 115, alto: 115, opacidad: 0.45, animacion: 'ml-flotar', retraso: '-1.2s' },
      // Pelota Tango (abajo izquierda, pegada al borde para no pisar el texto).
      { href: '/pantalla-1.webp', x: 42, y: 760, ancho: 85, alto: 74, opacidad: 0.45, animacion: 'ml-girar', duracion: '24s' },
      // Malvinas (abajo derecha, pegada al borde para no pisar el texto).
      { href: '/pantalla-5.webp', x: 356, y: 765, ancho: 115, alto: 94, opacidad: 0.45, animacion: 'ml-flotar', retraso: '-3.4s' },
    ],
  },
};

function Icono({ item }: { item: Item }) {
  return (
    <g transform={`translate(${item.x} ${item.y})`} opacity={item.opacidad}>
      <g
        className={item.animacion}
        style={{ animationDuration: item.duracion, animationDelay: item.retraso }}
      >
        <image
          href={item.href}
          x={-item.ancho / 2}
          y={-item.alto / 2}
          width={item.ancho}
          height={item.alto}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </g>
  );
}

export function SimbolosPatrios({
  variante = 'ancha',
  className,
}: {
  variante?: 'ancha' | 'alta';
  className?: string;
}) {
  const fondo = FONDOS[variante];
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'ml-fondo-entra pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
      viewBox={fondo.viewBox}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {fondo.items.map((item, i) => (
        <Icono key={i} item={item} />
      ))}
    </svg>
  );
}
