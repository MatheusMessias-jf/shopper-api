/* eslint-disable camelcase */
import { Router, Request, Response } from 'express'
import { db } from '../db/connection.js'
import { z } from 'zod'

const router = Router()

const paramsSchema = z.object({
  customer_code: z
    .string()
    .min(1, { message: 'O código do cliente é obrigatório' }),
})

const queryParamsSchema = z.object({
  measure_type: z
    .enum(['WATER', 'GAS'], {
      message: 'Tipo de medição inválido',
    })
    .optional(),
})

router.get(
  '/:customer_code/list/:measure_type?',
  async (req: Request, res: Response) => {
    const result = await paramsSchema.safeParseAsync(req.params)
    const resultQueryParams = queryParamsSchema.safeParse(req.query)

    if (!result.success) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: result.error.flatten().fieldErrors,
      })
    }

    if (!resultQueryParams.success) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: resultQueryParams.error.flatten().fieldErrors,
      })
    }

    const customerCode = result.data.customer_code
    const measureType = resultQueryParams.data?.measure_type

    const measures = await db.query.measures.findMany({
      columns: {
        customer_code: false,
      },
      where(fields, { eq, and }) {
        return and(
          eq(fields.customer_code, customerCode),
          measureType ? eq(fields.measure_type, measureType) : undefined,
        )
      },
    })

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      })
    }

    return res.status(200).json({
      [req.params.customer_code]: {
        measures,
      },
    })
  },
)

export default router
