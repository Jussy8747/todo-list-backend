import express from 'express'
import {registerUser, loginUser, logOutUser, loginWithFacebookAndGoogle, getProfile, 
    logoutFacebookAndgoogle, forgetPassword, resetPassword, 
    resetPasswordWithToken, reset_password} from '../controller/UserController.js'
import { addTodo, getTodo, deleteTodo, clearTodo, 
  searchTodoInDay, searchTodo} from '../controller/todosControlers.js'
import {authMiddleware} from '../middleWare/authMiddleWare.js'
import '../passports/Google-paaport.js'
import '../passports/passport-facebook.js'
import passport from 'passport'
import cors from 'cors'
const router = express.Router()



// register user
router.post('/register', registerUser)
router.post('/signin', loginUser)
router.get('/profile', authMiddleware, getProfile )
router.get('/auth/logout', logoutFacebookAndgoogle)
router.post('/logout', logOutUser)
router.post('/addTodo', authMiddleware, addTodo)
router.get('/getTodo', authMiddleware, getTodo)
router.get('/search', authMiddleware, searchTodo)
router.get('/search/dayofweek', authMiddleware, searchTodoInDay)
router.delete('/:itemId', authMiddleware, deleteTodo)
router.delete('/clear/:dayOfWeek', authMiddleware, clearTodo)

router.get('/auth/google', cors({ origin: 'https://radiant-frangipane-073e2d.netlify.app' }),
  passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/auth/google/callback', cors({ origin: 'https://radiant-frangipane-073e2d.netlify.app' }),
passport.authenticate('google'),
loginWithFacebookAndGoogle
)


router.get('/auth/facebook',  cors({ origin: 'https://radiant-frangipane-073e2d.netlify.app' }),
  passport.authenticate('facebook',  { scope: ['profile', 'email'] }));

router.get('/auth/facebook/callback',  cors({ origin: 'https://radiant-frangipane-073e2d.netlify.app' }),
  passport.authenticate('facebook'),
  loginWithFacebookAndGoogle
  );


router.post('/forgetpassword', forgetPassword)

router.get('/reset-password/:id/:token', resetPassword)
router.post('/resetPassword', resetPasswordWithToken)
router.post('/reset-password', reset_password)


export default router

