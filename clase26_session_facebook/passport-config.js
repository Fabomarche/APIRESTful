import passport from "passport";
import fbStrategy from "passport-facebook"
import { UserModel } from "./dao/models/User.js";

const FacebookStrategy = fbStrategy.Strategy

const initializePassportConfig = ()=> {
    passport.use('facebook', new FacebookStrategy({
        clientID:'333143892148690',
        clientSecret:'1aa04e42f3e190501101e47f35959a39',
        callbackURL:'https://50d8-181-191-67-161.ngrok.io/auth/facebook/callback',
        profileFields:['emails']
    },async (accessToken, refreshToken, profile, done)=>{
        try{
            console.log(accessToken)
            console.log(profile)
            let user = await UserModel.findOne({email:profile.emails[0].value})
            done=(null,user)
        }catch(error){
            done(error)
        }

    }))

    passport.serializeUser((user, done)=>{
        done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        UserModel.findById(id,done)
    })
}


export default initializePassportConfig