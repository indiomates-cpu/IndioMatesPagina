// Capa decorativa del loader: símbolos patrios argentinos en blanco y
// celeste sobre el fondo oscuro. Soles de mayo que giran, escarapelas que
// flotan y estrellas que titilan (todo CSS, ver globals.css).
const CELESTE = '#74ACDF';

function SolDeMayo({
  x,
  y,
  radio,
  color,
  opacidad,
  duracion,
}: {
  x: number;
  y: number;
  radio: number;
  color: string;
  opacidad: number;
  duracion: string;
}) {
  const rayos = Array.from({ length: 16 }, (_, i) => {
    const angulo = (i * Math.PI * 2) / 16;
    // Alterna rayos largos y cortos, como el sol de la bandera.
    const largo = i % 2 === 0 ? radio * 1.95 : radio * 1.55;
    return {
      x1: Math.cos(angulo) * radio * 1.18,
      y1: Math.sin(angulo) * radio * 1.18,
      x2: Math.cos(angulo) * largo,
      y2: Math.sin(angulo) * largo,
    };
  });

  return (
    // El grupo externo posiciona; el interno gira (la animación CSS de
    // transform pisaría el translate si fueran el mismo elemento).
    <g transform={`translate(${x} ${y})`} stroke={color} opacity={opacidad} fill="none">
      <g className="ml-girar" style={{ animationDuration: duracion }}>
        <circle r={radio} strokeWidth="2.5" />
        {rayos.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeWidth="2" />
        ))}
      </g>
    </g>
  );
}

function Escarapela({
  x,
  y,
  escala,
  retraso,
}: {
  x: number;
  y: number;
  escala: number;
  retraso: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill="none">
      <g className="ml-flotar" style={{ animationDelay: retraso }}>
        <circle r="16" stroke={CELESTE} strokeWidth="5" opacity="0.35" />
        <circle r="9" stroke="#ffffff" strokeWidth="4.5" opacity="0.3" />
        <circle r="3.2" fill={CELESTE} opacity="0.45" />
      </g>
    </g>
  );
}

function Estrella({
  x,
  y,
  escala,
  color,
  retraso,
}: {
  x: number;
  y: number;
  escala: number;
  color: string;
  retraso: string;
}) {
  return (
    <path
      className="ml-titilar"
      style={{ animationDelay: retraso }}
      transform={`translate(${x} ${y}) scale(${escala})`}
      d="M 0,-6 L 1.6,-1.6 L 6,0 L 1.6,1.6 L 0,6 L -1.6,1.6 L -6,0 L -1.6,-1.6 Z"
      fill={color}
    />
  );
}

export function SimbolosPatrios() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soles de mayo */}
      <SolDeMayo x={165} y={150} radio={46} color={CELESTE} opacidad={0.3} duracion="34s" />
      <SolDeMayo x={1290} y={620} radio={34} color="#ffffff" opacidad={0.18} duracion="46s" />
      <SolDeMayo x={1230} y={130} radio={22} color={CELESTE} opacidad={0.24} duracion="28s" />

      {/* Escarapelas */}
      <Escarapela x={260} y={610} escala={1.15} retraso="0s" />
      <Escarapela x={1090} y={330} escala={0.8} retraso="-1.6s" />
      <Escarapela x={620} y={95} escala={0.9} retraso="-2.8s" />

      {/* Estrellas */}
      <Estrella x={420} y={210} escala={1} color={CELESTE} retraso="0s" />
      <Estrella x={950} y={140} escala={0.7} color="#ffffff" retraso="-0.9s" />
      <Estrella x={130} y={420} escala={0.8} color="#ffffff" retraso="-1.7s" />
      <Estrella x={1350} y={390} escala={1.1} color={CELESTE} retraso="-0.5s" />
      <Estrella x={760} y={640} escala={0.75} color={CELESTE} retraso="-2.1s" />
      <Estrella x={490} y={700} escala={0.9} color="#ffffff" retraso="-1.2s" />
      <Estrella x={1140} y={720} escala={0.7} color="#ffffff" retraso="-0.3s" />
      <Estrella x={90} y={700} escala={0.85} color={CELESTE} retraso="-2.5s" />
    </svg>
  );
}
