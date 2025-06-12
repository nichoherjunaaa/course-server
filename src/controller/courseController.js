import categoryModel from "../models/categoryModel.js";
import courseModel from "../models/courseModel.js";
import courseDetailModel from "../models/courseDetailModel.js";
import userModel from "../models/userModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import fs from 'fs'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
                thumbnail_url: imageUrl + item.thumbnail,
                total_students: item.students.length
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

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        return res.json({
            message: "get categories success",
            data: categories
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseModel.findById(id).populate({
            path: 'details',
            select: 'title type',
        });
        return res.json({
            message: "get course by id success",
            data: course
        })
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

export const updateCourse = async (req, res) => {
    try {
        const body = req.body
        const courseId = req.params.id
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

        const oldCourse = await courseModel.findById(courseId)
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }
        if (!oldCourse) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        const courseUpdate = await courseModel.findByIdAndUpdate(courseId,
            {
                name: parse.data.name,
                category: category._id,
                description: parse.data.description,
                tagline: parse.data.tagline,
                thumbnail: req?.file ? req.file?.filename : oldCourse.thumbnail,
                manager: req.user._id
            }, {
            new: true
        }
        )
        return res.status(201).json({
            message: "update course success",
            data: courseUpdate
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseModel.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'courses', course.thumbnail);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await courseModel.findByIdAndDelete(id);
        return res.json({ message: "Delete course success" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const postContentCourse = async (req, res) => {
    try {
        const body = req.body

        const course = await courseModel.findById(body.courseId)

        const content = new courseDetailModel({
            title: body.title,
            type: body.type,
            course: course._id,
            text: body.text,
            youtubeId: body.youtubeId
        })
        await content.save()
        await courseModel.findByIdAndUpdate(course._id, {
            $push: {
                details: content._id
            }
        }, {
            new: true
        })
        return res.status(201).json({
            message: "create content success",
            data: content
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
export const updateContentCourse = async (req, res) => {
    try {
        const { id } = req.params
        const body = req.body

        const course = await courseModel.findById(body.courseId)

        await courseDetailModel.findByIdAndUpdate(id, {
            title: body.title,
            type: body.type,
            course: course._id,
            text: body.text,
            youtubeId: body.youtubeId
        }, {
            new: true
        })
        return res.status(201).json({
            message: "update course content success",
            data: course
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const deleteContentCourse = async (req, res) => {
    try {
        const { id } = req.params
        const course = await courseDetailModel.findByIdAndDelete(id)
        return res.status(201).json({
            message: "delete course content success"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}