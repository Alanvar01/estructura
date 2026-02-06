// src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { processMessage } from '@/src/lib/ai/agente'
import { db } from '@/src/bd'
import { mensajes, conversaciones } from '@/src/bd/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, message, userName, userRole } = body
    
    let { chatId } = body 

    if (!userId || !message || !userName || !userRole) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    console.log(`📩 Mensaje de ${userName}: ${message}`)

    if (!chatId) {
      const [result] = await db.insert(conversaciones).values({
        userId,
        titulo: message.substring(0, 30) + '...'
      })
      

      chatId = result.insertId
    }

    await db.insert(mensajes).values({
      conversacionId: chatId,
      role: 'user',
      content: message
    })
    const responseText = await processMessage(message, userId, userName, userRole)
    await db.insert(mensajes).values({
      conversacionId: chatId,
      role: 'ai',
      content: responseText
    })

    return NextResponse.json({ response: responseText, chatId: chatId })

  } catch (error) {
    console.error('Error en el chat:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
