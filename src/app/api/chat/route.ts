// src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { processMessage } from '@/src/lib/ai/agente'


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, message, userName, userRole } = body

    // Validación básica
    if (!userId || !message || !userName || !userRole) {
      return NextResponse.json(
        { error: 'Faltan datos (userId, message, userName, userRole)' },
        { status: 400 }
      )
    }

    console.log(`📩 Mensaje de ${userName}: ${message}`)

    // Llamada al agente
    const responseText = await processMessage(message, userId, userName, userRole)

    // Respuesta exitosa
    return NextResponse.json({ response: responseText })

  } catch (error) {
    console.error('Error en el chat:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
