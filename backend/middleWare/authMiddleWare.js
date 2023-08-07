import User from "../schema/UserSchema.js";
import  jwt  from "jsonwebtoken";
import env from 'dotenv'
import asyncHandler from 'express-async-handler'
env.config()

const authMiddleware = asyncHandler (async (req, res, next)=>{
    
        const token = req.cookies.jwt
        if(token){
            try {
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
            

            req.user = await User.findById(decodeToken.userId).select('-password')
                next()
            } catch (error) {
                res.status(401).json({message: 'Not Authorize'})
            }
        }else{
            res.status(401).json({message: 'not authorize'})
        }
})


export {authMiddleware}