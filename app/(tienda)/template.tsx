import { TransicionPagina } from '@/components/ui/TransicionPagina';

// Anima la entrada del contenido en cada navegación de la tienda.
// El Header, el Footer y el carrito viven en el layout, así que persisten.
export default function Template({ children }: { children: React.ReactNode }) {
  return <TransicionPagina>{children}</TransicionPagina>;
}
