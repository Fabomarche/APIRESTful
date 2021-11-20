import express from 'express'
const router = express.Router()
import upload from '../services/upload.js'

import Container from '../classes/Container.js'
const productsContainer = new Container('products');

//GETS
router.get('/', (req, res) => {
    productsContainer.getAll()
    .then(result => res.send(result))
})

router.get('/:pid', (req, res) => {
    let id = parseInt(req.params.pid);
    productsContainer.getById(id)
    .then(result=>{
        if(result !== null){
            res.send(result);
        } else{
            res.send({ error : 'producto no encontrado' })
        }
    })
})


//POSTS
router.post('/', upload.single('image'), (req, res) => {
    let file = req.file
    console.log(req.body)
    let product = req.body
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productsContainer.save(product)
    .then(result => res.send(result))
})

//PUTS
router.put('/:pid', (req,res) => {
    let body = req.body;
    let id = parseInt(req.params.pid)
    productsContainer.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})

//DELETES
router.delete('/:pid', (req,res) => {
    let id = parseInt(req.params.pid)
    productsContainer.deleteById(id).then(result => {
        res.send(result)
    })
}) 


export default router