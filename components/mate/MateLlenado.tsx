import { cn } from '@/lib/utils';

// Escena del loader (calcada de la referencia de la marca): el termo grande
// inclinado ceba un chorro curvo de agua sobre el mate terminado (con
// bombilla y yerba), con la bolsa de yerba al costado. Compuesta con los PNG
// reales de public/ + animaciones CSS (las de montaje de framer no son
// confiables en este stack).
export function MateLlenado({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 300"
      className={cn('h-auto w-full', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bolsa de yerba (derecha). */}
      <image
        href="/yerba.png"
        x="272"
        y="64"
        width="225"
        height="225"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Mate terminado, con bombilla y yerba (centro). */}
      <image
        href="/mate-terminado.png"
        x="218"
        y="80"
        width="115"
        height="181"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Chorro de agua (celeste): curva desde el pico del termo hasta la
          yerba del mate. Se dibuja con stroke-dash (ver .ml-chorro). */}
      <path
        className="ml-chorro"
        pathLength="100"
        d="M 225,105 C 229,124 244,140 251,157"
        fill="none"
        stroke="rgb(140 190 235 / 0.9)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Termo: espejado y rotado para quedar acostado vertiendo desde el
          pico, como en la referencia (cuerpo hacia arriba-izquierda, manija
          arriba). El grupo externo ancla el pico en (225,105); el interno hace
          el vaivén de cebado sin pisarlo. El pico del PNG está en
          (fx 0.505, fy 0.125) => offsets -66 / -24 con 130x195. */}
      <g transform="translate(225 105) rotate(106) scale(-1 1)">
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
    </svg>
  );
}
