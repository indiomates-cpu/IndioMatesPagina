'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function LoginForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? 'No se pudo iniciar sesión');
        setCargando(false);
        return;
      }

      // Redirigir al destino solicitado o al dashboard.
      const params = new URLSearchParams(window.location.search);
      const destino = params.get('redirect') || '/admin';
      router.replace(destino.startsWith('/admin') ? destino : '/admin');
      router.refresh();
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
      setCargando(false);
    }
  }

  const inputBase =
    'w-full rounded-lg border border-tinta/15 bg-papel px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-300 focus:border-tinta focus:ring-4 focus:ring-tinta/5';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="usuario" className="mb-1.5 block text-sm font-medium">
          Usuario
        </label>
        <input
          id="usuario"
          type="text"
          autoComplete="username"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="contrasena" className="mb-1.5 block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="contrasena"
          type="password"
          autoComplete="current-password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className={inputBase}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              // Sacudida horizontal: el clásico "no" de las contraseñas.
              x: [0, -8, 8, -5, 5, 0],
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
          >
            <span className="block px-3 py-2">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={cargando}
        whileTap={{ scale: 0.98 }}
        className="mt-2 rounded-lg bg-tinta py-2.5 font-medium text-papel transition-all duration-300 ease-premium hover:bg-tinta-suave hover:shadow-flotante-sm disabled:opacity-60"
      >
        {cargando ? 'Ingresando…' : 'Ingresar'}
      </motion.button>
    </form>
  );
}
