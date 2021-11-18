const express = require('express')
const cors = require('cors')
const upload = require('./services/upload')

const app = express()
const server = app.listen(8080, () => {
    console.log("server listening on port 8080")
})

const Container = require('./classes/Container')
const productsContainer = new Container();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(upload.single('image'))

app.use(cors())

app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(500).send('Error en el servidor')
})

const productsRouter = require('../src/routes/products')
app.use('/api/products', productsRouter)

app.use('/images', express.static(__dirname+'/public'))

app.post('/api/uploadImage', upload.single('image'), (req,res) => {
    const image = req.file
    if(!image || image.length === 0){
        res.status(500).send({message:"No se subió la imagen"})
    }
    res.send(image)
})
