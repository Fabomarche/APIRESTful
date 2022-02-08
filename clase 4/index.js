const Contenedor = require('./classes/Contenedor')

const ListaDeProductos = new Contenedor("Products")

const  escuadra = {                                                                                                                                                   
    title: 'Escuadra',                                                                                                                                 
    price: 123.45,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',                                                                                                                                                                                 
}

const calculadora = {                                                                                                                                                    
    title: 'Calculadora',                                                                                                                              
    price: 234.56,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',                                                                                                                                                                                      
}

const globo = {                                                                                                                                                    
    title: 'Globo Terráqueo',                                                                                                                          
    price: 345.67,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',                                                                                                                                                                                 
} 

const tijera = {                                                                                                                                                    
    title: 'Tijera',                                                                                                                          
    price: 345.67,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',                                                                                                                                                                              
} 



// ListaDeProductos.save(escuadra)
// ListaDeProductos.save(tijera) 
ListaDeProductos.save(globo) 
// ListaDeProductos.save(calculadora) 

// ListaDeProductos.getById(3)
// ListaDeProductos.getAll()

// ListaDeProductos.deleteById(3)
// ListaDeProductos.deleteAll()


// ListaDeProductos.deleteAll()
