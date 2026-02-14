'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/src/components/ui/button'
import { Send, Bot, Loader2, Sparkles, MessageSquare, Plus, Trash2 } from 'lucide-react'
import { getConversations, getChatMessages, deleteConversation } from '@/src/app/actions'

interface ChatInterfaceProps {
  userName?: string
  userId?: number
}

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

interface Conversation {
  id: number
  titulo: string
  createdAt: Date
}

export default function ChatInterface({ userName = 'Alan', userId = 1 }: ChatInterfaceProps) {

  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentChatId, setCurrentChatId] = useState<number | null>(null)
  
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadHistoryList = useCallback(async () => {
    if (!userId) return
    try {
      const list = await getConversations(userId)
      setConversations(list.map(c => ({
        id: c.id,
        titulo: c.titulo,
        createdAt: c.createdAt
      })))
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }, [userId]) 

  const loadConversation = async (chatId: number) => {
    setIsLoading(true)
    setCurrentChatId(chatId)
    try {
      const history = await getChatMessages(chatId)
      const formatted: Message[] = history.map(m => ({
        id: m.id.toString(),
        role: m.role as 'user' | 'ai',
        content: m.content
      }))
      setMessages(formatted)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setCurrentChatId(null)
    setMessages([{
      id: 'welcome',
      role: 'ai',
      content: `¡Hola ${userName}! Inicia una nueva conversación.`
    }])
  }

  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation() 
    
    if (!confirm('¿Estás seguro de querer borrar esta conversación?')) return

    setConversations((prev) => prev.filter((c) => c.id !== chatId))

    if (currentChatId === chatId) {
      startNewChat()
    }

    await deleteConversation(chatId)
  }

  useEffect(() => {
    loadHistoryList()
  }, [loadHistoryList]) 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!currentChatId && messages.length === 0) {
      startNewChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          userId,
          userName,
          userRole: 'admin',
          message: userMessage.content,
          chatId: currentChatId
        })
      })

      if (!res.ok) throw new Error('Error en la respuesta')

      const data = await res.json()

      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId)
        loadHistoryList() 
      }

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
        content: '❌ Error de conexión.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className='grid grid-cols-1 md:grid-cols-[1fr_300px] h-full w-full max-w-[98%] mx-auto border border-border/40 rounded-3xl shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden'>

      <div className='flex flex-col h-full border-r border-border/10 relative min-h-0'>
        
        <div className='flex-none bg-background/80 backdrop-blur-md p-4 border-b border-border/10 flex items-center justify-between sticky top-0 z-10'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm'>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className='font-bold text-lg tracking-tight'>GIMM</h2>
              <p className='text-xs text-muted-foreground font-medium'>
                {currentChatId ? 'Conversación Activa' : 'Nueva Conversación'}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
            <span className='text-xs text-muted-foreground font-medium'>en linea</span>
          </div>
        </div>

        <div className='flex-1 min-h-0 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-muted/5'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground border-primary/20 font-bold' 
                    : 'bg-background text-secondary-foreground border-border/50'
                }`}
              >
                {msg.role === 'user' ? userInitial : <Bot size={18} />}
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
            <div className='flex gap-4 animate-in fade-in duration-300'>
              <div className='w-10 h-10 rounded-full bg-background border flex items-center justify-center shadow-sm'>
                <Bot size={18} className='text-muted-foreground' />
              </div>
              <div className='bg-muted/50 p-4 rounded-2xl rounded-tl-sm border border-border/20 flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin text-primary' />
                <span className='text-xs text-muted-foreground font-medium'>Analizando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

    
        <div className='flex-none p-4 bg-background/80 backdrop-blur-md border-t border-border/10'>
          <form 
            onSubmit={handleSendMessage} 
            className='flex gap-3 items-center bg-muted/30 p-2 rounded-full border border-border/40 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-sm'
          >
            <input
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Escribe algo ${userName}...`}
              className='flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground/70'
              disabled={isLoading}
            />
            <Button 
              type='submit' 
              size='icon'
              disabled={isLoading || !inputValue.trim()}
              className='rounded-full h-10 w-10 shrink-0 shadow-sm'
            >
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4 ml-0.5' />}
            </Button>
          </form>
        </div>
      </div>

      <div className='relative bg-muted/10 h-full hidden md:block border-l border-border/5 overflow-hidden'>
        
        <div className='absolute top-0 left-0 w-full p-4 border-b border-border/10 bg-background/50 backdrop-blur-sm z-10'>
          <Button onClick={startNewChat} variant='outline' className='w-full justify-start gap-2 bg-background shadow-sm hover:bg-primary/5 border-primary/20 text-primary transition-all'>
            <Plus size={16} />
                Nueva Conversación
          </Button>
        </div>

        <div className='h-full overflow-y-auto p-3 pt-24 space-y-2'>
          <p className='text-[10px] font-bold text-muted-foreground/60 px-3 mb-2 uppercase tracking-wider'>Historial</p>
            
          {conversations.length === 0 && (
            <div className='text-center p-8 text-xs text-muted-foreground/50 italic'>
                    No hay conversaciones previas.
            </div>
          )}

          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => loadConversation(chat.id)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-3 group relative pr-8
                        ${currentChatId === chat.id  
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
              : 'hover:bg-muted/60 text-foreground/80 hover:scale-[1.01]'}
            `}>
              <MessageSquare size={16} className={`mt-0.5 shrink-0 ${currentChatId === chat.id ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
              
              <div className='flex-1 min-w-0'>
                <span className='font-medium block truncate'>{chat.titulo}</span>
                <span className={`text-[10px] truncate block ${currentChatId === chat.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(chat.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* BOTÓN DE ELIMINAR */}
              <div 
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className={`absolute right-2 p-1.5 rounded-full hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100
                  ${currentChatId === chat.id ? 'text-white/70 hover:text-white' : 'text-muted-foreground'}
                `}
                title='Eliminar conversación'
              >
                <Trash2 size={14} />
              </div>
            </button>            
          ))}
        </div>
      </div>
    </div>
  )
}
