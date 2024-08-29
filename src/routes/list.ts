/* eslint-disable camelcase */
import { Router, Request, Response } from 'express'
import { db } from '../db/connection.js'
import { z } from 'zod'

const router = Router()

const paramsSchema = z.object({
  customer_code: z
    .string()
    .min(1, { message: 'O código do cliente é obrigatório' }),
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

    if (!result.success) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: result.error.flatten().fieldErrors,
      })
    }

    let measures

    if (result.data.measure_type !== undefined) {
      measures = await db.query.measures.findMany({
        columns: {
          customer_code: false,
        },
        where({ customer_code, measure_type }, { eq, and }) {
          return and(
            eq(customer_code, result.data.customer_code),
            eq(measure_type, result.data.measure_type as 'WATER' | 'GAS'),
          )
        },
      })
    } else {
      measures = await db.query.measures.findMany({
        columns: {
          customer_code: false,
        },
        where({ customer_code }, { eq }) {
          return eq(customer_code, req.params.customer_code)
        },
      })
    }

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
