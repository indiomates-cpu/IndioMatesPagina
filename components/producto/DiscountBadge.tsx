// Badge "-X%" para productos con descuento. Mismo lenguaje visual que
// StockBadge (pill monocromática), pero siempre en negro sólido para
// destacar la oferta sin competir con el badge de stock.
export function DiscountBadge({
  porcentaje,
  className,
}: {
  porcentaje: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-tinta px-2.5 py-1 text-xs font-semibold text-papel ${className ?? ''}`}
    >
      -{porcentaje}%
    </span>
  );
}
