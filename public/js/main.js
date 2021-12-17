import {outputMsg} from './chat.js'

const socket = io("http://localhost:4000");
const chatInput = document.getElementById('chat-form');
const chatMessagesContainer = document.getElementById('.chat-messages');

//send username and room to the server
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get('username'));
let users = [];
let username = urlParams.get('username')
let room = urlParams.get('room')
document.getElementById('room-name').innerText = room;


socket.on("connect", () => {
    socket.emit('joinEvent', {username , room})
    users.push(username);
    users.forEach(user => {
        let li = document.createElement("li");
        document.getElementById('users').append(li);
        li.innerText = user;
    });
});

//Roomor Bot greetings
socket.on("hello", (greeting) => {
    setTimeout(() => {
        outputMsg(greeting)
    }, 600);
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
let msg = e.target.elements.msg.value;
socket.emit('newMsg', msg)

//clear the input
e.target.elements.msg.value = '';
e.target.elements.msg.focus();
})

//Print new message
socket.on("msg", (newMsg) => {
    setTimeout(() => {
        outputMsg(newMsg)
    }, 600);
})

