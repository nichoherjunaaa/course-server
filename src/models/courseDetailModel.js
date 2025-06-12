import mongoose from 'mongoose';
import courseModel from "./courseModel.js";

var courseDetailSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'text'],
        default: 'video'
    },
    youtubeId: {
        type: String,
    },
    text: {
        type: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
}, {
    timestamps: true
});

courseDetailSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await courseModel.findByIdAndUpdate(doc.course, {
            $pull: {
                details: doc._id
            }
        })
    }
});


export default mongoose.model('CourseDetail', courseDetailSchema);