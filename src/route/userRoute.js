import express from 'express'
import { createUser, getUser } from '../controller/userController.js'
const userRoute = express.Router()

userRoute.get('/', getUser)
userRoute.post('/', createUser)

export default userRoute