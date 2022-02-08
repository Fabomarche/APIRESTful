import express from 'express';
import cluster from 'cluster'
import core from 'os'
import os from 'os'
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv'
import minimist from 'minimist';
import cors from 'cors';
import initializePassportConfig from './passport-config.js';
import randomApiRouter from './routers/random.js';

dotenv.config()

let minimizedArg = minimist(process.argv.slice(2))
let config ={
    port: minimizedArg.p || 8080,
}

console.log()
const app = express();

if(cluster.isMaster){
    console.log(`Proceso primario con pid ${process.pid}`)
    for(let i=0; i < core.cpus().length; i++){
        cluster.fork()
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker ${worker.process.pid} killed`)
        cluster.fork()
        console.log(`worker restaurado`)
    })
}else{
    console.log(`soy un worker con pid ${process.pid}`)
    const server = app.listen(config.port ,()=>console.log(`worker ${process.pid} en el puerto ${config.port}`))
}

const connection  = mongoose.connect(process.env.MONGO_URL);

console.log()

app.use(cors());
app.use(session({
    store:MongoStore.create({mongoUrl:process.env.MONGO_URL}),
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(express.static('public'))
app.use(express.json());
initializePassportConfig();
app.use(passport.initialize());
app.use(passport.session());


app.get('/info',(req,res)=>{
    res.send({
        status: 'success',
        payload: {
            args: process.argv,
            os: process.platform,
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            execPath: process.execPath,
            processId: process.pid,
            projectFolder: process.cwd(),
            cores: os.cpus().length
            }
        })
})


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