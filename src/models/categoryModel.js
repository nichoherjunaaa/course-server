import mongoose from 'mongoose' // Erase if already required

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model('Category', categorySchema);