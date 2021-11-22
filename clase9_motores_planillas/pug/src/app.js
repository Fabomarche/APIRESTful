import express from 'express'
import cors from 'cors'
import upload from './services/upload.js'
import Container from './classes/Container.js'

const app = express()
const server = app.listen(8080, () => {
    console.log("server listening on port 8080")
})

const productsContainer = new Container('products');

app.set('views', './views')
app.set('view engine', 'pug')


app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))
app.use('/images', express.static('/public'))
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