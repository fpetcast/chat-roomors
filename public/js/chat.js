export function outputMsg(msg, chatContainer) { 
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `
    <p class="meta">${msg.user} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>
    `
    document.querySelector('.chat-messages').appendChild(div);

    //scrolling the chat
    chatContainer = div.parentElement
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export async function updateUsers(room) {
    const users = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(room),
    }).then((response) => {
        response.json()
    })
    .then((data) => {
        console.log(data);
    })
}