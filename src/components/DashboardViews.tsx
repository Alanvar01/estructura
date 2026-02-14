import { db } from '@/src/bd'
import { usuarios, infoProveedor, productos, maquinas } from '@/src/bd/schema'
import { desc } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'
import { Users, Truck, Package, Wrench, BarChart3 } from 'lucide-react'

const formatCurrency = (value: string | number | null) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(value))
}

//COMPONENTE DE RESUMEN (CON GRÁFICA)

export async function ResumenView() {
  const [listaUsuarios, listaProveedores, listaProductos, listaMaquinas, topProductos] = await Promise.all([
    db.select({ id: usuarios.id }).from(usuarios),
    db.select({ id: infoProveedor.id }).from(infoProveedor),
    db.select({ id: productos.id }).from(productos),
    db.select({ id: maquinas.id }).from(maquinas),
    
    // Consulta para la gráfica: Los 5 productos con mayor stock
    db.select({ 
      nombre: productos.nombreProducto, 
      total: productos.total 
    })
      .from(productos)
      .orderBy(desc(productos.total))
      .limit(5)
  ])

  const maxStock = topProductos.length > 0 ? Math.max(...topProductos.map(p => p.total ?? 0), 1) : 1

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listaUsuarios.length}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listaProveedores.length}</div>
            <p className="text-xs text-muted-foreground">Socios comerciales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listaProductos.length}</div>
            <p className="text-xs text-muted-foreground">Items en inventario</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maquinaria</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listaMaquinas.length}</div>
            <p className="text-xs text-muted-foreground">Equipos activos</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Graficas */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-md">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Top 5 Productos en Stock</CardTitle>
                <CardDescription className="text-xs">Artículos con mayor volumen en el inventario.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {topProductos.length > 0 ? (
                topProductos.map((prod, idx) => {
                  const stock = prod.total ?? 0
                  const percentage = (stock / maxStock) * 100

                  return (
                    <div key={idx} className="space-y-2 group">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground/80 truncate pr-4">
                          {idx + 1}. {prod.nombre}
                        </span>
                        <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {stock}
                        </span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground italic">
                  No hay datos suficientes para mostrar la gráfica.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/50 bg-muted/10 flex flex-col items-center justify-center min-h-[300px] border-dashed">
          <CardContent className="flex flex-col items-center text-center opacity-50">
            <BarChart3 className="h-10 w-10 mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Más métricas próximamente</p>
            <p className="text-xs text-muted-foreground mt-1">Aquí podrías poner un resumen de la maquinaria.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

//COMPONENTE DE USUARIOS

export async function UsuariosView() {
  const lista = await db.select().from(usuarios).orderBy(desc(usuarios.createdAt))
  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>Usuarios del Sistema</CardTitle>
        <CardDescription>Lista de personal con acceso.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3 rounded-tr-lg">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(u => (
                <tr key={u.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">#{u.id}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No hay usuarios</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

//COMPONENTE DE PROVEEDORES

export async function ProveedoresView() {
  const lista = await db.select().from(infoProveedor).orderBy(desc(infoProveedor.createdAt))
  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>Proveedores</CardTitle>
        <CardDescription>Directorio de proveedores registrados.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Nombre</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3 rounded-tr-lg">Correo</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(p => (
                <tr key={p.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3">{p.telefono || '-'}</td>
                  <td className="px-4 py-3 text-blue-600">{p.correo || '-'}</td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No hay proveedores</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

//COMPONENTE DE PRODUCTOS

export async function ProductosView() {
  const lista = await db.select().from(productos).orderBy(desc(productos.createdAt))
  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>Inventario</CardTitle>
        <CardDescription>Listado completo de productos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Producto</th>
                <th className="px-4 py-3">Clasificación</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Unidad</th>
                <th className="px-4 py-3">Costo Unitario</th>
                <th className="px-4 py-3 rounded-tr-lg">Precio Público</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(p => (
                <tr key={p.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.nombreProducto}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                      {p.clasificacion || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold">{p.total}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.unidadMedida}</td>
                  <td className="px-4 py-3">{formatCurrency(p.costoPorUnidad ?? 0)}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(p.precioPublico ?? 0)}</td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No hay productos</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}


//COMPONENTE DE MAQUINARIA

export async function MaquinasView() {
  const lista = await db.select().from(maquinas).orderBy(desc(maquinas.createdAt))
  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>Maquinaria</CardTitle>
        <CardDescription>Detalles técnicos de los equipos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Tipo</th>
                <th className="px-4 py-3">Motor</th>
                <th className="px-4 py-3">HP</th>
                <th className="px-4 py-3">Capacidad</th>
                <th className="px-4 py-3 rounded-tr-lg">Uso</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(m => (
                <tr key={m.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{m.tipoMaquina}</td>
                  <td className="px-4 py-3">{m.motor || '-'}</td>
                  <td className="px-4 py-3">{m.hp || '-'}</td>
                  <td className="px-4 py-3">{m.capacidad || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]" title={m.uso || ''}>
                    {m.uso || '-'}
                  </td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No hay maquinaria</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
