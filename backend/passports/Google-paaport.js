import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import generateToken from '../jwt/jwtTokenGenerator.js';
import passport from "passport";
import User from '../schema/UserSchema.js'
import env from 'dotenv'
env.config()

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done)=>{
         
            let userExist= await User.findOne({email: profile.emails[0].value});
            
            if (userExist) {
                return done(null, userExist);
            } else {
                const userItem = {
                    googleId: profile.id,
                    name: profile.displayName,
                    provider: profile.provider,
                    email: profile.emails ? profile.emails[0].value : null
                };
        
                const user = await User.create(userItem);
                return done(null, user);
            }

    }
    )
);

passport.serializeUser((user, done)=>{
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
