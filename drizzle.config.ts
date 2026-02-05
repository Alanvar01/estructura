import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/bd/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'gimm'
  }
})
