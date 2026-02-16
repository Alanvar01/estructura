import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { db } from '@/src/bd' 
import { productos, maquinas, infoProveedor } from '@/src/bd/schema'
import { like, or, eq } from 'drizzle-orm'

//HERRAMIENTAS DE LECTURA


// --- HERRAMIENTA 1: BUSCADOR DE PRODUCTOS ---
export const searchProductsTool = tool(
  async ({ query }) => {
    try {
      const results = await db
        .select()
        .from(productos)
        .where(
          or(
            like(productos.nombreProducto, `%${query}%`),
            like(productos.clasificacion, `%${query}%`)
          )
        )
        .limit(5) // Limitamos para no saturar al agente

      if (results.length === 0) return 'No se encontraron productos con ese criterio.'
      
      return JSON.stringify(results)
    } catch (error) {
      console.error(error)
      return 'Error al consultar la base de datos de productos.'
    }
  },
  {
    name: 'buscar_productos',
    description: 'Útil para buscar información, precios o stock de productos en el inventario. Recibe un texto de búsqueda.',
    schema: z.object({
      query: z.string().describe('El nombre del producto o categoría a buscar')
    })
  }
)

// --- HERRAMIENTA 2: CONSULTAR MAQUINARIA ---
export const searchMachinesTool = tool(
  async ({ tipo }) => {
    try {
      const results = await db
        .select()
        .from(maquinas)
        .where(like(maquinas.tipoMaquina, `%${tipo}%`))
        .limit(3)

      if (results.length === 0) return 'No hay máquinas registradas con ese nombre.'
      return JSON.stringify(results)
    } catch (error) {
      console.error(error)
      return 'Error al consultar la maquinaria.'
    }
  },
  {
    name: 'consultar_maquinas',
    description: 'Busca detalles técnicos de las máquinas disponibles (motor, hp, uso, etc).',
    schema: z.object({
      tipo: z.string().describe('El tipo o nombre de la máquina')
    })
  }
)

// --- HERRAMIENTA 3: LISTAR PROVEEDORES ---
export const listProveedoresTool = tool(
  async () => {
    try {
      const results = await db.select().from(infoProveedor)
      return JSON.stringify(results)
    } catch (error) {
      console.error(error)
      return 'Error al leer proveedores.'
    }
  },
  {
    name: 'listar_proveedores',
    description: 'Muestra la lista de proveedores registrados con su contacto.',
    schema: z.object({})
  }
)




//HERRAMIENTAS DE ESCRITURA (Modificación)


// --- HERRAMIENTA 4: ACTUALIZAR PROVEEDOR ---
export const updateProveedorTool = tool(
  async ({ id, nombre, telefono, correo }) => {
    try {
      const datosAActualizar: { nombre?: string; telefono?: string; correo?: string } = {}
      
      if (nombre) datosAActualizar.nombre = nombre
      if (telefono) datosAActualizar.telefono = telefono
      if (correo) datosAActualizar.correo = correo

      if (Object.keys(datosAActualizar).length === 0) {
        return 'No se proporcionaron datos nuevos para actualizar.'
      }

      await db.update(infoProveedor)
        .set(datosAActualizar)
        .where(eq(infoProveedor.id, id))

      return `El proveedor con ID ${id} fue actualizado correctamente en el sistema.`
    } catch (error) {
      console.error(error)
      return 'Error al intentar actualizar el proveedor en la base de datos.'
    }
  },
  {
    name: 'actualizar_proveedor',
    description: 'Útil para cambiar el nombre, teléfono o correo de un proveedor. Requiere conocer su ID.',
    schema: z.object({
      id: z.number().describe('El ID único del proveedor a modificar'),
      nombre: z.string().optional().describe('El nuevo nombre del proveedor'),
      telefono: z.string().optional().describe('El nuevo número de teléfono'),
      correo: z.string().optional().describe('El nuevo correo electrónico')
    })
  }
)

// --- HERRAMIENTA 5: ACTUALIZAR PRODUCTO ---
export const updateProductoTool = tool(
  async ({ id, total, precioPublico, costoPorUnidad, clasificacion }) => {
    try {
      const datosAActualizar: { 
        total?: number; 
        precioPublico?: string; 
        costoPorUnidad?: string; 
        clasificacion?: string 
      } = {}
      
      if (total !== undefined) datosAActualizar.total = total
      if (precioPublico !== undefined) datosAActualizar.precioPublico = precioPublico.toString()
      if (costoPorUnidad !== undefined) datosAActualizar.costoPorUnidad = costoPorUnidad.toString()
      if (clasificacion) datosAActualizar.clasificacion = clasificacion

      if (Object.keys(datosAActualizar).length === 0) return 'Sin datos para actualizar.'

      await db.update(productos)
        .set(datosAActualizar)
        .where(eq(productos.id, id))

      return `Producto ${id} actualizado con éxito.`
    } catch (error) {
      console.error(error)
      return 'Error al actualizar el producto.'
    }
  },
  {
    name: 'actualizar_producto',
    description: 'Modifica detalles de un producto. Usa "total" para actualizar el inventario, o cambia precios y clasificación.',
    schema: z.object({
      id: z.number().describe('El ID único del producto'),
      total: z.number().optional().describe('La nueva cantidad total en inventario'),
      precioPublico: z.number().optional().describe('El nuevo precio de venta al público'),
      costoPorUnidad: z.number().optional().describe('El nuevo costo de compra por unidad'),
      clasificacion: z.string().optional().describe('La nueva clasificación')
    })
  }
)

// --- HERRAMIENTA 6: ACTUALIZAR MAQUINARIA ---
export const updateMaquinaTool = tool(
  async ({ id, uso, comentarioAdicional }) => {
    try {
      const datosAActualizar: { uso?: string; comentarioAdicional?: string } = {}
      if (uso) datosAActualizar.uso = uso
      if (comentarioAdicional) datosAActualizar.comentarioAdicional = comentarioAdicional

      if (Object.keys(datosAActualizar).length === 0) return 'Sin datos para actualizar.'

      await db.update(maquinas)
        .set(datosAActualizar)
        .where(eq(maquinas.id, id))

      return `La maquinaria ${id} fue actualizada correctamente.`
    } catch (error) {
      console.error(error)
      return 'Error al actualizar la máquina.'
    }
  },
  {
    name: 'actualizar_maquina',
    description: 'Útil para cambiar el uso asignado a la máquina o agregar un comentario adicional al registro.',
    schema: z.object({
      id: z.number().describe('El ID de la maquinaria'),
      uso: z.string().optional().describe('El nuevo uso asignado a la máquina'),
      comentarioAdicional: z.string().optional().describe('Comentarios técnicos o reportes sobre la máquina')
    })
  }
)
