import { cn } from '@/lib/utils';

// Escena del loader (calcada de la referencia de la marca): el termo grande
// inclinado ceba un chorro curvo de agua sobre el mate terminado (con
// bombilla, yerba y sol de mayo), con la bolsa de yerba al costado. Cada
// elemento entra animado por CSS (las animaciones de montaje de framer no
// son confiables en este stack).
export function MateLlenado({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 300"
      className={cn('h-auto w-full', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bolsa de yerba (derecha): entra deslizándose desde la derecha. */}
      <g className="ml-bolsa-entra">
        <image
          href="/yerba.png"
          x="272"
          y="64"
          width="225"
          height="225"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Mate terminado (centro): aparece con un rebote desde abajo. */}
      <g className="ml-mate-entra">
        <image
          href="/mate-terminado.png"
          x="218"
          y="80"
          width="115"
          height="181"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Chorro de agua (celeste): curva desde el pico del termo hasta la
          yerba del mate. Se dibuja con stroke-dash (ver .ml-chorro). */}
      <path
        className="ml-chorro"
        pathLength="100"
        d="M 225,105 C 229,124 244,140 251,157"
        fill="none"
        stroke="rgb(125 195 240 / 0.95)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* Gotas que salpican donde cae el chorro. */}
      <g fill="rgb(125 195 240 / 0.9)">
        <circle className="ml-gota" cx="245" cy="156" r="1.9" style={{ animationDelay: '1s' }} />
        <circle className="ml-gota" cx="254" cy="154" r="1.4" style={{ animationDelay: '1.25s' }} />
      </g>

      {/* Vapor que sube del mate recién cebado. */}
      <g
        stroke="rgb(255 255 255 / 0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path
          className="ml-vapor"
          d="M 265,146 c -3,-5 3,-7 0,-13"
          style={{ animationDelay: '1.1s' }}
        />
        <path
          className="ml-vapor"
          d="M 274,143 c -3,-4 3,-6 0,-11"
          style={{ animationDelay: '1.4s' }}
        />
      </g>

      {/* Termo: acostado vertiendo desde el pico, manija hacia arriba como en
          la referencia. Entra desde arriba-izquierda; el grupo del medio ancla
          el pico en (225,105) y el interno hace el vaivén de cebado sin
          pisarlo. El pico del PNG está en (fx 0.505, fy 0.125) => offsets
          -66 / -24 con 130x195. */}
      <g className="ml-termo-entra">
        <g transform="translate(225 105) rotate(106)">
          <g className="ml-verter" style={{ transformOrigin: '50% 0%' }}>
            <image
              href="/termo.png"
              x="-66"
              y="-24"
              width="130"
              height="195"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
