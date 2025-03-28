import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
dotenv.config()
import db from './config/dbConnection.js'

import globalRoute from './route/globalRoute.js'
import userRoute from './route/userRoute.js'
import paymentRoute from './route/paymentRoute.js'

const app = express()
const PORT = process.env.PORT || 3001
db()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.send('api ready !')
})

app.use('/api', globalRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/payment', paymentRoute)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})