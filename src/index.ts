import express from 'express'
import upload from './routes/upload'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json())

app.use('/upload', upload)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
