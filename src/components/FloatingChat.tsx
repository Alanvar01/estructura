'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { Bot, X } from 'lucide-react'
import ChatInterface from '@/src/components/ChatInterface'

export default function FloatingChat({ userName = 'Alan' }: { userName?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true) 
  const [isExiting, setIsExiting] = useState(false)     

  useEffect(() => {
    const totalTime = 10000 
    const animationDuration = 500 

    const exitTimer = setTimeout(() => {
      setIsExiting(true) 
    }, totalTime - animationDuration)

    const removeTimer = setTimeout(() => {
      setShowGreeting(false)
    }, totalTime)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
        .waving-hand {
          animation: wave 2s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full h-full md:p-6 flex items-center justify-center">
            
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute top-7 right-40 z-50 rounded-full bg-background shadow-md hover:bg-destructive hover:text-white border-2"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </Button>

            <div className="w-full h-full max-w-6xl flex items-center justify-center animate-in zoom-in-95 duration-300">
              <ChatInterface userName={userName} />
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
          {showGreeting && (
            <div className={`pointer-events-auto mr-2 mb-1 duration-500 ease-out fill-mode-forwards
                ${isExiting 
              ? 'animate-out slide-out-to-bottom-5 fade-out zoom-out-50' 
              : 'animate-in slide-in-from-bottom-5 fade-in zoom-in-50'  
            }`}>
              <div className="relative bg-white dark:bg-zinc-900 text-foreground px-5 py-3 rounded-2xl rounded-br-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/50 text-sm font-semibold flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsOpen(true)}>
                <span>Hola, {userName}</span>
                <span className="waving-hand text-lg">👋</span>

                <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white dark:bg-zinc-900 border-r border-b border-border/50 transform rotate-45 translate-x-[-8px]"></div>
              </div>
            </div>
          )}
          <div className="pointer-events-auto animate-in zoom-in duration-300 delay-150">
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-primary/80 hover:to-primary text-primary-foreground border-4 border-background transition-all hover:scale-110 hover:shadow-primary/25 active:scale-95 ring-0 ring-primary/20 hover:ring-4"
            >
              <Bot size={32} />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
