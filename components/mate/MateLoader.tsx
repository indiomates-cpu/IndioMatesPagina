'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MateLlenado } from './MateLlenado';
import { NOMBRE_NEGOCIO } from '@/lib/constants';

// Loader inicial breve con temática matera. Se muestra una sola vez por sesión
// y se puede saltar tocando la pantalla.
//
// Las animaciones de ENTRADA van por CSS (siempre corren, a diferencia de las
// de montaje de framer, que no son confiables en este stack). framer se usa
// sólo para el fundido de SALIDA (presencia), que sí funciona.
const DURACION_MS = 2100;
const DURACION_REDUCIDA_MS = 900;

export function MateLoader() {
  // Arranca en `true` para que el SSR ya renderice el loader y cubra la
  // pantalla desde el primer frame (sin flash del sitio). En visitas donde ya
  // se mostró, un script bloqueante + CSS (.loader-oculto) lo ocultan al
  // instante, y este efecto lo desmonta.
  const [visible, setVisible] = useState(true);
  const reducirMovimiento = useReducedMotion();

  function cerrar() {
    setVisible(false);
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
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(
      cerrar,
      reducirMovimiento ? DURACION_REDUCIDA_MS : DURACION_MS
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bloquea el scroll de fondo mientras el loader está visible.
  useEffect(() => {
    if (!visible) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mate-loader"
          role="status"
          aria-label={`Cargando ${NOMBRE_NEGOCIO}`}
          onClick={cerrar}
          className="mate-loader fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#f4f4f2] text-tinta"
          style={{
            backgroundImage:
              'linear-gradient(rgb(10 10 10 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(10 10 10 / 0.045) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="ml-escena flex w-full flex-col items-center">
            {/* El termo ceba el mate, con la yerba de la marca al lado. */}
            <MateLlenado className="w-[min(94vw,660px)]" />

            <p
              className="animate-entrada mt-3 font-display text-lg uppercase tracking-[0.3em] sm:text-xl"
              style={{ animationDelay: '400ms' }}
            >
              {NOMBRE_NEGOCIO}
            </p>

            {/* Línea que se extiende */}
            <span
              className="mt-4 block h-px animate-crecer bg-tinta/30"
              style={{ width: 120, transformOrigin: 'center', animationDelay: '550ms' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
