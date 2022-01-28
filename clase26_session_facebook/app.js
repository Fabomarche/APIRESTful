import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import { __dirname } from './utils.js'
//import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import ChatsService from './services/chatsService.js'
import uploadService from './services/uploadService.js'
import chats from './routes/chats.js'
import { UserModel } from './dao/models/User.js'
import initializePassportConfig from './passport-config.js'


const expires = 600
const chatsService = new ChatsService()

export const getConnection = async ()=> {
    try{
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('mongodb+srv://Fabo:Progreso22@clusterfabo.hyrfo.mongodb.net/ecommerce?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
        }
        } catch (err) {
            console.error(err)
        }
}

const app =  express()
const PORT = 8080
const server = app.listen(PORT, () => {
    console.groupCollapsed(`listen on ${PORT} port`)
    getConnection()
})

const io = new Server(server)

io.on('connection', socket => {
    socket.emit('Bienvenido', '¡Sonexión con socket.io establecida!')
    console.log('Cliente conectado.')
    chatsService.getChats()
        .then(result => io.emit('chats', result.payload))
        .catch(err => console.error(err))
    
    socket.on('chats', async data => {
        chatsService.createChat(data)
            .then(result => {
                io.emit('chats', result.payload)
                chatsService.getChats()
                .then(result => {
                    io.emit('chats', result.payload)
                })
                .catch(err => {
                    console.error(err)
                })
            })
        .catch(err => {
            console.error(err)
        })
    })
})

//app.engine('handlebars', engine())
//app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads/', express.static(__dirname + '/uploads'))
app.use(express.static(__dirname + '/public'))

app.use(session({
    store: MongoStore.create({ mongoUrl:'mongodb+srv://Fabo:Progreso22@clusterfabo.hyrfo.mongodb.net/ecommerce?retryWrites=true&w=majority'}),
    secret:"f4b0Facebook",
    resave: false,
    saveUninitialized: false,
    //cookie: { maxAge: expires * 1000 }
}))

app.use(express.static('public'))

initializePassportConfig()

app.use(passport.initialize())
app.use(passport.session())
//Rutas Facebook
app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email']},(req,res)=>{
    
}))
app.get('auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect:'/paginadeFail'
}),(req,res)=>{
    res.send({message:"Logueado!"})
})

//Rutas
app.use('/api/chats', chats)

app.post('/api/register', uploadService.single('avatar'), async (req, res) => {
    try {
        const file = req.file
        const user = req.body
        user.age = parseInt(user.age)
        user.avatar = `${req.protocol}://${req.hostname}:${PORT}/uploads/${file.filename}`
    
        const emailFound = await UserModel.findOne({ email: user.email })
        if (emailFound) throw new Error('Email already exist.')
    
        const usernameFound = await UserModel.findOne({ username: user.username })
        if (usernameFound) throw new Error('Username already exist.')
    
        await UserModel.create(user)
        res.send({ status: 'success', message: 'Registration has been successfully.' })
    } catch (err) {
    console.error(err)
    res.status(400).send({ status: 'error', message: err.message })
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw new Error('Username or password are incorrect.')
        const user = await UserModel.findOne({ email: email })
        if (!user) throw new Error('User not found.')
        if (user.password !== password) throw new Error('Incorrect password.')
        req.session.user = {
        username: user.username,
        email: user.email
        }
        res.send({ status: 'success' })
    } catch (err) {
        console.error(err)
        res.status(400).send({ status: 'error', message: err.message })
    }
})

app.get('/api/login', (req, res) => {
    if (req.session.user)
        res.send(req.session.user)
    else
        res.send({ status: 'error', message: 'You are not log in.' })
})

app.post('/api/logout', (req, res) => {
    const { username } = req.session.user
    req.session.user = null
    res.send({ status: 'success', payload: { username: username } })
})

//Render Views
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

app.get('/logout', (req, res) => {
    res.render('logout')
})