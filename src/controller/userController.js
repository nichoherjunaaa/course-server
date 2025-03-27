import User from "../models/userModel.js"
import bcrypt from "bcrypt"
export const getUser = async (req, res) => {
    res.send('get user')
}

export const signUpUser = async (req, res) => {
    try {
        const body = req.body;
        const hashPassword = bcrypt.hashSync(body.password, 12);
        const user = new User({
            name : body.name,
            email : body.email,
            password : hashPassword,
            role : 'manager'
        })
        await user.save();
        return res.json({
            data: {
                midtrans_payment_url: "https://google.com"
            },
            message: 'User created'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : 'Internal Server Error'})
    }
}

export const updateUser = async (req, res) => {
    res.send('update user')
}

export const deleteUser = async (req, res) => {
    res.send('delete user')
}
