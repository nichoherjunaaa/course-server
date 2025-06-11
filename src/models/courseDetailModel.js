import mongoose from 'mongoose';
var courseDetailSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'text'],
        default : 'video'
    },
    videoId : {
        type : String,
    },
    text : {
        type : String,
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }
}, {
    timestamps: true
});



export default mongoose.model('CourseDetail', courseDetailSchema);