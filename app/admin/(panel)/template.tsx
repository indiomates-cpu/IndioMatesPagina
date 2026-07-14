import { TransicionPagina } from '@/components/ui/TransicionPagina';

// Transición sutil entre secciones del panel (la barra lateral persiste).
export default function Template({ children }: { children: React.ReactNode }) {
  return <TransicionPagina sutil>{children}</TransicionPagina>;
}
