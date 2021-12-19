const moment = require('moment')

function sendClientMsg(text, user) {
    return {
        time: moment().format('h:mm a'),
        text: text,
        user: user,
    }
}

function createUser(id, username, room) {
    let entered = moment().format('h:mm a')

    const user = {
        id: id,
        username: username,
        room: room,
        entered:  entered
    }

    return user
 }

function findUser(users, id) {
   console.log(users);
   return users.find(user => user.id = id);
}


module.exports = {
    sendClientMsg,
    findUser,
    createUser
}