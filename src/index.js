import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
dotenv.config()

import globalRoute from './route/globalRoute.js'
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', globalRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})