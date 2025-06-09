import express from 'express'
import { getCourses, postCourse } from '../controller/courseController.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { fileFilter, fileStorageCourse } from '../utils/multer.js'
import multer from 'multer'

const courseRoute = express.Router()
const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoute.get('/', verifyToken, getCourses)
courseRoute.post('/', verifyToken, upload.single('thumbnail'), postCourse)

export default courseRoute