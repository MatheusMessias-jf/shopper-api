import postgres from 'postgres'
import * as schema from './schema/index'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from 'src/env'

const client = postgres(env.DATABASE_URL)

export const db = drizzle(client, { schema })
