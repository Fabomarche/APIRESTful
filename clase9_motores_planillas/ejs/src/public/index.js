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
    }).then(result => location.href='/')
}

document.addEventListener('submit', sendForm);