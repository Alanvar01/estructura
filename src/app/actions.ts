'use server'

import { db } from '@/src/bd'
import { conversaciones, mensajes, usuarios } from '@/src/bd/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

export async function deleteConversation(chatId: number) {
  try {
    await db.delete(mensajes).where(eq(mensajes.conversacionId, chatId))
    await db.delete(conversaciones).where(eq(conversaciones.id, chatId))
    return { success: true }
  } catch (error) {
    console.error('Error eliminando chat:', error)
    return { success: false }
  }
}



//FUNCIONES DE AUTENTICACIÓN 


const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida')
})

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
      return 'Datos inválidos.'
    }

    const { username, password } = result.data

    const userFound = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.username, username))
      .then((res) => res[0])

    if (!userFound || userFound.password !== password) {
      return 'Credenciales incorrectas.'
    }
    const sessionData = JSON.stringify({
      userId: userFound.id,
      username: userFound.username,
      role: userFound.role
    })

    const cookieStore = await cookies()
    cookieStore.set('session_gimm', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/'
    })

  } catch (error) {
    console.error('Error de auth:', error)
    return 'Error del servidor.'
  }

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session_gimm')
  redirect('/sign-in')
}


export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session_gimm')
  
  if (!sessionCookie) return { username: 'Usuario', role: 'invitado' }

  try {
    const session = JSON.parse(sessionCookie.value)
    const userFound = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, session.userId))
      .then(res => res[0])

    if (!userFound) return { username: 'Usuario', role: 'invitado' }

    return {
      username: userFound.username,
      role: userFound.role
    }
  } catch (error) {
    console.error('Error leyendo sesión:', error)
    return { username: 'Usuario', role: 'invitado' }
  }
}
