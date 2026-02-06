import { MemorySaver } from '@langchain/langgraph'
import { createReactAgent } from '@langchain/langgraph/prebuilt' 
import { ChatOllama } from '@langchain/ollama'
import { searchProductsTool, searchMachinesTool, listProveedoresTool } from './tools'

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || ''


const tools = [searchProductsTool, searchMachinesTool, listProveedoresTool]

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


const agente = createReactAgent({
  llm: model,
  tools: tools,
  checkpointSaver: checkpointer
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
  - Tienes acceso a una base de datos de la empresa mediante herramientas.
  - SIEMPRE que te pregunten por productos, máquinas o proveedores, USA las herramientas disponibles antes de responder.
  - Si la herramienta devuelve información, úsala para dar una respuesta natural y amable.
  - Si no encuentras información, dilo honestamente.`

  
  const result = await agente.invoke(
    { 
      messages: [
        { role: 'system', content: systemContext },
        { role: 'human', content: message }
      ] 
    },
    {
      configurable: { thread_id: userId.toString() }
    }
  )

 
  const lastMessage = result.messages[result.messages.length - 1]
  return lastMessage.content as string
}
