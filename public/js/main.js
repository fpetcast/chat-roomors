import {outputMsg , updateUsers} from './chat.js'

const socket = io("http://localhost:4000");
const chatInput = document.getElementById('chat-form');
const chatMessagesContainer = document.getElementById('.chat-messages');
const chatUsersList = document.getElementById('users');
const socketHiddenInput = document.getElementById('socketInput');
const metaChar = '@'

//send username and room to the server
const urlParams = new URLSearchParams(window.location.search);
let username = urlParams.get('username')
let room = urlParams.get('room')
document.getElementById('room-name').innerText = room;
//user DATA


socket.emit('joinEvent', {username , room});


//Roomor Bot greetings
socket.on("hello", (greeting) => {
    setTimeout(() => {
        outputMsg(greeting)
    }, 600);
})

socket.on("updateRoom", (users) => {
    console.log(users);
    console.log(chatUsersList);
    chatUsersList.innerHTML = '';
    users.map(user => {
        if (room == user.room) {
            console.log(user);
            let li = document.createElement('li');
            li.innerText = user.username;
            li.setAttribute('id',user.id);
            chatUsersList.append(li);
        }
    });
})

//Roomor Bot alert Users for specific events
socket.on("botAlert", (botAlert) => {
    setTimeout(() => {
        outputMsg(botAlert)
    }, 600);
})

//Listen for new messages
chatInput.addEventListener('submit', (e) => {
e.preventDefault();

//emit message to the server
let userMsg;
let msg = e.target.elements.msg.value;

if(msg.includes(metaChar) & msg.indexOf(metaChar) == 0) {
    console.log('this is a metacall: ' + msg);
    socket.emit('metaCall', msg);
}else {
    socket.emit('newMsg', msg)
}


//clear the input
e.target.elements.msg.value = '';
e.target.elements.msg.focus();
})

//Print new message
socket.on("msg", (newMsg) => {
    console.log(socket);
    setTimeout(() => {
        outputMsg(newMsg)
    }, 600);
})

//Receive meta event
socket.on("metaResponse", (meta) => {
    console.log(meta);
})

