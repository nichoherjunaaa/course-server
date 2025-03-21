import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { exampleSchema } from '../utils/schema.js'
const globalRoute = express.Router()

globalRoute.get('/', (req, res) => {
    res.json({message : "hello world"})
})

globalRoute.post('/validate', validateRequest(exampleSchema), async(req,res) => {
    return res.json({message : "success"})
})

export default globalRoute