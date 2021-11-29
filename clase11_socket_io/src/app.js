import express from 'express'
import cors from 'cors'
import upload from './services/upload.js'
import Container from './classes/Container.js'
import { engine } from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'

const app = express()
const server = app.listen(8080, () => {
    console.log("server listening on port 8080")
})
export const io = new Server(server)

const productsContainer = new Container('products');
const chatContainer = new Container('chat')
console.log(chatContainer.getAll())

app.engine('handlebars', engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')


app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname+'/public'))
app.use('/images', express.static(__dirname+'/public'))
app.use('/api/products', productsRouter)

app.use(upload.single('image'))


app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(500).send('Error en el servidor')
})

import productsRouter from './routes/products.js'


app.post('/api/uploadImage', upload.single('image'), (req,res) => {
    const image = req.file
    if(!image || image.length === 0){
        res.status(500).send({message:"No se subió la imagen"})
    }
    res.send(image)
})

app.get('/views/products', (req,res)=>{
    productsContainer.getAll()
    .then(result => {
        let preparedObj ={
            products : result
        }
        res.render('products', preparedObj)
    })
})

//--------- socket ----------------//
io.on('connection', async socket => {
    console.log(`the socket ${socket.id} is connected`)
    let products = await productsContainer.getAll()
    socket.emit('deliverProducts', products)
    
    socket.emit('messagelog', await chatContainer.getAll())

    socket.on('message', async data => {
        console.log(data)
        await chatContainer.saveChat(data)
        io.emit('messagelog', await chatContainer.getAll())
        
    })
})




//--------- end socket ----------------//