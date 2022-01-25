import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import { __dirname } from './utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import ChatsService from './services/chatsService.js'
import uploadService from './services/uploadService.js'

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

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads/', express.static(__dirname + '/uploads'))
app.use(express.static(__dirname + '/public'))

app.use(session({
    store: MongoStore.create({ mongoUrl:'mongodb+srv://Fabo:Progreso22@clusterfabo.hyrfo.mongodb.net/ecommerce?retryWrites=true&w=majority'}),
    secret:"f4b0",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: expires * 1000 }
}))

app.use('/api/chats', chats)

app.post('/api/register', uploadService.single('avatar'), async (req, res) => {
    try {
        const file = req.file
        const user = req.body
        user.age = parseInt(user.age)
        user.avatar = `${req.protocol}://${req.hostname}:${PORT}/uploads/${file.filename}`
    
        const emailFound = await UserModel.findOne({ email: user.email })
        if (emailFound) throw new Error('Email already in use.')
    
        const usernameFound = await UserModel.findOne({ username: user.username })
        if (usernameFound) throw new Error('Username already in use.')
    
        await UserModel.create(user)
        res.send({ status: 'success', message: 'Registration has been successfully.' })
    } catch (err) {
    console.error(err)
    res.status(400).send({ status: 'error', message: err.message })
    }
})