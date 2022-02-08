const fs = require('fs')
const { title } = require('process')

class Contenedor {
    constructor(archiveName){
        this.archiveName = archiveName
    }
    
    async save(product){
        try{
            
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)

            if(products.some(prod => prod.title === product.title)){
                console.log(`${JSON.stringify(product.title)} ya existe en ${this.archiveName}`)
            }else{
                let dataProduct = {
                    id: products.length + 1,
                    title: product.title,
                    price: product.price,                                                                                                                                     
                    thumbnail: product.thumbnail,                                                                                                                                                                                 
                }
                products.push(dataProduct)
                
                try{
                    await fs.promises.writeFile(`./files/${this.archiveName}.txt`, JSON.stringify(products, null, 2))
                    console.log(`${product.title} fue agregado a ./files/${this.archiveName}.txt`)
                }catch(err){
                    console.log(`No se pudo escribir el archivo ${err}`)
                }
                }
        }
        catch(err){
            let dataProduct = {
                id: 1,
                title: product.title,
                price: product.price,                                                                                                                                     
                thumbnail: product.thumbnail,                                                                                                                                                                                 
            }
            try{
                await fs.promises.writeFile(`./files/${this.archiveName}.txt`, JSON.stringify([dataProduct], null, 2))
                console.log(`Se creó ./files/${this.archiveName}.txt y se agregó ${product.title}`)
            }
            catch(err){
                console.log(err)
            }
        }
    }

    async getById(idNumber){
        try{
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)
            
            let searchedProduct = products.find(prod => prod.id === idNumber)

            if(searchedProduct){
                console.log(searchedProduct)
                return searchedProduct
            }else{
                console.log(null)
                return null
            }
            
        }
        catch(err){
            console.log(err)
        }
        

    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)
            
                console.log(products)
                return products
        }
        catch(err){
            console.log(`Probablemente no hay productos en ./files/${this.archiveName}.txt - ${err}`)
        }
    }

    async deleteById(idNumber){
        try{
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)
            
            let index = products.findIndex(prod => prod.id === idNumber)
            let deletedProduct = products.find(prod => prod.id === idNumber)

            if(index > -1){
                products.splice(1, index)
                try{
                    await fs.promises.writeFile(`./files/${this.archiveName}.txt`, JSON.stringify(products, null, 2))
                    console.log(`Se eliminó ${deletedProduct.title} de ./files/${this.archiveName}.txt`)
                }
                catch(err){
                    console.log(err)
                }
            }else{
                console.log(`Error: no existe un producto con esa Id`)
            }
            
        }
        catch(err){
            console.log(err)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`./files/${this.archiveName}.txt`, [])
            console.log(`Se eliminó todos los productos de ./files/${this.archiveName}.txt`)
        }
        catch(err){
            console.log(err) 
        }
    }
}

module.exports = Contenedor