/*  document.querySelector('#image').addEventListener('change', event => {
    handleImageUpload(event)
}) 
const handleImageUpload = event => {
    const files = event.target.files
    const imgData = new FormData()
    imgData.append('image', files[0])
    
    fetch('http://localhost:8080/api/uploadImage', {
        method: 'POST',
        body: imgData,
    
    })
        .then(response => response.json())
        .then(data => {
        console.log(data)
        })
        .catch(error => {
        console.error(error)
        })
    }
 */

document.addEventListener('submit', event => {
    event.preventDefault()

    let form = document.querySelector('#productForm')
    let data = new FormData(form)

    let fileInput = document.querySelector('#image')
    let imgData = new FormData(form);
    imgData.append('image', fileInput.files[0]);
    

    fetch('http://localhost:8080/api/uploadImage', {
        method: 'POST',
        body: imgData,
        headers:{
            "Content-type":"multipart/form-data"
        }
    }).then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.error(error)
    })


    let req = {
        title: data.get('title'),
        price: data.get('price'),
        thumbnail: ""
    }

    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        body: JSON.stringify(req),
        headers:{
            "Content-type":"application/json"
        }
    }).then(result => {
        return result.json()
    }).then(json => {
        console.log(json)
        return {status:"success", message:"Producto Agregado"}
    })
})
