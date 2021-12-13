const express = require("express");
const path = require("path");
const http = require("http");
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const socketio = require("socket.io");
const url = require('url');
//my modules
const RoomorBot = require("./bot/RoomorBot");
const Enum = require("./utils/enum");
const fn = require("./utils/fn");


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
io.on("connection", (socket) => {
  console.log('a client has connected');

  //bot instance
  const Bot = new RoomorBot(socket.id, Enum.BOTNAME);

  //
  socket.on('joinEvent', (user) => {

    //emit event on the single client connection
    socket.emit("hello", Bot.greetings(user.username));

    //To all connected clients except the sender
    socket.broadcast.emit("botAlert", Bot.alertUsers(Enum.JOIN));
  })

  //Run when clients disconnect
  socket.on("disconnect", () => {
    io.emit("botAlert", Bot.alertUsers(Enum.LEFT));
  });

  //listen for client message
  socket.on("newMsg", (msg) => {
    io.emit("msg", fn.sendClientMsg(msg, 'User'));
  });
});

//ROUTING
app.get('/', function(req, res) {
  res.render('index')
});

app.get('/chat', (req, res) => {
  // res.cookie('username', username);
  // res.cookie('room', room)
  // res.send('good');
  res.render('chat');
})

//PORT and SERVING the node app
const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
