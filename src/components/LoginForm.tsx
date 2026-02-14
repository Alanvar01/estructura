'use client'

import { cn } from '@/src/lib/utils'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
// import Image from 'next/image'
import { useActionState } from 'react'
import { authenticate } from '@/src/app/actions' 
import { useSearchParams } from 'next/navigation'
import { AlertCircle, User, Lock, LayoutDashboard } from 'lucide-react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard' 
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
    <div className={cn('flex min-h-[50vh] flex-col items-center justify-center p-4', className)} {...props}>
      <Card className="overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-[1000px] shadow-xl border-muted/40">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
          
         
          <form className="flex flex-col justify-center p-6 sm:p-10 md:p-12 w-full bg-card" action={formAction}>
            
            <div className="flex flex-col items-center gap-4 text-center mb-10">
            
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">GIMM</h1>
              <p className="text-sm text-muted-foreground text-balance">
                Gestor Inteligente de Molinos y Maquinaria
              </p>
            </div>

            <div className="flex flex-col gap-5">
              
              <div className="grid gap-2">
                <Label htmlFor="username" className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Tu usuario"
                    autoComplete="username"
                    required
                    className="pl-9 h-11 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    Contraseña
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="pl-9 h-11 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              
              <input type="hidden" name="redirectTo" value={callbackUrl} />

              <Button 
                type="submit" 
                disabled={isPending} 
                className="w-full h-11 mt-2 text-base shadow-md transition-all hover:scale-[1.01]"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </span>
                ) : 'Iniciar sesión'}
              </Button>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </form>

          <div className="relative hidden md:block bg-muted min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-10">
              <div className="text-white space-y-2">
                <h3 className="text-xl font-bold">Panel de Administración</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700">
               
              {/* <Image src="/login-bg.jpg" alt="Fondo" fill className="object-cover" /> */}
              <LayoutDashboard size={100} strokeWidth={0.5} />
            </div>
          </div>

        </CardContent>
      </Card>
      
      <p className="mt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Molinos y Maquinaria. Todos los derechos reservados.
      </p>
    </div>
  )
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}


