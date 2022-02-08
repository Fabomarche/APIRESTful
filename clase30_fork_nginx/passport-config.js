import passport from 'passport';
import fbStrategy from 'passport-facebook';
import dotenv from 'dotenv'
import { users } from './model/User.js';
const FacebookStrategy = fbStrategy.Strategy;

dotenv.config()

const initializePassportConfig = () =>{
    passport.use('facebook',new FacebookStrategy({
        clientID:process.env.FB_CLIENT_ID,
        clientSecret:process.env.FB_CLIENT_SECRET,
        callbackURL:process.env.FB_CALLBACK_URL,
        profileFields:['emails']
    },async (accessToken,refreshToken,profile,done)=>{
        try{
            console.log(accessToken);
            console.log(profile);
            let user = await users.findOne({email:profile.emails[0].value})
            done(null,user);
        }catch(error){
            done(error);
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser((id,done)=>{
        users.findById(id,done);
    })
}

export default initializePassportConfig;