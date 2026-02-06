'use server'

import { db } from '@/src/bd'
import { conversaciones, mensajes } from '@/src/bd/schema'
import { eq, desc } from 'drizzle-orm'

export async function getConversations(userId: number) {
  const data = await db
    .select()
    .from(conversaciones)
    .where(eq(conversaciones.userId, userId))
    .orderBy(desc(conversaciones.createdAt))
  
  return data
}

export async function getChatMessages(chatId: number) {
  const data = await db
    .select()
    .from(mensajes)
    .where(eq(mensajes.conversacionId, chatId))
    .orderBy(mensajes.createdAt)
    
  return data
}
