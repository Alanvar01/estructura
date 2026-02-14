'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/src/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Package, 
  Wrench, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Bot
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { logout, getCurrentUser } from '@/src/app/actions'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'

const menuItems = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'proveedores', label: 'Proveedores', icon: Truck },
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'maquinas', label: 'Maquinaria', icon: Wrench },
  { id: 'chat', label: 'Asistente AI', icon: Bot }
]

interface AppSidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export function AppSidebar({ isCollapsed, toggleSidebar }: AppSidebarProps) {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'resumen'

  const [dbUser, setDbUser] = useState({ username: '...', role: 'Cargando...' })

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser()
      setDbUser(user)
    }
    loadUser()
  }, [])

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 hidden md:flex flex-col h-screen border-r border-border/40 bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-30 shadow-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <button 
        onClick={toggleSidebar}
        className='absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/40 border-2 border-background transition-all duration-300 hover:scale-110 hover:shadow-primary/60 hover:brightness-110 z-40 focus:outline-none'
      >
        {isCollapsed ? (
          <PanelLeftOpen className='h-4 w-4' /> 
        ) : (
          <PanelLeftClose className='h-4 w-4' />
        )}
      </button>

      <div className='flex h-20 items-center px-4 mb-2'>
        <div className='flex items-center gap-3 overflow-hidden'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/20'>
            <Sparkles className='h-5 w-5' />
          </div>
          <div className={cn('flex flex-col transition-all duration-300', isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto')}>
            <span className='font-bold text-base tracking-tight leading-none text-foreground'>GIMM</span>
          </div>
        </div>
      </div>

      <div className='flex-1 px-3 py-2 space-y-1.5'>
        <p className={cn(
          'px-3 text-[11px] font-semibold text-muted-foreground/60 mb-4 uppercase tracking-wider transition-all duration-300',
          isCollapsed ? 'opacity-0 h-0 hidden' : 'opacity-100'
        )}>
          Gestión Principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id

          return (
            <Link
              key={item.id}
              href={`?tab=${item.id}`}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                isCollapsed && 'justify-center px-0'
              )}
            >
              {isActive && !isCollapsed && (
                <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md shadow-[0_0_8px_rgba(0,0,0,0.1)] shadow-primary/40' />
              )}
              
              <Icon className={cn('h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110', isActive && 'text-primary')} />
              
              <span className={cn(
                'whitespace-nowrap transition-all duration-300',
                isCollapsed ? 'opacity-0 w-0 translate-x-[-10px] hidden' : 'opacity-100 translate-x-0'
              )}>
                {item.label}
              </span>

              {isCollapsed && (
                <div className='absolute left-full ml-4 flex items-center opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-all duration-300 -translate-x-2 group-hover:translate-x-0'>
                  <div className='w-2 h-2 bg-primary rotate-45 -mr-1 z-[-1] rounded-sm' />
                  <div className='bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg shadow-primary/30'>
                    {item.label}
                  </div>
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <div className='p-3 mt-auto border-t border-border/40'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant='ghost' 
              className={cn(
                'w-full h-14 group relative flex items-center gap-3 hover:bg-muted/80 transition-all rounded-xl',
                isCollapsed ? 'justify-center px-0' : 'justify-start px-2'
              )} 
            >
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold shadow-sm uppercase'>
                {dbUser.username.charAt(0)}
              </div>
              
              <div className={cn(
                'flex flex-col items-start justify-center gap-1 text-left transition-all duration-300',
                isCollapsed ? 'hidden opacity-0' : 'block opacity-100'
              )}>
                <span className='text-sm font-bold leading-tight text-foreground capitalize'>{dbUser.username} </span>
                <span className='text-[11px] text-muted-foreground font-medium capitalize'>{dbUser.role}</span>
              </div>

              {isCollapsed && (
                <div className='absolute left-full ml-4 flex items-center opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-all duration-300 -translate-x-2 group-hover:translate-x-0'>
                  <div className='w-2 h-2 bg-primary rotate-45 -mr-1 z-[-1] rounded-sm' />
                  <div className='bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg shadow-primary/30'>
                    Perfil de {dbUser.username}
                  </div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align='end' side='top' sideOffset={10} className='w-56 rounded-xl shadow-xl'>
            <div className='flex items-center justify-start gap-3 p-3'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold uppercase'>
                {dbUser.username.charAt(0)}
              </div>
              <div className='flex flex-col space-y-0.5 leading-none'>
                <p className='font-semibold text-sm capitalize'>{dbUser.username}</p>
                <p className='w-[140px] truncate text-xs text-muted-foreground capitalize'>{dbUser.role}</p>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild className='text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer p-0 rounded-lg m-1'>
              <form action={logout} className='w-full'>
                <button type='submit' className='flex w-full items-center px-3 py-2'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span className='font-medium'>Cerrar Sesión</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
