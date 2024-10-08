import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
  DATABASE_URL: z.string().url(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('Invalid environment variables.', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
