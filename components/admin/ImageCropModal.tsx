'use client';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

// Modal de recorte: ajustar tamaño (zoom) y posición del recuadro antes de
// subir. Aspecto 1:1 porque así se muestran las fotos en el catálogo y la
// galería de producto (aspect-square + object-cover).
export function ImageCropModal({
  src,
  nombreArchivo,
  indice,
  total,
  onConfirmar,
  onCancelar,
}: {
  src: string;
  nombreArchivo: string;
  indice: number;
  total: number;
  onConfirmar: (area: Area) => void;
  onCancelar: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixeles, setAreaPixeles] = useState<Area | null>(null);

  const alCompletarRecorte = useCallback((_: Area, areaEnPixeles: Area) => {
    setAreaPixeles(areaEnPixeles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-tinta/70 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 text-papel">
        <div>
          <p className="text-sm font-medium">Ajustar recorte</p>
          <p className="text-xs text-papel/60">
            {nombreArchivo}
            {total > 1 ? ` — ${indice + 1} de ${total}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancelar}
          className="presionable rounded-lg border border-papel/20 px-3 py-1.5 text-sm hover:bg-papel/10"
        >
          Cancelar
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={alCompletarRecorte}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">
        <label className="flex items-center gap-3 text-sm text-papel">
          Tamaño
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-papel"
          />
        </label>
        <button
          type="button"
          disabled={!areaPixeles}
          onClick={() => areaPixeles && onConfirmar(areaPixeles)}
          className="presionable rounded-lg bg-papel py-3 text-sm font-medium text-tinta transition-all duration-300 ease-premium hover:bg-papel/90 disabled:opacity-50"
        >
          {total > 1 && indice < total - 1 ? 'Confirmar y seguir' : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}
