import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    photo : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role : {
        type : String,
        enum : ['manager', 'student'],
        default : 'manager'
    }
});

const User = mongoose.model('User', userSchema);

export default User