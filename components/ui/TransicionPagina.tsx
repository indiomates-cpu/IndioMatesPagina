// Fundido suave y corto del contenido en cada navegación (se usa desde los
// template.tsx, que se remontan por ruta). Se hace con una animación CSS
// (animate-aparecer) y NO con framer-motion: las animaciones de montaje de
// framer no se disparan de forma confiable en este stack y podían dejar el
// contenido de la página invisible. El CSS siempre corre.
// `sutil` es la variante más rápida para el panel de administración.
export function TransicionPagina({
  children,
  sutil = false,
}: {
  children: React.ReactNode;
  sutil?: boolean;
}) {
  return (
    <div
      className="animate-aparecer"
      style={{ animationDuration: sutil ? '0.18s' : '0.24s' }}
    >
      {children}
    </div>
  );
}
