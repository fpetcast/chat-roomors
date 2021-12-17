const express = require("express");
const path = require("path");
const http = require("http");
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const socketio = require("socket.io");
const url = require('url');
//my modules
const RoomorBot = require("./bot/RoomorBot");
const Enum = require("./utils/enum");
const fn = require("./utils/fn");
const { rawListeners } = require("process");


const app = express();

//CONFIG
let rawConfig = fs.readFileSync('./config/config.json');
const config = JSON.parse(rawConfig);

//MIDDLAWARES
// let allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }
// app.use(allowCrossDomain);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//TEMPLATE ENGINE
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
      origin : "*",
      methods: ["GET", "POST"],  
    }
});

app.use(express.static("../public"));

//Socket

// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     // find existing session
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   // create new session
//   socket.sessionID = randomId();
//   socket.userID = randomId();
//   socket.username = username;
//   next();
// });

io.on("connection", (socket) => {
  console.log('a client has connected');

  //bot instance
  const Bot = new RoomorBot(socket.id, Enum.BOTNAME);

  //
  socket.on('joinEvent', (user) => {
    //username and room for a single session
    socket.username = user.username
    socket.room = user.room

    console.log(socket.room);
    //join the selected room
    socket.join(socket.room);
    //chekc the room and the related clients
    console.log(socket.rooms);

    //emit event on the single client connection
    socket.emit("hello", Bot.greetings(user.username));

    //To all connected clients except the sender
    io.to(socket.room).emit("botAlert", Bot.alertUsers(Enum.JOIN, socket.username));
  })

  //Run when clients disconnect
  socket.on("disconnect", () => {
    io.to(socket.room).emit("botAlert", Bot.alertUsers(Enum.LEFT, socket.username));
  });

  //listen for client message
  socket.on("newMsg", (msg) => {
    io.to(socket.room).emit("msg", fn.sendClientMsg(msg, socket.username));
  });
});

//ROUTING
app.get('/', function(req, res) {
  const rooms = config.rooms;
  console.log(rooms);
  res.render('index', { 
    rooms: rooms
  })
});

app.get('/chat', (req, res) => {
  res.render('chat');
})

//PORT and SERVING the node app
const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
