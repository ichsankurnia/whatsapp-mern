import { io } from 'socket.io-client'

const socket = io('http://localhost:9000')

socket.on("handle", (data) => {
    console.log(data)
})

socket.on('sent', (data) => {
    console.log(data)
})

socket.on('message', (data) => {
    console.log(data)
})

export default socket