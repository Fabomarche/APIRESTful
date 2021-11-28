const socket = io()
//-----------Socket Events-----------//
socket.on('deliverProducts', data => {
    fetch('templates/productsTable.handlebars')
    .then(string => string.text())
    .then(template => {
        const processedTemplate = Handlebars.compile(template)
        const templateObj = {
            products:data
        }
        const html = processedTemplate(templateObj)
        let div = document.getElementById('productTable')
        div.innerHTML = html
    })
})

//-----------Fin Socket Events-----------//
const sendForm = (event) => {
    event.preventDefault()
    let form = document.querySelector('#productForm')
    let data = new FormData(form)

    fetch('/api/products', {
        method: 'POST',
        body: data,
    }).then(result => {
        return result.json()
    }).then(json => {
        console.log(json)
        return {status:"success", message:"Producto Agregado"}
    })
    .then(result => location.href='/')
}

document.addEventListener('submit', sendForm);