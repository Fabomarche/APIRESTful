import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import initializePassportConfig from './passport-config.js';
import randomApiRouter from './routers/random.js';

const app = express();
const server = app.listen(8080,()=>console.log(`Listening on 8080`))
const connection  = mongoose.connect('mongodb+srv://Fabo:Progreso22@clusterfabo.hyrfo.mongodb.net/ecommerce?retryWrites=true&w=majority');

app.use(cors());
app.use(session({
    store:MongoStore.create({mongoUrl:'mongodb+srv://Fabo:Progreso22@clusterfabo.hyrfo.mongodb.net/ecommerce?retryWrites=true&w=majority'}),
    secret:"f4b0Facebook",
    resave:false,
    saveUninitialized:false
}))
app.use(express.static('public'))
app.use(express.json());
initializePassportConfig();
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/facebook',passport.authenticate('facebook',{scope:['email']}),(req,res)=>{

})
app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/failPage'
}),(req,res)=>{
    res.send({message:"FINALMENTE, logueado :)"})
})

app.get('/failPage', (req, res) => {
    res.send({ message: 'Ha fallado el inicio de sesión en Facebook.' })
  })

app.get('/logout',(req,res)=>{
    req.logout();
})

app.get('/info',(req,res) => {
    const info = {
        argv: process.argv,
        execPath: process.execPath,
        platform: process.platform,
        processId: process.pid,
        version: process.version,
        projectDir: process.cwd(),
        reservedMemory: process.memoryUsage().rss
    }
    res.send(info)
})

app.use("/api", randomApiRouter)