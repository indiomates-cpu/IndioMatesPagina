import { cn } from '@/lib/utils';

// Ícono SVG de un mate con bombilla, monocromático. Hereda el color con
// `currentColor`, así que se adapta a fondo blanco o negro.
export function MateIcono({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
    >
      {/* Bombilla */}
      <path
        d="M41 12 L52 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="53" cy="5.5" r="2.6" fill="currentColor" />
      {/* Cuerpo del mate (calabaza) */}
      <path
        d="M32 20
           c-9 0 -15 6 -15 17
           c0 11 7 19 15 19
           c8 0 15 -8 15 -19
           c0 -11 -6 -17 -15 -17 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Borde superior / boca del mate */}
      <ellipse
        cx="32"
        cy="21"
        rx="12"
        ry="4"
        stroke="currentColor"
        strokeWidth="3"
      />
      {/* Yerba insinuada */}
      <path
        d="M24 22 q8 5 16 0"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
