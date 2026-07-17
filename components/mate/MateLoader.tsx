'use client';

import { useEffect, useState } from 'react';
import { preload } from 'react-dom';
import { MateLlenado } from './MateLlenado';
import { SimbolosPatrios } from './SimbolosPatrios';
import { NOMBRE_NEGOCIO } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Loader inicial breve con temática matera. Se muestra una sola vez por sesión
// y se puede saltar tocando la pantalla.
//
// TODO el ciclo de vida va por CSS + timers, SIN framer-motion: en este stack
// (framer v11 + React 19) ni las animaciones de montaje ni las de salida de
// AnimatePresence corren de forma confiable. La salida por framer dejaba el
// overlay negro clavado en pantalla (opacity 1, z-100) tapando el sitio.
// El fundido de salida es una transición CSS de opacidad disparada por clase,
// y el desmontaje lo hace un timer: determinista y a prueba de framer.
const DURACION_MS = 2000;
const SALIDA_MS = 500;

type Fase = 'visible' | 'saliendo' | 'cerrado';

// Si el layout de la tienda se re-monta por una navegación cliente dentro de
// la misma carga (p. ej. ir al admin y volver), este flag hace que el loader
// arranque directamente cerrado: sin él se pintaba un frame de pantalla negra
// antes de que el efecto lo desmontara. En una carga nueva del documento el
// módulo se re-evalúa (flag en false) y el caso lo cubre el script inline.
let yaMostradoEnSesion = false;

export function MateLoader() {
  // Precarga de la escena y del fondo: la animación arranca apenas carga el
  // CSS, así que las imágenes tienen que llegar cuanto antes (sobre todo en
  // mobile). Sin la precarga, los íconos del fondo aparecían de golpe a
  // mitad de la animación cuando terminaban de bajar.
  preload('/mate-terminado.webp', { as: 'image', fetchPriority: 'high' });
  preload('/termo.webp', { as: 'image', fetchPriority: 'high' });
  preload('/yerba.webp', { as: 'image', fetchPriority: 'high' });
  preload('/pantalla-1.webp', { as: 'image' });
  preload('/pantalla-2.webp', { as: 'image' });
  preload('/pantalla-3.webp', { as: 'image' });
  preload('/pantalla-4.webp', { as: 'image' });
  preload('/pantalla-5.webp', { as: 'image' });
  preload('/pantalla-6.webp', { as: 'image' });

  // Arranca en `visible` para que el SSR ya renderice el loader y cubra la
  // pantalla desde el primer frame (sin flash del sitio). En visitas donde ya
  // se mostró, un script bloqueante + CSS (.loader-oculto) lo ocultan al
  // instante, y el efecto de abajo lo desmonta.
  const [fase, setFase] = useState<Fase>(() =>
    yaMostradoEnSesion ? 'cerrado' : 'visible'
  );

  function cerrar() {
    yaMostradoEnSesion = true;
    // Sólo desde `visible`: evita reiniciar el fundido si tocan la pantalla
    // cuando ya está saliendo.
    setFase((f) => (f === 'visible' ? 'saliendo' : f));
    try {
      window.sessionStorage.setItem('indio-loader-visto', '1');
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    let yaVisto = false;
    try {
      yaVisto = Boolean(window.sessionStorage.getItem('indio-loader-visto'));
    } catch {
      /* noop */
    }
    // Ya se mostró en esta sesión: desmontarlo (el CSS ya lo tenía oculto).
    if (yaVisto) {
      yaMostradoEnSesion = true;
      setFase('cerrado');
      return;
    }

    const timer = window.setTimeout(cerrar, DURACION_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `saliendo` → `cerrado` cuando termina la transición CSS de opacidad.
  useEffect(() => {
    if (fase !== 'saliendo') return;
    const timer = window.setTimeout(() => setFase('cerrado'), SALIDA_MS);
    return () => window.clearTimeout(timer);
  }, [fase]);

  // Bloquea el scroll de fondo mientras el loader está en pantalla.
  useEffect(() => {
    if (fase === 'cerrado') return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [fase]);

  if (fase === 'cerrado') return null;

  return (
    <div
      role="status"
      aria-label={`Cargando ${NOMBRE_NEGOCIO}`}
      onClick={cerrar}
      className={cn(
        'mate-loader fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-tinta text-papel transition-opacity duration-500 ease-out',
        // Al salir deja pasar los taps de inmediato: aunque algo interrumpa el
        // desmontaje, el overlay nunca bloquea la navegación.
        fase === 'saliendo' && 'pointer-events-none opacity-0'
      )}
    >
      {/* Fondo: íconos argentinos, con layout propio por tamaño. */}
      <SimbolosPatrios variante="ancha" className="hidden sm:block" />
      <SimbolosPatrios variante="alta" className="sm:hidden" />

      <div className="ml-escena relative flex w-full flex-col items-center">
        {/* El termo ceba el mate, con la yerba de la marca al lado. La
            escena apaisada se reacomoda en vertical en pantallas chicas. */}
        <MateLlenado
          variante="ancha"
          className="hidden w-[min(96vw,800px)] sm:block"
        />
        <MateLlenado
          variante="alta"
          className="w-[min(88vw,370px)] sm:hidden"
        />

        <p
          className="animate-entrada mt-3 font-marca text-2xl uppercase tracking-[0.32em] sm:text-4xl"
          style={{ animationDelay: '500ms' }}
        >
          {NOMBRE_NEGOCIO}
        </p>

        {/* Línea que se extiende */}
        <span
          className="mt-4 block h-px animate-crecer bg-papel/40"
          style={{ width: 150, transformOrigin: 'center', animationDelay: '650ms' }}
        />
      </div>
    </div>
  );
}
