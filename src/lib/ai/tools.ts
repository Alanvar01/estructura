import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { db } from '@/src/bd' 
import { productos, maquinas, infoProveedor } from '@/src/bd/schema'
import { like, or } from 'drizzle-orm'

// --- HERRAMIENTA 1: BUSCADOR DE PRODUCTOS ---
export const searchProductsTool = tool(
  async ({ query }) => {
    try {
      // Buscamos productos que coincidan en nombre o clasificación
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
      
      // Convertimos a string para que la IA lo pueda leer
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
