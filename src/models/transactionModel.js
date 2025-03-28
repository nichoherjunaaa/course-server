import mongoose from 'mongoose'
// Declare the Schema of the Mongo model
var transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    }
}, {
    timestamps : true
}
);

//Export the model
const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction