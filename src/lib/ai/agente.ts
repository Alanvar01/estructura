import { MemorySaver } from '@langchain/langgraph'
import { ChatOllama } from '@langchain/ollama'
import { createAgent } from 'langchain' 


const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || ''

const checkpointer = new MemorySaver()

const model = new ChatOllama({
  model: 'nemotron-3-nano:30b-cloud', 
  temperature: 0,
  baseUrl: 'https://ollama.com',
  maxRetries: 2,
  headers: {
    Authorization: `Bearer ${OLLAMA_API_KEY}`
  }
})

const agente = createAgent({
  model,
  checkpointer
})

export async function processMessage(
  message: string, 
  userId: number | string, 
  userName: string, 
  userRole: string
) {
  const now = new Date().toLocaleString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const systemContext = `Instrucciones del Sistema:
  - Hoy es: ${now}.
  - Estás hablando con el usuario: "${userName}" (ID: ${userId}).
  - Su rol es: "${userRole}".
  - Responde siempre teniendo en cuenta esta información.`

  const stream = await agente.stream(
    { 
      messages: [
        { role: 'system', content: systemContext },
        { role: 'human', content: message }
      ] 
    },
    {
      configurable: { thread_id: userId.toString() },
      streamMode: 'values'
    }
  )

  let response = ''
  for await (const chunk of stream) {
    const latestMessage = chunk.messages.at(-1)
    if (latestMessage?.type === 'ai') {
      response += latestMessage.content
    }
  }

  return response
}
