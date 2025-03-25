import User from "../models/userModel.js"

export const getUser = async (req, res) => {
    res.send('get user')
}

export const createUser = async (req, res) => {
    const { email, name, mobile, password } = req.body
    const user = await User.create({ email, name, mobile, password })
    res.status(201).json({
        data : user,
        success : true
    })
}

export const updateUser = async (req, res) => {
    res.send('update user')
}

export const deleteUser = async (req, res) => {
    res.send('delete user')
}
