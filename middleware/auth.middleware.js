import jwt from "jsonwebtoken"
import User from "../model/auth.model.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                msg: "Bearer token is required"
            })
        }

        const token = authorization.slice("Bearer ".length)
        const secret = process.env.JWT_SCERET
        if (!secret) {
            console.error("JWT_SCERET is missing from the environment")
            return res.status(500).json({
                msg: "Authentication is not configured"
            })
        }

        const decoded = jwt.verify(token, secret)
        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                msg: "User not found"
            })
        }

        req.user = user
        next()
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                msg: "Invalid or expired token"
            })
        }

        console.error("Auth middleware error:", err)
        return res.status(500).json({
            msg: "Authentication failed"
        })
    }
}