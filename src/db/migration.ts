import chalk from 'chalk'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { env } from '../env'
// import { env } from 'src/env'

const client = postgres(env.DATABASE_URL, { max: 1 })

const db = drizzle(client)
await migrate(db, { migrationsFolder: 'drizzle' })
console.log(chalk.greenBright('Migrations applied successfully!'))
await client.end()
