import express from 'express';
import path from 'path'
import cors from 'cors';
import env from 'dotenv';
import UserRoute from './routes/UserRoute.js';
import connectDb from './database/db.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'cookie-session';
import {notFound, errorHandler} from './middleWare/errorMiddleware.js'


const app = express();

env.config();

connectDb();

app.use(cors())

app.use(cookieParser());


app.use(
  session({
    secret: process.env.JWT_SECRET, // Replace with a random secret for session data encryption
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set 'secure' to true in production environment
      sameSite: 'strict',
      maxAge: 2592000000, // Expires in a month (30 days)
    },
  })
);



app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res)=>{
  res.send('server is ready')
})
app.use('/users', UserRoute); 


app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT;
app.listen(port, () =>  console.log(`Server started on port ${port}`));
