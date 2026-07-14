import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MateLoader } from '@/components/mate/MateLoader';
import { obtenerCategorias } from '@/lib/queries';

// La tienda consulta la base en cada request, así que se renderiza dinámica.
export const dynamic = 'force-dynamic';

export default async function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categorias = await obtenerCategorias();

  return (
    <>
      <MateLoader />
      <Header categorias={categorias} />
      <CartDrawer />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
