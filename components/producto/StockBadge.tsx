import { calcularEstadoStock, etiquetaStock } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Muestra el estado de stock según la lógica de negocio:
//  - 0            -> "Sin stock"
//  - 1..UMBRAL    -> "¡Últimas X unidades!" / "¡Última unidad!" si X=1 (destacado)
//  - > UMBRAL     -> "Stock: X unidades"
export function StockBadge({
  stock,
  className,
}: {
  stock: number;
  className?: string;
}) {
  const estado = calcularEstadoStock(stock);

  const estilos: Record<typeof estado, string> = {
    sin_stock: 'bg-tinta/5 text-tinta/50 border-tinta/10',
    bajo: 'bg-tinta text-papel border-tinta',
    disponible: 'bg-papel text-tinta/70 border-tinta/15',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        estilos[estado],
        className
      )}
    >
      {estado === 'bajo' && (
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-papel" />
      )}
      {etiquetaStock(stock)}
    </span>
  );
}
