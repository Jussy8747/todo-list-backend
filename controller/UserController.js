import asyncHandler from 'express-async-handler'
import User from '../schema/UserSchema.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import env from 'dotenv'
env.config()
import generateToken from '../jwt/jwtTokenGenerator.js'
import PasswordResetToken from '../schema/ResetPasswordTokenSchema.js'



// register user
 const registerUser = asyncHandler(async (req, res)=>{
    const {name, email, password} = req.body

    const userExist = await User.findOne({email})

    if(userExist){
        res.status(400).json('Email already exist')
    }
    
    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            name: user.name,
            id : user._id,
            email: user.email,
            password: user.password
        })
    }else{
        res.status(400)
        throw new Error('invalide user data')
    }


   

// res.status(200).json({messsge: 'register user'})
})


const loginUser = asyncHandler(async (req, res)=>{
const {email, password} = req.body

const user = await User.findOne({email})

if(user && (await user.matchPassword(password))){
    generateToken(res, user._id)
    res.status(201).json(
        {
            _id : user._id,
            name: user.name,
            email: user.email

        },
    )
}else{
    res.status(401)
    throw new Error('invilid email or password')
}
    // res.status(200).json({messsge: 'login user'})
})

const getProfile = asyncHandler( async (req, res)=>{

  try {
    const user = {
      _id: req.user._id,
      name : req.user.name,
      email: req.user.email,
  }
  res.status(200).json(user)
  } catch (error) {
    throw new Error(error)
  }
    
})



const logOutUser = asyncHandler(async (req, res)=>{
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })  
        
        res.status(200).json({message: 'logged out'})
    } catch (error) {
        res.status(404).json({message: error})
    }
   
    })



const loginWithFacebookAndGoogle = asyncHandler( async (req, res)=>{
    const user = req.user
    
    generateToken(res, user._id)
   res.redirect('https://radiant-frangipane-073e2d.netlify.app/mainpage')
})

const logoutFacebookAndgoogle = asyncHandler( async(req, res)=>{
    
    req.logout(function (err) {
        if (err) {
          return res.status(401).json({ message: 'Unable to log out' });
        }
    })
   
    req.session.cookie.maxAge = 0
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })  
       
        res.status(200).json({message: 'logged out'})
  
   
})

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(404); // Not Found
        throw new Error("Email not registered");
      }
  
      const secret = process.env.JWT_SECRET + user.password;
      const userId = user._id;
      const token = jwt.sign({ userId, type: "reset" }, secret, {
        expiresIn: "10m",
      });
  
      const link = `http://ec2-3-84-162-115.compute-1.amazonaws.com/users/reset-password/${userId}/${token}`;

      
      const Token = 100000 + Math.floor(Math.random() * 900000)
      
      await PasswordResetToken.create({ user: user._id, token: Token });
     
     

      const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD
        }
      }

      const transporter = nodemailer.createTransport(config)

      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/'
        }
    })

    const response= {
        body: {
          name: user.name, // Recipient's name
          intro: 'You have requested to reset your password. Please click the link below:',
          action: {
            instructions: 'Click the button below to reset your password:',
            button: {
              color: '#22BC66',
              text: 'Reset Password',
              link: link // Replace with your actual reset password link
            }
          },
          outro: `Your 6-digit token is: ${String(Token)}` // Replace with the actual 6-digit token
        }
      };

    const mail = mailGenerator.generate(response)

    const msg = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: "Todo App - Reset Your Password!", // Subject line
        html: mail // Body of the message
    }

    transporter.sendMail(msg).then(()=>{
        return res.status(201).json(({
           message: 'email sent!'
        }))
    }).catch((error)=>{
        throw new Error(error);
       
    })
    
    } catch (error) {
      res.status(400);
      throw new Error(`Something went wrong ${error}`);
    }
  });
  

const resetPassword = asyncHandler( async (req, res)=>{
    const {token, id} = req.params
  try {
    const user = await User.findById(id)
    if (!user) {
        res.status(404); // Not Found
        return next(new Error(`Something went wrong`));
      }

    const secret = process.env.JWT_SECRET + user.password;
    const verify =  jwt.verify(token,secret);
    if(verify){
   res.redirect( `https://radiant-frangipane-073e2d.netlify.app/reset-password/:${id}`)
    }
  } catch (error) {
    res.status(400)
    throw new Error(error);

  }
    
       
    
       
})

const resetPasswordWithToken = asyncHandler( async (req, res)=>{
  const {token } = req.body

  try {
    const userToken = await PasswordResetToken.findOne({ token });
    if(!userToken){
        res.status(404);
        throw new Error('User not found or token is invalid or Token has expired');
      }
      const userId = userToken.user
     res.status(201).json({userId})
  } catch (error) {
    res.status(400);
    throw new Error(`Password reset failed: ${error.message}`); 
  }
})

const reset_password= asyncHandler( async (req, res)=>{
    const {password, userId} = req.body
  
    const user = await User.findById(userId)
    if(!user){
        res.status(404);
        throw new Error('User not found or token is invalid');
    }
  
    user.password = password;
    user.resetToken = null; // Clear the resetToken data after resetting the password
      await user.save();
   
    

    res.status(201).json({
      message:'Password successfully changed'
    })
})



export {registerUser, loginUser, logOutUser, loginWithFacebookAndGoogle, getProfile, 
     forgetPassword, logoutFacebookAndgoogle, resetPassword, resetPasswordWithToken, reset_password }
