const socket = io();

socket.on("connect", () => {
    
});

socket.once("hello", (greeting) => {
    console.log(greeting);
})

socket.on("message", (message) => {
    console.log(message);
})