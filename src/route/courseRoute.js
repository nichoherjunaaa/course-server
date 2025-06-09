import express from 'express'
import { getCourses } from '../controller/courseController.js'
import { verifyToken } from '../middleware/verifyToken.js'
const courseRoute = express.Router()

courseRoute.get('/', verifyToken, getCourses)

export default courseRoute