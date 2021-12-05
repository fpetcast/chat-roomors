const express = require("express");
const path = require("path");
const http = require("http");
const cors = require('cors')
const bodyParser = require('body-parser')
const socketio = require("socket.io");
const RoomorBot = require("../bot/RoomorBot");
const Enum = require("../utils/enum");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Middleware
app.use(bodyParser.json())
app.use(cors())

//set static folder
app.use(express.static("public"));

//serve vue js

//it runs when client connects
io.on("connection", (socket) => {
  //bot instance
  const Bot = new RoomorBot(socket.id);

  //emit event on the single client connection
  socket.emit("hello", Bot.greetings());

  //To all connected clients except the sender
  socket.broadcast.emit("botAlert", Bot.alertUsers(Enum.JOIN));

  //Run when clients disconnect
  socket.on("disconnect", () => {
    io.emit("botAlert", Bot.alertUsers(Enum.LEFT));
  });

  //listen for client message
  socket.on("newMsg", (msg) => {
    console.log(msg);
    io.emit("msg", msg);
  });
});

const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
