import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { cloudinaryConfigurado, subirImagen } from '@/lib/cloudinary';

// GET /api/admin/upload -> informa si Cloudinary está configurado, para que
// el panel muestre u oculte la subida de archivos.
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json({ configurado: cloudinaryConfigurado });
}

// POST /api/admin/upload -> sube un archivo de imagen y devuelve su URL.
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!cloudinaryConfigurado) {
    return NextResponse.json(
      {
        error:
          'Cloudinary no está configurado. Completá las variables CLOUDINARY_* o agregá la imagen por URL.',
      },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await subirImagen(buffer);

    return NextResponse.json({ url });
  } catch (e) {
    console.error('Error subiendo imagen:', e);
    return NextResponse.json(
      { error: 'No se pudo subir la imagen' },
      { status: 500 }
    );
  }
}
