import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import sharp from 'sharp'
import fs from 'fs'
import { promisify } from 'util'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { db } from 'src/db/connection'
import dayjs from 'dayjs'

dotenv.config()
const router = Router()
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const uploadSchema = z.object({
  image: z.string().min(1, { message: 'A imagem é obrigatória' }),
  customer_code: z
    .string()
    .min(1, { message: 'O código do cliente é obrigatório' }),
  measure_datetime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' }),
  measure_type: z.enum(['WATER', 'GAS'], {
    message: 'Tipo de medição inválido',
  }),
})

router.post('/', async (req: Request, res: Response) => {
  const result = await uploadSchema.safeParseAsync(req.body)
  const writeFile = promisify(fs.writeFile)
  const unlink = promisify(fs.unlink)

  if (!result.success) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: result.error.flatten().fieldErrors,
    })
  }

  const measuresIsOnDb = await db.query.measures.findFirst({
    // eslint-disable-next-line camelcase
    where({ customer_code, measure_datetime, measure_type }, { and, eq, gte }) {
      return and(
        eq(customer_code, result.data.customer_code),
        eq(measure_type, result.data.measure_type),
        gte(
          measure_datetime,
          dayjs(result.data.measure_datetime).startOf('month').toDate(),
        ),
      )
    },
  })

  if (measuresIsOnDb) {
    return res.status(409).json({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    })
  }

  const base64Data = result.data.image.replace(/^data:image\/jpeg;base64,/, '')

  const buffer = Buffer.from(base64Data, 'base64')

  const tempFilePath = path.join(__dirname, 'tempImage.jpg')

  await writeFile(tempFilePath, buffer)

  const image = sharp(buffer)
  const metadata = await image.metadata()
  fs.writeFileSync('image.jpg', buffer)

  if (
    metadata === undefined ||
    !(metadata.width! > 0 && metadata.height! > 0)
  ) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Imagem base64 inválida!',
    })
  }

  const uploadResponse = await fileManager.uploadFile(tempFilePath, {
    mimeType: 'image/jpeg',
    displayName: 'Jetpack drawing',
  })

  const textResult = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    {
      text: 'What is the value of the equipment reading of the image in numbers? Tell me just the value and anithing more',
    },
  ])

  console.log(textResult.response.text())

  await unlink(tempFilePath)
})

export default router
