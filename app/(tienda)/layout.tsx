import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MateLoader } from '@/components/mate/MateLoader';

// La tienda consulta la base en cada request, así que se renderiza dinámica.
export const dynamic = 'force-dynamic';

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MateLoader />
      <Header />
      <CartDrawer />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
