import express from 'express'
import { signUpUser, getUser, signInUser } from '../controller/userController.js'
import { validateRequest } from './../middleware/validateRequest.js';
import { signInSchema, signUpSchema } from '../utils/Schema.js';
const userRoute = express.Router()

userRoute.get('/', getUser)
userRoute.post('/sign-up', validateRequest(signUpSchema) ,signUpUser)
userRoute.post('/sign-in', validateRequest(signInSchema), signInUser)

export default userRoute