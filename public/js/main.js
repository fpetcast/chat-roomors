const socket = io();
const chatInput = document.getElementById('chat-form');

socket.on("connect", () => {
    
});

socket.once("hello", (greeting) => {
    console.log(greeting);
})

socket.on("botAlert", (botMsg) => {
    console.log(botMsg);
})

chatInput.addEventListener('submit', (e) => {
e.preventDefault();

const msg = e.target.elements.msg.value;

socket.emit('newMsg', msg)
})

socket.on("msg", (newMsg) => {
    console.log(newMsg);
})

