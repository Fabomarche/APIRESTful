import fs from 'fs';

class Container {
    constructor(archiveName){
        this.archiveName = archiveName
    }
    
        
    async save(product){
        console.log(product)
        try{
            
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)
            
            if(products.some(prod => prod.title === product.title)){
                console.log(`${JSON.stringify(product.title)} ya existe en ${this.archiveName}`)
                return {status:"error", message:"Este producto ya existe"}
            }else{
                let dataProduct = Object.assign({
                    id: products.length + 1,
                    title: product.title,
                    price: product.price,                                                                                                                                     
                    thumbnail: product.thumbnail,                                                                                                       
                })
                console.log(dataProduct)
                products.push(dataProduct)
                
                try{
                    await fs.promises.writeFile(`./files/${this.archiveName}.txt`, JSON.stringify(products, null, 2))
                    console.log(`${product.title} fue agregado a ./files/${this.archiveName}.txt`)
                    return {status:"success", message:"Producto Agregado"}
                }catch(err){
                    console.log(`No se pudo escribir el archivo ${err}`)
                    return {status:"error", message:"Error al agregar producto "+err}
                }
            }
        }
        catch(err){
            let dataProduct = Object.assign({
                id: 1,
                title: product.title,
                price: product.price,                                                                                                                                     
                thumbnail: product.thumbnail,                                                                                                                                                                                 
            })
            try{
                await fs.promises.writeFile(`./files/${this.archiveName}.txt`, JSON.stringify([dataProduct], null, 2))
                console.log(`Se creó ./files/${this.archiveName}.txt y se agregó ${product.title}`)
                return {status:"success", message:`Se creó ./files/${this.archiveName}.txt y se agregó ${product.title}`}
            }
            catch(err){
                console.log(err)
                return {status:"error", message:"Error al agregar producto "+err}
            }
        }
    }
    
    async getById(idNumber){
        try{
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)
            
            let searchedProduct = products.find(prod => prod.id === idNumber)
            
            if(searchedProduct){
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
            return products
        }
        catch(err){
            console.log(`Probablemente no hay productos en ./files/${this.archiveName}.txt - ${err}`)
        }
    }
    
    async updateProduct(id,body){
        try{
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(prod => prod.id === id)) return {status:"error", message:"No hay productos con el id especificado"}
            let result = products.map( product => {
                if(product.id === id){
                        body = Object.assign(body)
                        body = Object.assign({id:product.id,...body});
                        return body;
                }else{
                    return product;
                }
            })
            try{
                await fs.promises.writeFile(`./files/${this.archiveName}.txt`,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar producto"}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar producto: "+error}
        }
    }

    async deleteById(idNumber){
        try{
            let data = await fs.promises.readFile(`./files/${this.archiveName}.txt`, 'utf-8')
            let products =  JSON.parse(data)
            
            let index = products.findIndex(prod => prod.id === idNumber)
            let deletedProduct = products.find(prod => prod.id === idNumber)

            if(index > -1){
                products.splice(index, 1)
                try{
                    await fs.promises.writeFile(`./files/${this.archiveName}.txt`, JSON.stringify(products, null, 2))
                    console.log(`Se eliminó ${deletedProduct.title} de ./files/${this.archiveName}.txt`)
                    return {status:"success",message:"Producto eliminado"}
                }
                catch(err){
                    console.log(err)
                }
            }else{
                console.log(`Error: no existe un producto con esa Id`)
                return {status:"error", message:"Error: no existe un producto con esa Id"}
            }
            
        }
        catch(err){
            console.log(err)
            return {status:"error", message:"Fallo al eliminar el producto "+err}
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

export default Container