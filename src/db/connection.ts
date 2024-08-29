import postgres from 'postgres'
import * as schema from './schema/index.js'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '../env.js'

const client = postgres(env.DATABASE_URL)

export const db = drizzle(client, { schema })
