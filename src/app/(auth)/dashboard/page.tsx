import { 
  ResumenView, 
  UsuariosView, 
  ProveedoresView, 
  ProductosView, 
  MaquinasView 
} from '@/src/components/DashboardViews'
import ChatInterface from '@/src/components/ChatInterface'
import { getCurrentUser } from '@/src/app/actions'

type PageProps = {
  searchParams: Promise<{ tab?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeTab = params.tab || 'resumen'
  
  const user = await getCurrentUser()

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)]'>
      
      {activeTab !== 'chat' && (
        <div className='flex flex-col space-y-1 mb-6'>
          <h1 className='text-3xl font-bold tracking-tight capitalize'>
            {activeTab}
          </h1>
          <p className='text-muted-foreground'>
            Gestión de {activeTab} del sistema.
          </p>
        </div>
      )}

      <div className={activeTab === 'chat' ? 'flex-1 h-full' : 'mt-0'}>
        {activeTab === 'resumen' && <ResumenView />}
        {activeTab === 'usuarios' && <UsuariosView />}
        {activeTab === 'proveedores' && <ProveedoresView />}
        {activeTab === 'productos' && <ProductosView />}
        {activeTab === 'maquinas' && <MaquinasView />}
        
        {activeTab === 'chat' && (
          <div className='h-full min-h-[75vh] w-full pt-2'>
            <ChatInterface userName={user.username} />
          </div>
        )}
      </div>
      
    </div>
  )
}
