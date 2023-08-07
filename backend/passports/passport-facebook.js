import passport from "passport";
import env from 'dotenv'
env.config()
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '../schema/UserSchema.js'

// Set up the Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'email']
    },
    async (accessToken, refreshToken, profile, cb) => {
     
      let userExist= await User.findOne({email: profile.emails[0].value});
            
      if (userExist) {
          return done(null, userExist);
      } else {
          const userItem = {
            facebookId: profile.id,
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
});;


