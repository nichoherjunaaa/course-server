import User from "../models/userModel.js"
import Transaction from './../models/transactionModel.js';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
export const getUser = async (req, res) => {
    res.send('get user')
}

export const signUpUser = async (req, res) => {
    const midtransUrl = process.env.MIDTRANS_URL;
    const midtransAuthString = process.env.MIDTRANS_AUTH_STRING;
    // console.log(midtransUrl, midtransAuthString);
    try {
        const body = req.body;
        const hashPassword = bcrypt.hashSync(body.password, 12);
        const user = new User({
            name: body.name,
            email: body.email,
            photo: "defautl.png",
            password: hashPassword,
            role: 'manager'
        })
        const transaction = new Transaction({
            user: user._id,
            price: 280000
        })
        const response = await fetch(midtransUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${midtransAuthString}`
            },
            body: JSON.stringify({
                transaction_details: {
                    order_id: transaction._id.toString(),
                    gross_amount: transaction.price
                },
                credit_card: {
                    secure: true
                },
                customer_details: {
                    email: user.email,
                },
                callbacks: {
                    finish: "http://localhost:5173/success-checkout"
                }
            })
        });

        const resMidtrans = await response.json();
        console.log(resMidtrans);


        await user.save();
        await transaction.save();
        return res.json({
            data: {
                midtrans_payment_url: resMidtrans.redirect_url
            },
            message: 'User created'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const signInUser = async (req, res) => {
    try {
        const body = req.body;
        const existingUser = await User.findOne({ email: body.email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const comparePassword = bcrypt.compareSync(
            body.password,
            existingUser.password
        )
        if (!comparePassword) {
            return res.status(404).json({
                message: "Password not match"
            })
        }
        const isValidUser = await Transaction.findOne({ user: existingUser._id, status: 'success' });
        if (existingUser.role !== 'student' && !isValidUser) {
            return res.status(404).json({
                message: "User not verified"
            })
        }
        if (!existingUser) {
            throw new Error("User not found");
        }

        const token = jwt.sign(
            {
                data: {
                    id: existingUser._id.toString()
                }
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '1d'
            }
        );

        return res.json({
            message: "Login success",
            data: {
                name: existingUser.name,
                email: existingUser.email,
                token,
                role: existingUser.role
            },
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const updateUser = async (req, res) => {
    res.send('update user')
}

export const deleteUser = async (req, res) => {
    res.send('delete user')
}
