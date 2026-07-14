import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
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

export const metadata: Metadata = {
  title: {
    default: `${NOMBRE_NEGOCIO} — Mates, bombillas y accesorios`,
    template: `%s · ${NOMBRE_NEGOCIO}`,
  },
  description:
    'Yerberas, bombillas, mates, termos y accesorios. Elegí tus productos y coordiná tu pedido por WhatsApp.',
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
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-papel font-sans text-tinta antialiased">
        <ProveedorMotion>{children}</ProveedorMotion>
      </body>
    </html>
  );
}
