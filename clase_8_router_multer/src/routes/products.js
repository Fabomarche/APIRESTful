const express = require('express')
const router = express.Router()
const upload = require('../services/upload')

const Container = require('../classes/Container')
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
    let product = req.body
    console.log(product)
    // let thumbnail = "http://localhost:8080/images/"+ req.file.filename
    // product.thumbnail = thumbnail
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


module.exports = router