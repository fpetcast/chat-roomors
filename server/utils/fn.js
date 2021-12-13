const moment = require('moment')

function sendClientMsg(text, user) {
    return {
        time: moment().format('h:mm a'),
        text: text,
        user: user,
    }
}


module.exports = {
    sendClientMsg
}