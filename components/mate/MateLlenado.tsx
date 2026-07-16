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
          {/* Agua celeste con brillo de superficie arriba. El degradado va con
              el rect, así el brillo marca el nivel a medida que sube. */}
          <stop offset="0%" stopColor="rgb(224 244 253 / 0.85)" />
          <stop offset="5%" stopColor="rgb(74 168 221 / 0.7)" />
          <stop offset="100%" stopColor="rgb(46 133 190 / 0.55)" />
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

      {/* Bombilla (PNG): la punta con filtro va en la boca del mate y el pico
          apunta a la derecha para no cruzar el chorro. */}
      <g transform="translate(132 164) rotate(24)">
        <image
          href="/bombilla.png"
          x="-78"
          y="-128"
          width="150"
          height="150"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Chorro de agua (celeste) cayendo del pico del termo a la boca. El
          pico cae en ~(121,110); el chorro arranca ahí y baja a la boca. */}
      <rect
        className="ml-chorro"
        x="119"
        y="111"
        width="4"
        height="55"
        rx="2"
        fill="rgb(120 205 240 / 0.95)"
      />

      {/* Termo (PNG): inclinado sobre el mate, con el pico apuntando a la boca
          para verter. El grupo externo lo posiciona/inclina; el interno hace el
          vaivén (pivotando en el pico) sin pisar el transform de posición. */}
      <g transform="translate(112 116) rotate(122)">
        <g className="ml-verter" style={{ transformOrigin: '50% 0%' }}>
          <image
            href="/termo.png"
            x="-52"
            y="-14"
            width="104"
            height="156"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </svg>
  );
}
