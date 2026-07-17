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
    >
      <body className="min-h-screen bg-papel font-sans text-tinta antialiased">
        {/* Se ejecuta antes del primer pintado: si el loader ya se mostró en
            esta sesión, lo oculta al instante (evita ver un frame del sitio
            antes de que aparezca la pantalla de carga en la primera visita). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(sessionStorage.getItem('indio-loader-visto'))document.documentElement.classList.add('loader-oculto')}catch(e){}})()",
          }}
        />
        <ProveedorMotion>{children}</ProveedorMotion>
      </body>
    </html>
  );
}
