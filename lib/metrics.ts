import { prisma } from './prisma';
import type { TipoEvento } from './constants';

// Registra un evento de métrica en la base. Nunca lanza: si falla, sólo lo
// loguea, porque el registro de métricas no debe romper la navegación.
export async function registrarEvento(
  tipo: TipoEvento,
  productoId?: string | null
): Promise<void> {
  try {
    await prisma.eventoMetrica.create({
      data: {
        tipo,
        productoId: productoId ?? null,
      },
    });
  } catch (error) {
    console.error('No se pudo registrar el evento de métrica:', error);
  }
}
