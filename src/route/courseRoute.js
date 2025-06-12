import express from 'express'
import { deleteCourse, getCategories, getCourseById, getCourses, postContentCourse, postCourse, updateCourse } from '../controller/courseController.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { fileFilter, fileStorageCourse } from '../utils/multer.js'
import multer from 'multer'
import { validateRequest } from './../middleware/validateRequest.js';
import { mutateContentSchema } from '../utils/schema.js'

const courseRoute = express.Router()
const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoute.get('/', verifyToken, getCourses)
courseRoute.get('/categories', verifyToken, getCategories)
courseRoute.get('/:id', verifyToken, getCourseById)
courseRoute.post('/', verifyToken, upload.single('thumbnail'), postCourse)
courseRoute.put('/:id', verifyToken, upload.single('thumbnail'), updateCourse)
courseRoute.delete('/:id', verifyToken, deleteCourse)

courseRoute.post('/content', verifyToken, validateRequest(mutateContentSchema), postContentCourse);

export default courseRoute