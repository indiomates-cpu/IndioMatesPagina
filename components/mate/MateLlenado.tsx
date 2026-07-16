import { cn } from '@/lib/utils';

// Escena del loader: un termo inclinado vierte agua y el mate (con el logo2
// de la marca) se va llenando. Todo con SVG + animaciones CSS para que sea
// confiable (las animaciones de montaje de framer no lo son en este stack).
export function MateLlenado({ className }: { className?: string }) {
  const cuerpoMate =
    'M 88,166 C 76,180 72,208 72,232 C 72,268 100,288 130,288 C 160,288 188,268 188,232 C 188,208 184,180 172,166 Z';

  return (
    <svg
      viewBox="0 0 260 300"
      className={cn('h-64 w-64', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="ml-mate-clip">
          <path d={cuerpoMate} />
        </clipPath>
        <linearGradient id="ml-agua-grad" x1="0" y1="0" x2="0" y2="1">
          {/* Brillo de la superficie (arriba) + agua más oscura debajo. El
              degradado va con el rect, así el brillo marca el nivel al subir. */}
          <stop offset="0%" stopColor="rgb(255 255 255 / 0.5)" />
          <stop offset="4%" stopColor="rgb(10 10 10 / 0.42)" />
          <stop offset="100%" stopColor="rgb(10 10 10 / 0.24)" />
        </linearGradient>
      </defs>

      {/* Cuerpo del mate (blanco, para que el logo2 oscuro se vea sobre el
          fondo negro del loader). */}
      <path d={cuerpoMate} fill="#ffffff" />

      {/* Logo2 de la marca, sobre el mate y recortado a su forma. */}
      <image
        href="/logo2.png"
        x="80"
        y="176"
        width="100"
        height="100"
        clipPath="url(#ml-mate-clip)"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Agua que sube dentro del mate (se llena hasta ~3/4). */}
      <g clipPath="url(#ml-mate-clip)">
        <rect
          className="ml-agua"
          x="70"
          y="200"
          width="120"
          height="92"
          fill="url(#ml-agua-grad)"
        />
      </g>

      {/* Boca del mate + insinuación de la yerba. */}
      <ellipse
        cx="130"
        cy="166"
        rx="42"
        ry="10"
        fill="#ffffff"
        stroke="#0a0a0a"
        strokeWidth="3"
      />
      <path
        d="M 96,168 Q 130,180 164,168"
        stroke="#0a0a0a"
        strokeWidth="2.4"
        fill="none"
        opacity="0.4"
      />

      {/* Bombilla (doble trazo: blanco con borde negro, se ve sobre el fondo
          negro y sobre el mate blanco). */}
      <g strokeLinecap="round">
        <path d="M 150,172 L 104,120" stroke="#0a0a0a" strokeWidth="6.5" />
        <path d="M 150,172 L 104,120" stroke="#ffffff" strokeWidth="3.4" />
        <circle cx="104" cy="120" r="5" fill="#0a0a0a" />
        <circle cx="104" cy="120" r="2.8" fill="#ffffff" />
      </g>

      {/* Chorro de agua cayendo del pico del termo a la boca del mate. */}
      <rect
        className="ml-chorro"
        x="118"
        y="118"
        width="3.6"
        height="46"
        rx="1.8"
        fill="rgb(255 255 255 / 0.9)"
      />

      {/* Termo: el pico está fijo justo arriba de la boca del mate; el cuerpo
          sube hacia la derecha, inclinado para verter. */}
      <g transform="translate(120 116) rotate(46)">
        <g className="ml-verter">
          {/* Pico para verter (se angosta hacia el punto de vertido). */}
          <path d="M -8,-14 L 8,-14 L 3,-1 L -3,-1 Z" fill="#ffffff" />
          {/* Cuerpo */}
          <rect x="-16" y="-98" width="32" height="86" rx="10" fill="#ffffff" />
          {/* Tapa */}
          <rect x="-13" y="-114" width="26" height="18" rx="5" fill="#ffffff" />
          {/* Aro decorativo */}
          <rect
            x="-16"
            y="-80"
            width="32"
            height="3.5"
            fill="#0a0a0a"
            opacity="0.14"
          />
        </g>
      </g>
    </svg>
  );
}
