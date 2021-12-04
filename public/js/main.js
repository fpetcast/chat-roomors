const socket = io();

socket.on("connect", () => {
    
});

socket.on("message", (greeting) => {
    console.log(greeting);
})