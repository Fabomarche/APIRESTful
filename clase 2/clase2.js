class Usuario {
    constructor (nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this. libros = libros;
        this. mascotas = mascotas;
    }

    getFullName () {return this.nombre + ' ' + this.apellido}

    addMascota(nuevaMascota) {this.mascotas.push(nuevaMascota)}

    contMascotas() {return `${this.nombre} tiene ${this.mascotas.length} mascotas`}

    addBook(nombre, autor) {this.libros.push({nombre, autor})}

    getBookNames() {return this.libros.map(libro => libro.nombre)}
    
}

const yo = new Usuario("Fabricio", 'Marchetti',[{nombre: "El Hombre en el Castillo", autor: "Philip Dick"}, {nombre:'Neuromante',autor: "William Gibson"}], ['Chicha', 'Michi'])

console.log(yo.getFullName())

console.log(yo.contMascotas())
yo.addMascota("Raul")
console.log(yo.contMascotas())

yo.addBook("El problema de los tres cuerpos", "Cixin Liu")
console.log(yo.libros)
console.log(yo.getBookNames())
