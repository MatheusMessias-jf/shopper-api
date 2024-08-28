import chalk from 'chalk'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!, { max: 1 })

const db = drizzle(client)
await migrate(db, { migrationsFolder: 'drizzle' })
console.log(chalk.greenBright('Migrations applied successfully!'))
await client.end()
