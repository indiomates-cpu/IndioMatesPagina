'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  async function salir() {
    setSaliendo(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={salir}
      disabled={saliendo}
      className={
        className ??
        'presionable w-full rounded-lg border border-papel/20 px-3 py-2 text-sm text-papel/80 hover:border-papel/40 hover:bg-papel/10 disabled:opacity-60'
      }
    >
      {saliendo ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
