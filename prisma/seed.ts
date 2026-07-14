import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Genera URLs de imágenes placeholder en blanco y negro con el texto del
// producto. Se reemplazan por imágenes reales (Cloudinary) desde el panel.
function imgs(texto: string, cantidad = 2): { url: string; orden: number }[] {
  const base = encodeURIComponent(texto);
  return Array.from({ length: cantidad }, (_, i) => ({
    url: `https://placehold.co/800x800/0a0a0a/ffffff/png?text=${base}${
      i > 0 ? `+${i + 1}` : ''
    }`,
    orden: i,
  }));
}

const CATEGORIAS = [
  { nombre: 'Mates', slug: 'mates', orden: 1 },
  { nombre: 'Bombillas', slug: 'bombillas', orden: 2 },
  { nombre: 'Yerberas', slug: 'yerberas', orden: 3 },
  { nombre: 'Termos', slug: 'termos', orden: 4 },
  { nombre: 'Sets materos', slug: 'sets-materos', orden: 5 },
  { nombre: 'Accesorios', slug: 'accesorios', orden: 6 },
];

// Productos de ejemplo. El stock está pensado para mostrar los 3 estados:
// sin stock (0), stock bajo (<=5) y stock disponible (>5).
const PRODUCTOS = [
  {
    nombre: 'Mate Imperial de Alpaca',
    slug: 'mate-imperial-alpaca',
    categoria: 'mates',
    precio: 18000,
    stock: 8,
    descripcion:
      'Mate imperial de calabaza forrado en alpaca cincelada a mano. Una pieza clásica y elegante para el mate de todos los días.\n\nCurado y listo para usar.',
  },
  {
    nombre: 'Mate Camionero Forrado en Cuero',
    slug: 'mate-camionero-cuero',
    categoria: 'mates',
    precio: 12500,
    stock: 3,
    descripcion:
      'Mate camionero de calabaza forrado en cuero legítimo con base de apoyo. Resistente y con la boca ancha ideal para cebar tranquilo.',
  },
  {
    nombre: 'Mate Torpedo de Calabaza',
    slug: 'mate-torpedo-calabaza',
    categoria: 'mates',
    precio: 9000,
    stock: 0,
    descripcion:
      'Mate torpedo de calabaza natural con virola de acero. Forma alargada que mantiene la temperatura del agua.',
  },
  {
    nombre: 'Bombilla Pico de Loro de Alpaca',
    slug: 'bombilla-pico-de-loro-alpaca',
    categoria: 'bombillas',
    precio: 8500,
    stock: 15,
    descripcion:
      'Bombilla pico de loro de alpaca con filtro desmontable para una limpieza fácil. Cebado prolijo sin que se tape.',
  },
  {
    nombre: 'Bombilla de Acero Inoxidable Premium',
    slug: 'bombilla-acero-premium',
    categoria: 'bombillas',
    precio: 4500,
    stock: 25,
    descripcion:
      'Bombilla de acero inoxidable con resorte interno y rosca desmontable. Higiénica, durable y muy fácil de limpiar.',
  },
  {
    nombre: 'Yerbera Matera de Cuero',
    slug: 'yerbera-matera-cuero',
    categoria: 'yerberas',
    precio: 15000,
    stock: 6,
    descripcion:
      'Yerbera de cuero repujado con pico dosificador. Conserva la yerba fresca y le da un toque tradicional a tu set matero.',
  },
  {
    nombre: 'Set Yerbera + Azucarera',
    slug: 'set-yerbera-azucarera',
    categoria: 'yerberas',
    precio: 11000,
    stock: 4,
    descripcion:
      'Combo de yerbera y azucarera de acero inoxidable con tapa hermética. Prácticos para llevar a cualquier lado.',
  },
  {
    nombre: 'Termo Stanley 1L Clásico',
    slug: 'termo-stanley-1l',
    categoria: 'termos',
    precio: 62000,
    stock: 5,
    descripcion:
      'Termo Stanley de 1 litro con tapón cebador. Mantiene el agua caliente por horas. El compañero definitivo para la matera.',
  },
  {
    nombre: 'Termo Lumilagro Acero 1L',
    slug: 'termo-lumilagro-1l',
    categoria: 'termos',
    precio: 38000,
    stock: 10,
    descripcion:
      'Termo Lumilagro de acero inoxidable con pico cebador de acero. Fabricación nacional, excelente conservación térmica.',
  },
  {
    nombre: 'Set Matero Completo Premium',
    slug: 'set-matero-premium',
    categoria: 'sets-materos',
    precio: 45000,
    stock: 2,
    descripcion:
      'Set completo: mate forrado, bombilla de alpaca, yerbera, azucarera y bolso matero. Todo lo que necesitás para arrancar.',
  },
  {
    nombre: 'Set Matero de Iniciación',
    slug: 'set-matero-iniciacion',
    categoria: 'sets-materos',
    precio: 28000,
    stock: 12,
    descripcion:
      'Set de iniciación con mate de calabaza, bombilla de acero y yerbera. Ideal para regalar o para empezar en el mundo del mate.',
  },
  {
    nombre: 'Bolso Matero Impermeable',
    slug: 'bolso-matero-impermeable',
    categoria: 'accesorios',
    precio: 22000,
    stock: 0,
    descripcion:
      'Bolso matero impermeable con compartimentos para mate, termo, yerbera y accesorios. Correa ajustable para llevar al hombro.',
  },
  {
    nombre: 'Cepillo Limpia Bombillas',
    slug: 'cepillo-limpia-bombillas',
    categoria: 'accesorios',
    precio: 2500,
    stock: 30,
    descripcion:
      'Cepillo de cerdas finas para limpiar el interior de la bombilla. Mantené tu bombilla impecable y sin restos de yerba.',
  },
  {
    nombre: 'Apoya Mate de Madera',
    slug: 'apoya-mate-madera',
    categoria: 'accesorios',
    precio: 3800,
    stock: 7,
    descripcion:
      'Apoya mate de madera de algarrobo torneada. Protege tus superficies y suma un detalle cálido a la mesa.',
  },
];

async function main() {
  console.log('🧉 Iniciando seed de Indio Mates...');

  // --- Admin ---
  const usuario = process.env.ADMIN_USUARIO || 'admin';
  const contrasena = process.env.ADMIN_CONTRASENA || 'indiomates2024';
  const contrasenaHash = await bcrypt.hash(contrasena, 10);

  await prisma.admin.upsert({
    where: { usuario },
    update: { contrasenaHash },
    create: { usuario, contrasenaHash },
  });
  console.log(`✔ Admin listo (usuario: "${usuario}")`);

  // --- Limpiar datos de catálogo previos (idempotente) ---
  await prisma.eventoMetrica.deleteMany();
  await prisma.imagenProducto.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();

  // --- Categorías ---
  const mapaCategorias = new Map<string, string>();
  for (const cat of CATEGORIAS) {
    const creada = await prisma.categoria.create({ data: cat });
    mapaCategorias.set(cat.slug, creada.id);
  }
  console.log(`✔ ${CATEGORIAS.length} categorías creadas`);

  // --- Productos + imágenes ---
  const idsCreados: string[] = [];
  for (const p of PRODUCTOS) {
    const categoriaId = mapaCategorias.get(p.categoria);
    if (!categoriaId) continue;

    const creado = await prisma.producto.create({
      data: {
        nombre: p.nombre,
        slug: p.slug,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: p.stock,
        activo: true,
        categoriaId,
        imagenes: { create: imgs(p.nombre) },
      },
    });
    idsCreados.push(creado.id);
  }
  console.log(`✔ ${idsCreados.length} productos creados`);

  // --- Eventos de ejemplo (para que el panel de métricas tenga datos) ---
  const eventos: { tipo: string; productoId: string | null }[] = [];
  idsCreados.forEach((id, i) => {
    // Vistas decrecientes para simular popularidad.
    const vistas = Math.max(1, 12 - i);
    for (let v = 0; v < vistas; v++) {
      eventos.push({ tipo: 'vista_producto', productoId: id });
    }
  });
  // Algunos pedidos por WhatsApp.
  for (let i = 0; i < 5; i++) {
    eventos.push({ tipo: 'pedido_whatsapp', productoId: null });
  }
  await prisma.eventoMetrica.createMany({ data: eventos });
  console.log(`✔ ${eventos.length} eventos de métrica de ejemplo creados`);

  console.log('✅ Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
