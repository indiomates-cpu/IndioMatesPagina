// Feedback instantáneo al navegar: la tienda se renderiza dinámica en el
// servidor (consulta la base en cada request), así que sin esto cada tap de
// navegación dejaba la página vieja congelada hasta que llegaba la respuesta
// y la nueva aparecía de golpe. Un esqueleto liviano y monocromático mantiene
// la sensación de fluidez mientras carga la página real.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-tinta/10" />
      <div className="mt-3 h-4 w-36 animate-pulse rounded bg-tinta/5" />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="aspect-square rounded-2xl bg-tinta/5" />
            <div className="mt-3 h-4 w-3/4 rounded bg-tinta/5" />
            <div className="mt-2 h-4 w-1/3 rounded bg-tinta/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
