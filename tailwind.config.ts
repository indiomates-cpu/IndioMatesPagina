import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal blanco y negro. Se usan escalas de grises neutros
        // para jerarquía visual sin salir de la identidad monocromática.
        tinta: {
          DEFAULT: '#0a0a0a',
          suave: '#171717',
        },
        papel: {
          DEFAULT: '#ffffff',
          hueso: '#fafafa',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      transitionTimingFunction: {
        // Curva "premium": arranque rápido y frenado suave. Es la misma que
        // EASE_PREMIUM en lib/motion.ts — si se cambia una, cambiar la otra.
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        // Elevaciones monocromáticas para estados hover/press.
        'flotante-sm': '0 6px 16px -8px rgb(10 10 10 / 0.22)',
        flotante: '0 14px 34px -14px rgb(10 10 10 / 0.28)',
      },
      keyframes: {
        // Vapor que sube del mate.
        vapor: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '25%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-22px) scaleX(1.4)', opacity: '0' },
        },
        // Suave latido para micro-interacciones.
        latido: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        entrada: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Fundido de opacidad solo (sin transform): se combina con hovers de
        // framer sin pelear por la propiedad transform.
        aparecer: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // Sube desde abajo dentro de una máscara (para títulos con overflow).
        'subir-mascara': {
          from: { transform: 'translateY(110%)' },
          to: { transform: 'translateY(0)' },
        },
        // Deriva orgánica para halos y fondos (sólo transform: apto GPU).
        deriva: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(4%, -6%, 0) scale(1.08)' },
          '66%': { transform: 'translate3d(-5%, 4%, 0) scale(0.94)' },
        },
        // Flotación suave para elementos decorativos.
        flotar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        // Barrido de brillo (reflejo de luz) sobre superficies.
        brillo: {
          '0%': { transform: 'translateX(-160%) skewX(-16deg)' },
          '100%': { transform: 'translateX(260%) skewX(-16deg)' },
        },
        'girar-lento': {
          to: { transform: 'rotate(360deg)' },
        },
        // Crecimiento horizontal para barras de métricas (usar con origin-left).
        crecer: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        vapor: 'vapor 2.6s ease-in-out infinite',
        'vapor-lento': 'vapor 3.4s ease-in-out infinite',
        latido: 'latido 0.4s ease-in-out',
        entrada: 'entrada 0.5s ease-out both',
        aparecer: 'aparecer 0.5s ease-out both',
        'subir-mascara': 'subir-mascara 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        deriva: 'deriva 16s ease-in-out infinite',
        'deriva-lenta': 'deriva 22s ease-in-out infinite reverse',
        flotar: 'flotar 5.5s ease-in-out infinite',
        brillo: 'brillo 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'girar-lento': 'girar-lento 14s linear infinite',
        crecer: 'crecer 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
