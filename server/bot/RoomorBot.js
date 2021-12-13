const Enum = require('../utils/enum')
const moment = require('moment')

class RoomorBot {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    greetings(username) {
        return this.sendMsg('Welcome to CHAT ROOMORS')
    }

    alertUsers(type) {
        switch (type) {
            case Enum.JOIN:
                return this.sendMsg('A user joined the chat');
                break;
            case Enum.LEFT:
                    return this.sendMsg('A user left the chat');
                    break;
            default:
                break;
        }
    }

    sendMsg(text) {
        return {
            time: moment().format('h:mm a'),
            text: text,
            user: this.name
        }
    }

    formatDate(date) {
        return date.toLocaleString('it-IT', { hour: 'numeric', hour12: true });
    }
}

module.exports = RoomorBot;