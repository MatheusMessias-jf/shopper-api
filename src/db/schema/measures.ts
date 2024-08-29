import { boolean, pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { v4 } from 'uuid'

export const measures = pgTable('measures', {
  measure_uuid: text('measure_uuid')
    .primaryKey()
    .$defaultFn(() => v4()),
  measure_datetime: timestamp('measure_datetime').notNull(),
  measure_type: text('measure_type').notNull(),
  has_confirmed: boolean('has_confirmed').notNull().default(false),
  image_url: text('image_url').notNull(),
  customer_code: text('customer_code').notNull(),
  measure_value: integer('measure_value'),
})
