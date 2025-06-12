import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
    const secretKey = process.env.JWT_SECRET_KEY ?? "";

    try {
        if (req?.headers?.authorization?.startsWith("JWT ")) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, secretKey); // ← bisa lempar error kalau expired / invalid

            const user = await userModel.findById(decoded.data.id, "_id name email role");

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            };

            return next();
        } else {
            return res.status(401).json({ message: "Unauthorized: Token format is invalid" });
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            console.error("Token verification error:", error);
            return res.status(500).json({ message: "Internal server error during token verification" });
        }
    }
};
