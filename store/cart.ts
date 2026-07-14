'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemCarrito, ProductoDTO } from '@/lib/types';
import { IMAGEN_PLACEHOLDER } from '@/lib/constants';

interface EstadoCarrito {
  items: ItemCarrito[];
  // Controla la apertura del panel lateral (drawer) del carrito.
  abierto: boolean;
  agregar: (producto: ProductoDTO, cantidad?: number) => void;
  quitar: (id: string) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  vaciar: () => void;
  abrir: () => void;
  cerrar: () => void;
  alternar: () => void;
}

export const useCarrito = create<EstadoCarrito>()(
  persist(
    (set) => ({
      items: [],
      abierto: false,

      agregar: (producto, cantidad = 1) =>
        set((estado) => {
          const existente = estado.items.find((i) => i.id === producto.id);
          const portada =
            producto.imagenes && producto.imagenes.length > 0
              ? producto.imagenes[0].url
              : IMAGEN_PLACEHOLDER;

          if (existente) {
            // No superar el stock disponible.
            const nuevaCantidad = Math.min(
              existente.cantidad + cantidad,
              producto.stock
            );
            // Refrescamos stock y precio con los datos actuales del producto
            // (el carrito persistido en localStorage puede tener un snapshot
            // viejo). El stock definitivo se coordina igual por WhatsApp.
            return {
              items: estado.items.map((i) =>
                i.id === producto.id
                  ? {
                      ...i,
                      stock: producto.stock,
                      precio: producto.precio,
                      cantidad: nuevaCantidad,
                    }
                  : i
              ),
            };
          }

          const item: ItemCarrito = {
            id: producto.id,
            nombre: producto.nombre,
            slug: producto.slug,
            precio: producto.precio,
            stock: producto.stock,
            imagen: portada,
            cantidad: Math.min(Math.max(1, cantidad), producto.stock),
          };
          return { items: [...estado.items, item] };
        }),

      quitar: (id) =>
        set((estado) => ({
          items: estado.items.filter((i) => i.id !== id),
        })),

      cambiarCantidad: (id, cantidad) =>
        set((estado) => ({
          items: estado.items
            .map((i) => {
              if (i.id !== id) return i;
              // Acotar entre 1 y el stock disponible.
              const acotada = Math.max(1, Math.min(cantidad, i.stock));
              return { ...i, cantidad: acotada };
            })
            .filter((i) => i.cantidad > 0),
        })),

      vaciar: () => set({ items: [] }),
      abrir: () => set({ abierto: true }),
      cerrar: () => set({ abierto: false }),
      alternar: () => set((estado) => ({ abierto: !estado.abierto })),
    }),
    {
      name: 'indio-mates-carrito',
      // Sólo persistimos los items, no el estado de apertura del drawer.
      partialize: (estado) => ({ items: estado.items }),
    }
  )
);

// Selectores derivados (helpers puros para usar con el store).
export function calcularTotal(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

export function calcularCantidadTotal(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.cantidad, 0);
}
