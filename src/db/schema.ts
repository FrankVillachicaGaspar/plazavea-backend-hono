import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  foreignKey,
  index,
} from 'drizzle-orm/sqlite-core'

export const bannerType = sqliteTable('banner_type', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  descripcion: text('descripcion').notNull(), // Ejemplo: "Banner Principal", "Banner oferta", "Banner descuento"
  tamanioSugerido: text('tamanio_sugerido').notNull(), // Ejemplo: "1200x300"
})

export type BannerType = typeof bannerType.$inferSelect

// Banners
export const banners = sqliteTable('banners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  altText: text('alt_text').notNull(),
  order: integer('order').notNull(),
  active: integer('active').default(1),
  bannerType: integer('banner_type').references(() => bannerType.id),
})

export type Banner = typeof banners.$inferSelect

// Usuarios
export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  apellidos: text('apellidos').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  telefono: text('telefono'),
  fechaNacimiento: text('fecha_nacimiento'),
  genero: text('genero'), // 'M', 'F', 'Otro'
  tipoDocumento: text('tipo_documento').default('DNI'), // 'DNI', 'CE', 'Pasaporte'
  numeroDocumento: text('numero_documento'),
  // Dirección
  departamento: text('departamento'),
  provincia: text('provincia'),
  distrito: text('distrito'),
  direccion: text('direccion'),
  referencia: text('referencia'),
  codigoPostal: text('codigo_postal'),
  // Configuración
  aceptaMarketing: integer('acepta_marketing', { mode: 'boolean' }).default(
    false,
  ),
  aceptaTerminos: integer('acepta_terminos', { mode: 'boolean' })
    .notNull()
    .default(true),
  // Metadata
  fechaRegistro: text('fecha_registro').default('CURRENT_TIMESTAMP'),
  ultimoAcceso: text('ultimo_acceso'),
  activo: integer('activo', { mode: 'boolean' }).default(true),
})

export type User = typeof usuarios.$inferSelect

// Categorías
export const categorias = sqliteTable('categorias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  imageUrl: text('image_url').default(
    'https://via.assets.so/img.jpg?w=240&h=145&tc=red&bg=%23f1f1f1',
  ),
})

export type Category = typeof categorias.$inferSelect

// Productos
export const productos = sqliteTable('productos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  precio: real('precio').notNull(),
  stock: integer('stock').notNull(),
  categoriaId: integer('categoria_id').references(() => categorias.id),
})

export type Product = typeof productos.$inferSelect
export type ProductWithImage = {
  producto: Product
  imagen: Image | null
}

export const imagenes = sqliteTable(
  'imagenes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productoId: integer('producto_id').references(() => productos.id),
    url: text('url').notNull(),
    main: integer('main', { mode: 'boolean' }).default(false),
  },
  t => [index('idx_producto_id').on(t.productoId)],
)

export type Image = typeof imagenes.$inferSelect

// Recomendados
export const productosRecomendados = sqliteTable(
  'productos_recomendados',
  {
    productoId: integer('producto_id').references(() => productos.id),
    recomendadoId: integer('recomendado_id').references(() => productos.id),
  },
  t => [primaryKey({ columns: [t.productoId, t.recomendadoId] })],
)

// Carrito
export const carrito = sqliteTable(
  'carrito',
  {
    usuarioId: integer('usuario_id').references(() => usuarios.id),
    productoId: integer('producto_id').references(() => productos.id),
    cantidad: integer('cantidad').notNull(),
  },
  t => [primaryKey({ columns: [t.usuarioId, t.productoId] })],
)

export type Carrito = typeof carrito.$inferSelect

// Tabla de pagos
export const pagos = sqliteTable('pagos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id').references(() => usuarios.id),
  // Información de contacto
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull(),
  // Información de pago
  total: real('total').notNull(),
  subtotal: real('subtotal').notNull(),
  envio: real('envio').default(0),
  fecha: text('fecha').default('CURRENT_TIMESTAMP'),
  metodo: text('metodo').notNull(), // 'card', 'paypal', 'transfer'
  // Datos de tarjeta (solo si método es 'card')
  numeroTarjeta: text('numero_tarjeta', { length: 19 }), // formato: 1234 5678 9012 3456
  fechaVencimiento: text('fecha_vencimiento', { length: 5 }), // formato: MM/YY
  cvv: text('cvv', { length: 4 }), // encriptado o tokenizado
  nombreTarjeta: text('nombre_tarjeta'),
  ultima4: text('ultima4', { length: 4 }),
  // Dirección de facturación
  direccion: text('direccion').notNull(),
  ciudad: text('ciudad').notNull(),
  codigoPostal: text('codigo_postal').notNull(),
  pais: text('pais').notNull(),
  // Estado y seguimiento
  estado: text('estado').default('pendiente'), // 'pendiente', 'procesando', 'aprobado', 'fallido', 'cancelado'
  referencia: text('referencia'), // ID externo de transacción
  // Términos y condiciones
  terminosAceptados: integer('terminos_aceptados', { mode: 'boolean' }).default(
    false,
  ),
  // Metadatos
  ip: text('ip'), // IP del usuario al momento del pago
  userAgent: text('user_agent'), // Navegador del usuario
  fechaActualizacion: text('fecha_actualizacion').default('CURRENT_TIMESTAMP'),
})

export type PagoInsert = typeof pagos.$inferInsert
export type PagoSelect = typeof pagos.$inferSelect

// Detalle de productos comprados en cada pago
export const pagosDetalle = sqliteTable(
  'pagos_detalle',
  {
    pagoId: integer('pago_id').references(() => pagos.id),
    productoId: integer('producto_id').references(() => productos.id),
    cantidad: integer('cantidad').notNull(),
    precioUnitario: real('precio_unitario').notNull(), // precio en el momento del pago
  },
  t => [
    primaryKey({ columns: [t.pagoId, t.productoId] }),
    foreignKey({ columns: [t.pagoId], foreignColumns: [pagos.id] }),
    foreignKey({ columns: [t.productoId], foreignColumns: [productos.id] }),
  ],
)

export type PagoDetalleInsert = typeof pagosDetalle.$inferInsert
