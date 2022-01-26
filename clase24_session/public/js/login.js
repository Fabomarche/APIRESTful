document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const form = document.getElementById('loginForm')
  const formData = new FormData(form)

  const user = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(result => result.json())
    .then(response => { 
      if (response.status === 'success') {
        location.replace('chat')
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.message,
          icon: 'error',
        })
      }
    })
})
