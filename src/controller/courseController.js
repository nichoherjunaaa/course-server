import categoryModel from "../models/categoryModel.js";
import courseModel from "../models/courseModel.js"
import userModel from "../models/userModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import fs from 'fs'
export const getCourses = async (req, res) => {
    try {
        const courses = await courseModel.find({
            manager: req.user?._id
        })
            .select('name thumbnail')
            .populate({
                path: 'category',
                select: 'name -_id',
            })
            .populate({
                path: 'students',
                select: 'name',
            });
        
        const imageUrl = process.env.APP_URL + '/uploads/courses/'

        const response = courses.map((item) => {
            return {
                ...item.toObject(),
                thumbnail_url : imageUrl + item.thumbnail
            }
        })

        return res.json({
            message: "get courses success",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const postCourse = async (req, res) => {
    try {
        const body = req.body
        const parse = mutateCourseSchema.safeParse(body);
        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => err.message);

            if (req?.file?.path && fs.existsSync(req?.file?.path)) {
                fs.unlinkSync(req?.file?.path);
            }
            return res.status(500).json({
                message: "Invalid request body",
                data: null,
                errors: errorMessage
            })
        }

        const category = await categoryModel.findById(parse.data.categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        const course = new courseModel({
            name: parse.data.name,
            category: category._id,
            description: parse.data.description,
            tagline: parse.data.tagline,
            thumbnail: req?.file?.filename,
            manager: req.user._id
        })

        await course.save();
        await categoryModel.findByIdAndUpdate(category._id, {
            $push: {
                courses: course._id
            },
        }, {
            new: true
        });

        await userModel.findByIdAndUpdate(req.user._id, {
            $push: {
                course: course._id
            }
        }, {
            new: true
        })

        return res.status(201).json({
            message: "create course success",
            data: course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
