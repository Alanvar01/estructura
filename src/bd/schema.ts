import {
  mysqlTable,
  varchar,
  int,
  decimal,
  text,
  timestamp,
  mysqlEnum
} from 'drizzle-orm/mysql-core'

// 1. Tabla de Usuarios
export const usuarios = mysqlTable('usuarios', {
  id: int('id_usuario').primaryKey().autoincrement(),
  username: varchar('username', { length: 100 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'empleado', 'RH']).notNull().default('empleado'), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
})

// 2. Tabla de Información del Proveedor
export const infoProveedor = mysqlTable('info_proveedor', {
  id: int('id_proveedor').primaryKey().autoincrement(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  correo: varchar('correo', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
})

// 3. Tabla de Productos
export const productos = mysqlTable('productos', {
  id: int('id_producto').primaryKey().autoincrement(),
  nombreProducto: varchar('nombre_producto', { length: 150 }).notNull(),
  total: int('total').default(0),
  unidadMedida: varchar('unidad_medida', { length: 50 }), // Ej: 'pza', 'kg'
  costoPorUnidad: decimal('costo_por_unidad', { precision: 10, scale: 2 }),
  clasificacion: varchar('clasificacion', { length: 100 }),
  precioPublico: decimal('precio_publico', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
})

// 4. Tabla de Máquinas
export const maquinas = mysqlTable('maquinas', {
  id: int('id_maquina').primaryKey().autoincrement(),
  tipoMaquina: varchar('tipo_maquina', { length: 100 }).notNull(),
  capacidad: varchar('capacidad', { length: 50 }), 
  transmision: varchar('transmision', { length: 100 }),
  motor: varchar('motor', { length: 100 }),
  hp: varchar('hp', { length: 50 }),
  corrienteLuz: varchar('corriente_luz', { length: 50 }),
  materialFabricacion: varchar('material_fabricacion', { length: 100 }),
  uso: varchar('uso', { length: 255 }),
  comentarioAdicional: text('comentario_adicional'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
})

// 5. Tabla de Conversaciones (El "título" del chat en el historial)
export const conversaciones = mysqlTable('conversaciones', {
  id: int('id_conversacion').primaryKey().autoincrement(),
  userId: int('user_id').notNull(), // Relación con usuarios
  titulo: varchar('titulo', { length: 255 }).notNull().default('Nueva conversación'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// 6. Tabla de Mensajes (El contenido del chat)
export const mensajes = mysqlTable('mensajes', {
  id: int('id_mensaje').primaryKey().autoincrement(),
  conversacionId: int('conversacion_id').notNull(),
  role: mysqlEnum('role', ['user', 'ai']).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
