import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';
import './globals.css';
import { NOMBRE_NEGOCIO } from '@/lib/constants';
import { ProveedorMotion } from '@/components/ui/ProveedorMotion';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Serif elegante para la marca en el loader (combina con el logo IM).
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-marca',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: NOMBRE_NEGOCIO,
    template: `%s · ${NOMBRE_NEGOCIO}`,
  },
  description:
    'Yerberas, bombillas, mates, termos y accesorios. Elegí tus productos y coordiná tu pedido por WhatsApp.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
      // El script de abajo puede agregar .loader-oculto ANTES de hidratar;
      // sin esto React marca la diferencia de className como error en consola.
      suppressHydrationWarning
      // Le avisa a Next que el smooth scroll es intencional: así fuerza scroll
      // instantáneo al navegar (sin la animación de "subir hasta arriba") y
      // el suave queda sólo para anclas como #categorias.
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-papel font-sans text-tinta antialiased">
        {/* Se ejecuta antes del primer pintado:
            - .anim habilita las animaciones de entrada (sin JS el contenido se
              muestra directo; con JS, se anima). Va primero e incondicional.
            - loader-oculto: si el loader ya se mostró en esta sesión, lo oculta
              al instante (evita ver un frame del sitio antes de la carga). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){document.documentElement.classList.add('anim');try{if(sessionStorage.getItem('indio-loader-visto'))document.documentElement.classList.add('loader-oculto')}catch(e){}})()",
          }}
        />
        <ProveedorMotion>{children}</ProveedorMotion>
      </body>
    </html>
  );
}
