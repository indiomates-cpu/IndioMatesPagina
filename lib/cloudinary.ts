import { v2 as cloudinary } from 'cloudinary';

// Indica si Cloudinary está configurado con credenciales. Si no lo está, el
// panel de administración permite cargar imágenes por URL como alternativa.
export const cloudinaryConfigurado = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigurado) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Sube un buffer de imagen a Cloudinary y devuelve la URL segura.
export async function subirImagen(
  buffer: Buffer,
  carpeta = 'indio-mates'
): Promise<string> {
  if (!cloudinaryConfigurado) {
    throw new Error(
      'Cloudinary no está configurado. Completá las variables CLOUDINARY_* o cargá la imagen por URL.'
    );
  }

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: carpeta, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Error subiendo la imagen a Cloudinary.'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export { cloudinary };
