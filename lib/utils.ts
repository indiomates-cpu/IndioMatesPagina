import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combina clases de Tailwind resolviendo conflictos.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Formatea un número como precio en pesos argentinos: $ 12.500
const formateadorPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatearPrecio(valor: number): string {
  return formateadorPrecio.format(valor);
}

// Genera un slug amigable a partir de un texto (para productos y categorías).
export function slugify(texto: string): string {
  return texto
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // quita caracteres no válidos
    .replace(/\s+/g, '-') // espacios a guiones
    .replace(/-+/g, '-'); // colapsa guiones repetidos
}

// Formatea una fecha en formato corto argentino.
export function formatearFecha(fecha: Date | string): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}
