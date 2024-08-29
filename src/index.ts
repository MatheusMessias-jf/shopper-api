import express from 'express'
import upload from './routes/upload'
import confirm from './routes/confirm'
import list from './routes/list'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json())

app.use(upload)
app.use(confirm)
app.use(list)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
