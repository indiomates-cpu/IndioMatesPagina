'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MateIcono } from './MateIcono';
import { MateAnimado } from './MateAnimado';
import { NOMBRE_NEGOCIO } from '@/lib/constants';
import { EASE_PREMIUM } from '@/lib/motion';

// Loader inicial: la "ceremonia del mate". Capas de movimiento superpuestas
// (halos que derivan, partículas de yerba, vapor, un arco de luz orbitando y
// el mate dibujándose a mano) coreografiadas en una sola secuencia.
// Se muestra sólo una vez por sesión y se puede saltar con un toque.
// Todas las animaciones usan transform/opacity (aptas para GPU).

// --- Tiempos de la coreografía (segundos desde la aparición) ---
const T_MATE = 0.3; // el mate empieza a dibujarse
const T_TEXTO = 1.05; // arranca la tipografía
const T_LINEA = 1.5; // se extiende la línea con brillo
const T_VAPOR = 1.5; // empieza a subir el vapor
const DURACION_MS = 3000; // permanencia total antes de la salida
const DURACION_REDUCIDA_MS = 1300; // versión con movimiento reducido

interface Particula {
  id: number;
  x: number; // posición horizontal en %
  tam: number; // tamaño en px
  retraso: number; // delay en s
  duracion: number; // duración del ciclo en s
  deriva: number; // desvío horizontal en px
  esHoja: boolean; // hojita cuadrada vs. polvo redondo
}

// Partículas de yerba pseudo-aleatorias pero deterministas (sin Math.random,
// así el render es estable). Se dispersan con el ángulo áureo.
function generarParticulas(cantidad: number): Particula[] {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i,
    x: (i * 137.5 + 8) % 100,
    tam: 2 + ((i * 7) % 4),
    retraso: (i % 9) * 0.3,
    duracion: 6 + (i % 5) * 1.6,
    deriva: (i % 2 === 0 ? 1 : -1) * (8 + ((i * 13) % 20)),
    esHoja: i % 3 === 0,
  }));
}

export function MateLoader() {
  const [visible, setVisible] = useState(false);
  const reducirMovimiento = useReducedMotion();
  const particulas = useMemo(() => generarParticulas(18), []);

  // Letras de la marca para la revelación tipográfica (los espacios se
  // conservan como separación entre palabras).
  const palabras = useMemo(() => NOMBRE_NEGOCIO.split(' '), []);
  let indiceLetra = 0;

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
    if (yaVisto) return;

    setVisible(true);
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-tinta text-papel"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
        >
          {reducirMovimiento ? (
            // Versión serena para quienes prefieren menos movimiento:
            // sólo un fundido, sin partículas ni desplazamientos.
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MateIcono className="h-24 w-24" />
              <p className="mt-8 font-display text-lg uppercase tracking-[0.3em]">
                {NOMBRE_NEGOCIO}
              </p>
            </motion.div>
          ) : (
            <>
              {/* ---- Capas de fondo (ambiente) ---- */}

              {/* Halos de luz que derivan lentamente */}
              <div
                aria-hidden
                className="absolute -left-1/4 -top-1/4 h-[70vmax] w-[70vmax] rounded-full animate-deriva"
                style={{
                  background:
                    'radial-gradient(circle at center, rgb(255 255 255 / 0.055), transparent 60%)',
                }}
              />
              <div
                aria-hidden
                className="absolute -bottom-1/3 -right-1/4 h-[80vmax] w-[80vmax] rounded-full animate-deriva-lenta"
                style={{
                  background:
                    'radial-gradient(circle at center, rgb(255 255 255 / 0.04), transparent 65%)',
                }}
              />

              {/* Textura de puntos (la misma trama del hero) */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              />

              {/* Viñeta para dar profundidad */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 45%, rgb(10 10 10 / 0.8) 100%)',
                }}
              />

              {/* Partículas de yerba flotando */}
              <div aria-hidden className="absolute inset-0 overflow-hidden">
                {particulas.map((p) => (
                  <motion.span
                    key={p.id}
                    className={
                      p.esHoja
                        ? 'absolute rounded-[1px] bg-papel'
                        : 'absolute rounded-full bg-papel'
                    }
                    style={{
                      left: `${p.x}%`,
                      bottom: '-3%',
                      width: p.tam,
                      height: p.tam,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      y: ['0vh', '-56vh'],
                      x: [0, p.deriva, -p.deriva * 0.4, p.deriva * 0.7],
                      rotate: p.esHoja ? [0, 200] : 0,
                      opacity: [0, 0.55, 0.45, 0],
                    }}
                    transition={{
                      duration: p.duracion,
                      delay: p.retraso,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>

              {/* ---- Composición central ---- */}
              <motion.div
                className="relative flex flex-col items-center"
                exit={{
                  opacity: 0,
                  y: -26,
                  scale: 1.04,
                  filter: 'blur(6px)',
                }}
                transition={{ duration: 0.55, ease: EASE_PREMIUM }}
              >
                <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
                  {/* Aro exterior */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-papel/10"
                    initial={{ scale: 0.82, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.1 }}
                  />
                  {/* Reflejo de luz orbitando el aro */}
                  <motion.div
                    aria-hidden
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <div className="aro-luz h-full w-full rounded-full animate-girar-lento" />
                  </motion.div>
                  {/* Resplandor que respira detrás del mate */}
                  <motion.div
                    aria-hidden
                    className="absolute inset-6 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgb(255 255 255 / 0.1), transparent 70%)',
                    }}
                    animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.06, 1] }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Mate dibujándose, con flotación orgánica al terminar */}
                  <motion.div
                    initial={{ y: 12, opacity: 0, scale: 0.92 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      delay: T_MATE,
                      duration: 0.8,
                      ease: EASE_PREMIUM,
                    }}
                  >
                    <motion.div
                      className="relative"
                      animate={{ y: [0, -5, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.8,
                      }}
                    >
                      {/* Vapor orgánico saliendo de la boca del mate */}
                      <div
                        aria-hidden
                        className="absolute -top-7 left-1/2 flex -translate-x-1/2 gap-2"
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="block w-1.5 rounded-full"
                            style={{
                              height: 24,
                              background:
                                'radial-gradient(ellipse at center, rgb(255 255 255 / 0.55), transparent 72%)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.7, 0],
                              y: [6, -32],
                              x: [0, i === 1 ? -5 : 6, i === 1 ? 4 : -4],
                              scaleX: [1, 1.7],
                              scaleY: [0.8, 1.35],
                            }}
                            transition={{
                              duration: 2.6 + i * 0.45,
                              repeat: Infinity,
                              delay: T_VAPOR + i * 0.55,
                              ease: 'easeInOut',
                            }}
                          />
                        ))}
                      </div>

                      <MateAnimado
                        className="h-24 w-24 sm:h-28 sm:w-28"
                        delay={T_MATE + 0.15}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Marca: revelación letra por letra con desenfoque */}
                <p
                  className="mt-9 flex gap-[0.6em] font-display text-lg uppercase tracking-[0.3em] sm:text-xl"
                  aria-label={NOMBRE_NEGOCIO}
                >
                  {palabras.map((palabra, pi) => (
                    <span key={pi} aria-hidden className="flex">
                      {palabra.split('').map((letra, li) => {
                        const orden = indiceLetra++;
                        return (
                          <motion.span
                            key={li}
                            className="inline-block"
                            initial={{
                              opacity: 0,
                              y: 20,
                              filter: 'blur(10px)',
                            }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                              delay: T_TEXTO + orden * 0.05,
                              duration: 0.6,
                              ease: EASE_PREMIUM,
                            }}
                          >
                            {letra}
                          </motion.span>
                        );
                      })}
                    </span>
                  ))}
                </p>

                {/* Línea que se extiende con un brillo que la recorre */}
                <motion.div
                  className="relative mt-4 h-px w-[150px] overflow-hidden bg-papel/15"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    delay: T_LINEA,
                    duration: 0.7,
                    ease: EASE_PREMIUM,
                  }}
                >
                  <span
                    className="absolute inset-y-0 w-1/3 animate-brillo bg-gradient-to-r from-transparent via-papel/80 to-transparent"
                    style={{ animationDelay: `${T_LINEA + 0.4}s` }}
                  />
                </motion.div>

                {/* Lema, en eco del hero */}
                <motion.span
                  className="mt-4 text-[10px] uppercase tracking-[0.45em] text-papel/40"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.75, duration: 0.6, ease: EASE_PREMIUM }}
                >
                  Cultura matera argentina
                </motion.span>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
