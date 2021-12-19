const express = require("express");
const path = require("path");
const http = require("http");
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const socketio = require("socket.io");
const url = require('url');
const moment = require('moment');
//my modules
const RoomorBot = require("./bot/RoomorBot");
const Enum = require("./utils/enum");
const fn = require("./utils/fn");
const { rawListeners } = require("process");


const app = express();


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

const users = []
const Bot = new RoomorBot(Enum.BOTNAME);
let rawConfig = fs.readFileSync('./config/config.json');
const config = JSON.parse(rawConfig);

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

  socket.on('joinEvent', ({username, room}) => {
    //username and room for a single session
    socket.username = username
    socket.room = room
    let userJoin = fn.createUser(socket.id, socket.username, socket.room);
    console.log('############################');
    console.log('connect: ' +  userJoin.username + ' to ' + room);
    console.log(userJoin);
    console.log('############################');

    users.push(userJoin);

    
    //join the selected room
    socket.join(room);
    console.log('############################');
    console.log(users);
    console.log('############################');

    //check the room and the related clients
    // console.log(socket.rooms);

    //emit event to all the users in the room
    // io.to(user.room).emit("hello", Bot.greetings(user.username));

    //updating Room
    io.to(room).emit("updateRoom", users);

    //To all connected clients except the sender
    io.to(room).emit("botAlert", Bot.alertUsers(Enum.JOIN, socket.username));
  })

  //listen for client message
  socket.on("newMsg", (msg) => {
    console.log(users);
    let currentUser
    users.forEach(user => {
      if (user.id == socket.id) {
        currentUser = user
      }
    });
    console.log(currentUser);
    io.to(socket.room).emit("msg", fn.sendClientMsg(msg, currentUser.username));
  });

  //Run when clients disconnect
  socket.on("disconnect", () => {
    let currentUser
    users.forEach(user => {
      if (user.id == socket.id) {
        currentUser = user
      }
    });
    console.log('############################');
    console.log('disconnect: '+ currentUser.username);
    console.log(currentUser);
    console.log('############################');

    const index = users.indexOf(currentUser);
    if (index > -1) {
      users.splice(index, 1)[0];
    }

    socket.leave(socket.room)
    console.log('############################');
    console.log(users);
    console.log('############################');

    io.to(socket.room).emit("updateRoom", users);

    socket.to(socket.room).emit("botAlert", Bot.alertUsers(Enum.LEFT, socket.username));
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

// app.post('/users', (req, res) => {
//   console.log(req);
//   let room = req.room;
//   var clients = io.sockets.clients(room);
// })

//PORT and SERVING the node app
const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
