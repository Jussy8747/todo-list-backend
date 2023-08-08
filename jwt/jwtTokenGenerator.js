import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()

 const generateToken = (res, userId) =>{
const secret = process.env.JWT_SECRET

const token = jwt.sign({userId}, secret, {
    expiresIn: "30d" 
})
res.cookie('jwt', token, {
    httpOnly : true,
    secure   : process.env.NODE_ENV !== 'development', 
    sameSite:'none',
    maxAge: 2592000000 //expires in a month
  
})
}


export default generateToken