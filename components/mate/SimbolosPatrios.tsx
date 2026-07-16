// Capa decorativa del loader: íconos argentinos (los PNG "pantalla-N" de
// public/) repartidos por los bordes sobre el fondo oscuro. El sol y la
// pelota giran, el resto flota (todo CSS, ver globals.css). Cada ítem anida
// dos grupos: el externo posiciona y el interno anima (la animación CSS de
// transform pisaría el translate si fueran el mismo elemento).
function Icono({
  href,
  x,
  y,
  ancho,
  alto,
  opacidad,
  animacion,
  duracion,
  retraso,
}: {
  href: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
  opacidad: number;
  animacion: 'ml-girar' | 'ml-flotar';
  duracion?: string;
  retraso?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacidad}>
      <g
        className={animacion}
        style={{ animationDuration: duracion, animationDelay: retraso }}
      >
        <image
          href={href}
          x={-ancho / 2}
          y={-alto / 2}
          width={ancho}
          height={alto}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </g>
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
      {/* Sol de mayo girando (arriba izquierda). */}
      <Icono href="/pantalla-4.png" x={125} y={115} ancho={150} alto={150} opacidad={0.5} animacion="ml-girar" duracion="42s" />
      {/* Maradona (izquierda). */}
      <Icono href="/pantalla-2.png" x={115} y={500} ancho={170} alto={170} opacidad={0.55} animacion="ml-flotar" retraso="-1.2s" />
      {/* Pelota Tango rodando (abajo a la izquierda). */}
      <Icono href="/pantalla-1.png" x={300} y={705} ancho={130} alto={113} opacidad={0.5} animacion="ml-girar" duracion="24s" />
      {/* Medialunas (arriba, al centro). */}
      <Icono href="/pantalla-6.png" x={725} y={75} ancho={125} alto={80} opacidad={0.5} animacion="ml-flotar" retraso="-2.6s" />
      {/* Messi con la Copa (derecha arriba). */}
      <Icono href="/pantalla-3.png" x={1320} y={165} ancho={175} alto={140} opacidad={0.55} animacion="ml-flotar" retraso="-0.6s" />
      {/* Malvinas (derecha abajo). */}
      <Icono href="/pantalla-5.png" x={1305} y={675} ancho={195} alto={159} opacidad={0.5} animacion="ml-flotar" retraso="-3.4s" />
    </svg>
  );
}
