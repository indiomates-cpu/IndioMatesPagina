import { cn } from '@/lib/utils';

// Escena del loader (calcada de la referencia de la marca): el termo grande
// inclinado ceba un chorro curvo de agua sobre el mate terminado (con
// bombilla, yerba y sol de mayo), con la bolsa de yerba al costado. Cada
// elemento entra animado por CSS (las animaciones de montaje de framer no
// son confiables en este stack).
//
// Dos variantes: "ancha" (desktop, apaisada) y "alta" (mobile, vertical,
// con el termo más parado y la bolsa abajo para que todo se vea grande).
const ESCENAS = {
  ancha: {
    viewBox: '0 0 520 300',
    bolsa: { x: 272, y: 64, lado: 225 },
    mate: { x: 218, y: 80, w: 115, h: 181 },
    chorro: 'M 225,105 C 238,110 250,131 251,157',
    gotas: [
      { cx: 245, cy: 156, r: 1.9, retraso: '1s' },
      { cx: 254, cy: 154, r: 1.4, retraso: '1.25s' },
    ],
    vapores: [
      { d: 'M 265,146 c -3,-5 3,-7 0,-13', retraso: '1.1s' },
      { d: 'M 274,143 c -3,-4 3,-6 0,-11', retraso: '1.4s' },
    ],
    // El pico del PNG está en (fx 0.505, fy 0.125) del área dibujada.
    termo: { translate: '225 105', rotate: 106, w: 130, h: 195, ox: -66, oy: -24 },
  },
  alta: {
    viewBox: '0 0 360 470',
    bolsa: { x: 180, y: 245, lado: 220 },
    mate: { x: 114, y: 92, w: 150, h: 236 },
    chorro: 'M 140,130 C 152,137 160,165 162,192',
    gotas: [
      { cx: 156, cy: 190, r: 2.2, retraso: '1s' },
      { cx: 167, cy: 188, r: 1.6, retraso: '1.25s' },
    ],
    vapores: [
      { d: 'M 186,178 c -3,-5 3,-7 0,-13', retraso: '1.1s' },
      { d: 'M 197,174 c -3,-4 3,-6 0,-11', retraso: '1.4s' },
    ],
    // Más parado (135°) para que el cuerpo no se salga por la izquierda.
    termo: { translate: '140 130', rotate: 135, w: 100, h: 150, ox: -50, oy: -19 },
  },
} as const;

export function MateLlenado({
  className,
  variante = 'ancha',
}: {
  className?: string;
  variante?: keyof typeof ESCENAS;
}) {
  const e = ESCENAS[variante];

  return (
    <svg
      viewBox={e.viewBox}
      className={cn('h-auto w-full', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bolsa de yerba: entra deslizándose desde la derecha. */}
      <g className="ml-bolsa-entra">
        <image
          href="/yerba.png"
          x={e.bolsa.x}
          y={e.bolsa.y}
          width={e.bolsa.lado}
          height={e.bolsa.lado}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Mate terminado: aparece con un rebote desde abajo. */}
      <g className="ml-mate-entra">
        <image
          href="/mate-terminado.png"
          x={e.mate.x}
          y={e.mate.y}
          width={e.mate.w}
          height={e.mate.h}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Chorro de agua (celeste): sale del pico siguiendo su dirección y cae
          en arco por gravedad hasta la yerba. Se dibuja con stroke-dash. */}
      <path
        className="ml-chorro"
        pathLength="100"
        d={e.chorro}
        fill="none"
        stroke="rgb(125 195 240 / 0.95)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* Gotas que salpican donde cae el chorro. */}
      <g fill="rgb(125 195 240 / 0.9)">
        {e.gotas.map((g, i) => (
          <circle
            key={i}
            className="ml-gota"
            cx={g.cx}
            cy={g.cy}
            r={g.r}
            style={{ animationDelay: g.retraso }}
          />
        ))}
      </g>

      {/* Vapor que sube del mate recién cebado. */}
      <g
        stroke="rgb(255 255 255 / 0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        {e.vapores.map((v, i) => (
          <path
            key={i}
            className="ml-vapor"
            d={v.d}
            style={{ animationDelay: v.retraso }}
          />
        ))}
      </g>

      {/* Termo: acostado vertiendo desde el pico, manija hacia arriba. Entra
          desde arriba-izquierda; el grupo del medio ancla el pico y el interno
          hace el vaivén de cebado sin pisarlo. */}
      <g className="ml-termo-entra">
        <g transform={`translate(${e.termo.translate}) rotate(${e.termo.rotate})`}>
          <g className="ml-verter" style={{ transformOrigin: '50% 0%' }}>
            <image
              href="/termo.png"
              x={e.termo.ox}
              y={e.termo.oy}
              width={e.termo.w}
              height={e.termo.h}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
