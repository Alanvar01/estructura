'use client'

import { useState } from 'react'
import { AppSidebar } from '@/src/components/AppSidebar'
import { cn } from '@/src/lib/utils'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div className="flex min-h-screen bg-muted/20">      
      <AppSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <main 
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out p-4 md:p-8',
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        <div className="mx-auto max-w-[1600px] w-full">
          {children}
        </div>
      </main>
      
    </div>
  )
}
