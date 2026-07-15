'use client';

import Script from 'next/script';

// Carga el tag de Google Analytics 4 (gtag.js) sólo si hay un Measurement ID
// configurado. Se monta en el layout de la tienda (no en el admin), para no
// mezclar las visitas del dueño del negocio con las de los clientes.
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
