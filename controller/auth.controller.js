import bcrypt from 'bcrypt'
import User from "../model/auth.model.js"
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

 export const registerUser = async(req,res) => {
try {
    const {name, email, password, domain, skills} = req.body
    if(!name || !email || !password) {
    return res.status(400).json({
        success : false,
        message : "All Fields are Required"
    })
    }
    if(password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "password should be atleast 8 charr"
        })
    }
    const existUser = await User.findOne({email})

    if(existUser) {
     return res.status(400).json({
        success : false,
        message : "User already exists"
    })

    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        domain,
        skills
    })
    return res.status(201).json({
        success : true,
        message: "user created successfully",
        user
    })
} catch (e) {
   return res.status(201).json({
        success : false,
        message: "Internal server error"
    })
}
}

export const loginUser = async(req,res)=> {
    try{
const {email,password} = req.body

const jwtSecret = process.env.JWT_SCERET
if (!jwtSecret) {
    console.error("JWT_SCERET is missing from the environment")
    return res.status(500).json({
        success: false,
        message: "Authentication is not configured"
    })
}

const user = await User.findOne({email}).select('+password')
   if(!user) {
     return res.status(400).json({
        success : false,
        message: "Invalid Email and Password"
    })
   }
   const isMatch =  await bcrypt.compare(password, user.password)
     if(!isMatch) {
       return res.status(400).json({
        success : false,
        message: "Invalid Password"
    })
}

    const token = jwt.sign({userId : user._id}, jwtSecret)
     
       return res.status(200).json({
        success : true,
        message: "Login successfully",
        user,
        token
    })
    } catch(e) {
        console.error("Login error:", e)
        return res.status(500).json({
        success : false,
        message: "Internal server error"
    })
    }}