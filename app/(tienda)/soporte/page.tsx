import type { Metadata } from 'next';
import { construirLinkWhatsApp } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Soporte',
  description:
    'Consultas sobre pedidos, stock, envíos o pagos. Te respondemos por WhatsApp.',
};

const FAQS = [
  {
    pregunta: '¿Cómo hago un pedido?',
    respuesta:
      'Elegís tus productos y los agregás al carrito. Al confirmar, te llevamos a WhatsApp con el detalle del pedido ya armado para coordinar el pago y la entrega.',
  },
  {
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta:
      'No procesamos pagos online: el medio de pago se coordina directamente por WhatsApp al confirmar tu pedido, según lo que tengas disponible.',
  },
  {
    pregunta: '¿Hacen envíos o hay que retirar?',
    respuesta:
      'La forma de entrega (envío o retiro) se coordina por WhatsApp una vez confirmado el pedido, según tu ubicación.',
  },
  {
    pregunta: '¿Cómo sé si un producto tiene stock?',
    respuesta:
      'Cada producto muestra su disponibilidad exacta: "Sin stock" si no queda, un aviso destacado si quedan pocas unidades, o la cantidad exacta disponible.',
  },
  {
    pregunta: '¿Puedo modificar las cantidades en el carrito?',
    respuesta:
      'Sí. Desde el carrito podés sumar, restar o quitar productos en cualquier momento antes de confirmar el pedido.',
  },
  {
    pregunta: '¿Qué pasa si no se abre WhatsApp al confirmar?',
    respuesta:
      'En la pantalla de confirmación vas a encontrar un botón para reabrir el enlace de WhatsApp manualmente, por si el navegador bloqueó la ventana emergente.',
  },
];

export default function SoportePage() {
  const linkSoporte = construirLinkWhatsApp(
    '¡Hola Indio Mates! 🧉 Tengo una consulta:\n\n',
    { alternar: true }
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <header className="text-center">
        <h1 className="animate-entrada font-display text-3xl font-bold sm:text-4xl">
          Soporte
        </h1>
        <p
          className="animate-entrada mx-auto mt-2 max-w-md text-tinta/60"
          style={{ animationDelay: '80ms' }}
        >
          ¿Tenés dudas sobre un pedido, un producto o el envío? Escribinos y
          te respondemos por WhatsApp.
        </p>
      </header>

      {/* CTA de contacto directo */}
      <div
        className="animate-entrada mt-10 flex flex-col items-center gap-4 rounded-2xl border border-tinta/10 bg-papel-hueso p-8 text-center"
        style={{ animationDelay: '140ms' }}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tinta text-papel">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.9.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
          </svg>
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">
            Hablemos por WhatsApp
          </h2>
          <p className="mt-1 max-w-sm text-sm text-tinta/60">
            Es nuestro único canal de atención: rápido, directo y sin
            formularios de por medio.
          </p>
        </div>
        <a
          href={linkSoporte}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-tinta px-6 py-3.5 font-medium text-papel transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-tinta-suave hover:shadow-flotante active:translate-y-0 active:scale-[0.97] active:shadow-none"
        >
          Escribir por WhatsApp
        </a>
      </div>

      {/* Preguntas frecuentes */}
      <div className="mt-14">
        <h2
          className="animate-entrada mb-5 font-display text-xl font-bold"
          style={{ animationDelay: '180ms' }}
        >
          Preguntas frecuentes
        </h2>
        <div className="animate-entrada divide-y divide-tinta/10 overflow-hidden rounded-2xl border border-tinta/10 bg-papel" style={{ animationDelay: '220ms' }}>
          {FAQS.map((faq) => (
            <details key={faq.pregunta} className="group">
              <summary className="presionable flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium marker:content-none hover:bg-tinta/[0.03] sm:text-base">
                {faq.pregunta}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 flex-shrink-0 text-tinta/40 transition-transform duration-300 ease-premium group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-tinta/60">
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
