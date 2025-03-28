import express from 'express'
import { signUpUser, getUser } from '../controller/userController.js'
import { validateRequest } from './../middleware/validateRequest.js';
import { signUpSchema } from '../utils/Schema.js';
const userRoute = express.Router()

userRoute.get('/', getUser)
userRoute.post('/sign-up', validateRequest(signUpSchema) ,signUpUser)

export default userRoute