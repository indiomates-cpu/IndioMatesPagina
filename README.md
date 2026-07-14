# 🧉 Indio Mates — E-commerce

Sitio de e-commerce para **Indio Mates**: catálogo público de productos materos
(mates, bombillas, yerberas, termos y accesorios), carrito de compras que
finaliza el pedido por **WhatsApp** y un **panel de administración** protegido
con login para gestionar productos, imágenes, stock, categorías y métricas.

Identidad visual en **blanco y negro**, mobile-first, con animaciones sutiles de
temática matera y cultura argentina.

---

## 🧱 Stack

| Capa            | Tecnología                          |
| --------------- | ----------------------------------- |
| Framework       | Next.js 15 (App Router) + TypeScript |
| Estilos         | Tailwind CSS                        |
| Animaciones     | Framer Motion                       |
| Base de datos   | PostgreSQL + Prisma ORM             |
| Estado (carrito)| Zustand                             |
| Autenticación   | JWT (`jose`) + bcrypt — sólo admin  |
| Imágenes        | Cloudinary (opcional / por URL)     |
| Pedido          | WhatsApp Click-to-Chat (`wa.me`)    |

---

## ✅ Requisitos previos

- **Node.js 18.18+** (recomendado 20 o superior)
- **PostgreSQL** corriendo localmente o en la nube (Supabase, Railway, Neon, etc.)
- npm (o pnpm/yarn)

---

## 🚀 Puesta en marcha (local)

### 1. Instalar dependencias

```bash
npm install
```

> El `postinstall` ejecuta `prisma generate` automáticamente.

### 2. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Variables principales:

| Variable                        | Descripción                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                  | Cadena de conexión a PostgreSQL.                                   |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`   | Número del negocio, formato internacional sin `+` ni espacios.     |
| `JWT_SECRET`                    | Clave larga y aleatoria para firmar los tokens del admin.          |
| `ADMIN_USUARIO` / `ADMIN_CONTRASENA` | Credenciales del admin que crea el seed.                      |
| `CLOUDINARY_*`                  | Credenciales de Cloudinary (opcionales — ver más abajo).           |

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Crear la base de datos y las tablas

Con la `DATABASE_URL` apuntando a tu PostgreSQL, aplicá el esquema:

```bash
# Opción A — migraciones versionadas (recomendado)
npm run db:migrate      # crea la migración inicial y la aplica

# Opción B — sincronización rápida sin historial de migraciones
npm run db:push
```

### 4. Cargar datos de prueba (seed)

```bash
npm run db:seed
```

Esto crea:

- El usuario administrador (según `ADMIN_USUARIO` / `ADMIN_CONTRASENA`).
- **6 categorías** y **14 productos** de ejemplo (con distintos estados de stock:
  sin stock, stock bajo y disponible).
- Eventos de métrica de ejemplo para que el panel de métricas tenga datos.

### 5. Levantar el proyecto

```bash
npm run dev
```

- Tienda pública: <http://localhost:3000>
- Panel de administración: <http://localhost:3000/admin>
  (usuario/contraseña definidos en el `.env`, por defecto `admin` / `indiomates2024`)

---

## 📁 Estructura del proyecto

```
.
├── app/
│   ├── (tienda)/              # Sitio público (comparte Header/Footer/Carrito)
│   │   ├── page.tsx           # Home (destacados + categorías)
│   │   ├── productos/         # Listado y detalle de productos
│   │   ├── carrito/           # Carrito completo
│   │   └── pedido-confirmado/ # Pantalla post-WhatsApp
│   ├── admin/                 # Panel de administración
│   │   ├── login/             # Ingreso
│   │   └── (panel)/           # Dashboard, productos, categorías, métricas
│   ├── api/                   # Route handlers (auth, eventos, CRUD, upload)
│   ├── layout.tsx             # Layout raíz (fuentes, metadata)
│   └── globals.css
├── components/                # Header, carrito, producto, admin, animaciones
├── hooks/                     # useConfirmarPedido (flujo de checkout)
├── lib/                       # prisma, auth, queries, cloudinary, whatsapp, utils
├── store/                     # Estado global del carrito (Zustand)
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   └── seed.ts                # Datos de prueba
├── middleware.ts              # Protección de /admin y /api/admin
└── .env.example
```

---

## 🖼️ Imágenes (Cloudinary)

La integración con Cloudinary está **preparada pero es opcional**:

- **Sin credenciales:** el panel permite cargar imágenes **por URL** (ideal para
  desarrollo con placeholders). El seed usa imágenes de placeholder.
- **Con credenciales:** completá `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y
  `CLOUDINARY_API_SECRET` en el `.env` para habilitar la **subida de archivos**
  con optimización automática desde el formulario de productos.

> Nota: al eliminar un producto se borran sus imágenes de la base de datos, pero
> los archivos en Cloudinary deben borrarse aparte (limitación documentada).

---

## 💬 Pedido por WhatsApp

El carrito **no procesa pagos online**. Al confirmar, se arma un resumen de texto
(productos, cantidades y subtotal), se codifica con `encodeURIComponent` y se abre:

```
https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=<mensaje-codificado>
```

Luego se muestra una pantalla de confirmación. Configurá el número real del
negocio en `NEXT_PUBLIC_WHATSAPP_NUMBER`.

**Repartir pedidos entre dos socios:** si completás también
`NEXT_PUBLIC_WHATSAPP_NUMBER_2`, cada pedido confirmado se envía al azar
(50/50) a uno de los dos números, para repartir la carga pareja entre ambos.
Si dejás esa variable vacía, todos los pedidos van al número principal. El
contacto general de la página de Soporte siempre usa el número principal
(no alterna), ya que no es un pedido.

---

## 📊 Lógica de stock (catálogo)

| Stock         | Se muestra                        | Botón "Agregar" |
| ------------- | --------------------------------- | --------------- |
| `0`           | **Sin stock**                     | Deshabilitado   |
| `1` a `5`     | **¡Últimas X unidades!** (destacado) | Habilitado   |
| `> 5`         | **Stock: X unidades**             | Habilitado      |

El umbral de stock bajo (5) se configura en `lib/constants.ts`
(`UMBRAL_STOCK_BAJO`).

---

## 📈 Métricas

Se registran eventos en la tabla `EventoMetrica`:

- `vista_producto`: al abrir el detalle de un producto.
- `pedido_whatsapp`: al confirmar un pedido.

El panel de métricas (`/admin/metricas`) muestra: productos más vistos, cantidad
de pedidos enviados por WhatsApp (histórico y últimos 30 días) y listado de
productos sin stock.

---

## 🛠️ Scripts útiles

| Script             | Acción                                      |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo                      |
| `npm run build`    | Build de producción                         |
| `npm start`        | Servir el build                             |
| `npm run db:push`  | Sincronizar el esquema con la base          |
| `npm run db:migrate`| Crear/aplicar migraciones                   |
| `npm run db:seed`  | Cargar datos de prueba                      |
| `npm run db:studio`| Abrir Prisma Studio (explorador de datos)   |
| `npm run db:reset` | Resetear la base y volver a correr el seed  |
| `npm run lint`     | Linter                                      |

---

## 📝 Notas

- El **logo** aún no está definido: en el header hay un espacio preparado
  (`components/layout/Header.tsx`) para reemplazar el placeholder cuando esté.
- No se incluye Google Analytics todavía (previsto para una etapa posterior).
- Diseño mobile-first, responsive, en paleta blanco y negro.
