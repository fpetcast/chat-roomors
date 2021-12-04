const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const RoomorBot = require('../bot/RoomorBot')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

//set static folder
app.use(express.static('public'))

//it runs when client connects
io.on('connection', socket => {
    console.log('New WS connection');
    //bot instance
    const Bot = new RoomorBot(socket.id);
    socket.emit('message',Bot.greetings())
})


const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {console.log(`App is listening on port ${PORT}`);})