/* eslint-disable camelcase */
import { eq } from 'drizzle-orm'
import { Router, Request, Response } from 'express'
import { db } from '../db/connection.js'
import { measures } from '../db/schema/measures.js'
import { z } from 'zod'

const router = Router()

const confirmSchema = z.object({
  measure_uuid: z.string().min(1, { message: 'O id da medição é obrigatório' }),
  confirmed_value: z.coerce.number({
    message: 'A medição deve ser um número válido',
  }),
})

router.patch('/confirm', async (req: Request, res: Response) => {
  const result = await confirmSchema.safeParseAsync(req.body)

  if (!result.success) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: result.error.flatten().fieldErrors,
    })
  }

  const measureIsOnDb = await db.query.measures.findFirst({
    where({ measure_uuid }, { eq }) {
      return eq(measure_uuid, result.data.measure_uuid)
    },
  })

  if (!measureIsOnDb) {
    return res.status(404).json({
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Leitura não encontrada',
    })
  }

  if (measureIsOnDb.has_confirmed) {
    return res.status(409).json({
      error_code: 'CONFIRMATION_DUPLICATE',
      error_description: 'Leitura já confirmada',
    })
  }

  await db
    .update(measures)
    .set({ has_confirmed: true, measure_value: result.data.confirmed_value })
    .where(eq(measures.measure_uuid, measureIsOnDb.measure_uuid))

  return res.status(200).json({
    success: true,
  })
})
export default router
