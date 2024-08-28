import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
