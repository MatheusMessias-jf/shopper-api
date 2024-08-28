import postgres from 'postgres'
import * as schema from './schema/index'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'

dotenv.config()

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client, { schema })
