const socket = io()

socket.on('welcome', message => console.log(message))

let user

fetch('/api/login')
    .then(result => result.json())
    .then(response => {
    if (response.status === 'error') {
        location.replace('/')
    } else {
        user = response
        const p = document.getElementById('username')
        p.innerHTML = `Bienvenido <strong class="h1">${user.username}!</strong>`
    }
})

document.getElementById('message').addEventListener('keyup', (e) => {
    if (e.key === 'Enter')
    if (e.target.value) {
        socket.emit('chats', { message: e.target.value, user: user })
        e.target.value = ''
    }
})

socket.on('chats', data => {
    const divChat = document.getElementById('chats')
    const message = data.map(chat => {
    return `<div class='d-flex align-items-center flex-wrap p-2'>
                <img src='${chat.user.avatar}' class='rounded-circle pe-2' style='height: 45px; width: auto;' /><span style='color: blue; font-weight: 600;'>${chat.user.email}</span> [<span style='color: brown;'>${formatISODate(chat.createdAt)}</span>]: <span style='color: green;font-style: italic;'>${chat.text}</span>
            </div>`
    }).join('')
    divChat.innerHTML = message
})

function formatISODate(date) {
    if (!date) return
    const DATE = date.split('T')[0]
    const HOUR = date.split('T')[1]
    return DATE + ' ' + HOUR.substring(0, 8)
}

document.getElementById('logout').addEventListener('click', () => location.replace('/logout'))