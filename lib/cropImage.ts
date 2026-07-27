// Recorta una imagen en el navegador usando <canvas>, a partir del área en
// píxeles que devuelve react-easy-crop. Devuelve un Blob JPEG en alta
// calidad, listo para subir.

export interface AreaRecorte {
  x: number;
  y: number;
  width: number;
  height: number;
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = src;
  });
}

// Lado máximo del recorte exportado: suficiente para verse nítido incluso
// en pantallas mobile de alta densidad (DPR 3) sin generar archivos enormes.
const LADO_MAXIMO = 2000;

export async function recortarImagen(
  src: string,
  area: AreaRecorte
): Promise<Blob> {
  const imagen = await cargarImagen(src);

  const escala = Math.min(1, LADO_MAXIMO / Math.max(area.width, area.height));
  const anchoDestino = Math.round(area.width * escala);
  const altoDestino = Math.round(area.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = anchoDestino;
  canvas.height = altoDestino;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo preparar el recorte');

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    imagen,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    anchoDestino,
    altoDestino
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Error al recortar'))),
      'image/jpeg',
      0.95
    );
  });
}
