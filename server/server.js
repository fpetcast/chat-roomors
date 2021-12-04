const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const RoomorBot = require('../bot/RoomorBot')
const Enum = require('../utils/enum')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

//set static folder
app.use(express.static('public'))

//it runs when client connects
io.on('connection', socket => {
    //bot instance
    const Bot = new RoomorBot(socket.id);
    
    //emit event on the single client connection
    socket.emit('hello',Bot.greetings())

    //To all connected clients except the sender
    socket.broadcast.emit('message',Bot.alertUsers(Enum.JOIN))

    //Run when clients disconnect
    socket.on('disconnect', () => {
        io.emit('message', Bot.alertUsers(Enum.LEFT))
    })
})


const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {console.log(`App is listening on port ${PORT}`);})