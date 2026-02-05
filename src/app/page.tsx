'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: '¡Hola! Soy la IA de GIMM. ¿En qué puedo ayudarte hoy?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          userName: 'Usuario Prueba',
          userRole: 'admin',
          message: userMessage.content
        })
      })

      if (!res.ok) throw new Error('Error en la respuesta')

      const data = await res.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.response
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: '❌ Lo siento, hubo un error al conectar con el servidor.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl mx-auto border border-border/40 rounded-3xl shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden">
      <div className="bg-background/80 backdrop-blur-md p-6 border-b border-border/10 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">GIMM</h2>
            <p className="text-xs text-muted-foreground font-medium">Potenciado por IA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-muted-foreground font-medium">En línea</span>
        </div>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-muted/5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground border-primary/20' 
                  : 'bg-background text-secondary-foreground border-border/50'
              }`}
            >
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div
              className={`p-4 max-w-[80%] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                  : 'bg-white dark:bg-muted border border-border/50 rounded-2xl rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shadow-sm">
              <Bot size={18} className="text-muted-foreground" />
            </div>
            <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-sm border border-border/20 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Analizando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border/10">
        <form 
          onSubmit={handleSendMessage} 
          className="flex gap-3 items-center bg-muted/30 p-2 rounded-full border border-border/40 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-sm hover:shadow-md"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground/70"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="rounded-full h-10 w-10 shrink-0 shadow-sm transition-transform active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </Button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-muted-foreground/60">GIMM puede cometer errores. Verifica la información importante.</p>
        </div>
      </div>
    </div>
  )
}
